//! A small spring/repulsion field that makes an overlapping row of elements
//! behave physically: each one gently floats in its slot, flees the pointer,
//! and shoves its neighbours — which then spring back into place. This is what
//! gives the "pushing and pulling from each other" feel, used for both the
//! fanned cards (`.card-float`) and the navbar icons (`.nav-float`).
//!
//! Desktop only. On touch / narrow layouts (`max-width: 768px`, matching
//! `use_is_mobile`) the simulation stops entirely; cards fall back to a pure-CSS
//! bob and the navbar swaps to a burger, so nothing is simulated off the
//! desktop path. It is also disabled under `prefers-reduced-motion: reduce`.
//! Both preferences are watched live, so crossing either takes effect without a
//! reload, and the loop re-scans its elements whenever it (re)starts, so a row
//! that unmounts/remounts across the breakpoint (the navbar) is handled.
//!
//! The transform lives on a dedicated wrapper layer (`.card-float` /
//! `.nav-float`) so it never fights the element's own rotation/hover, and
//! because it is a pure translation the box centre stays exact — we recover
//! each element's resting slot every frame as `centre - displacement`, which
//! keeps the field correct through scrolling and the reveal animation.

use crate::dom::{doc_element, window};
use leptos::html;
use leptos::prelude::*;
use std::cell::{Cell, RefCell};
use std::rc::Rc;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use web_sys::{HtmlElement, MediaQueryList};

/// Per-field tuning. Cards are big and slow; navbar icons are small, tightly
/// packed, and snappier.
pub struct FieldConfig {
    /// CSS selector for the transform-layer elements inside the group.
    pub selector: &'static str,
    pub k_home: f64,      // spring back to the slot
    pub damp: f64,        // velocity damping (underdamped -> a little bounce)
    pub k_pointer: f64,   // pointer shove (acceleration at contact)
    pub pointer_r: f64,   // pointer influence radius (px)
    pub k_link: f64,      // neighbour coupling
    pub link_r: f64,      // two items couple when their slots are within this (px)
    pub link_deadzone: f64, // ignore gaps this small so the idle float stays independent
    pub ambient: f64,     // idle float amplitude (px)
    pub wx: f64,          // idle float angular frequency, x (rad/s)
    pub wy: f64,          // idle float angular frequency, y (rad/s)
    pub max_disp: f64,    // clamp so an item never flies off its slot
    pub max_vel: f64,     // clamp velocity (px/s)
    pub phase_step: f64,  // idle-float phase increment per item
}

/// Big, slowly-floating cards.
pub const CARDS: FieldConfig = FieldConfig {
    selector: ".card-float",
    k_home: 90.0,
    damp: 13.0,
    k_pointer: 7500.0,
    pointer_r: 400.0,
    k_link: 22.0,
    link_r: 290.0,
    link_deadzone: 12.0,
    ambient: 6.0,
    wx: 0.5,
    wy: 0.7,
    max_disp: 85.0,
    max_vel: 1500.0,
    phase_step: 1.9,
};

/// Small, tightly-packed navbar icons: stiffer springs, shorter reach, less
/// travel, and a barely-there float so the persistent navbar isn't distracting.
pub const NAV_ICONS: FieldConfig = FieldConfig {
    selector: ".nav-float",
    k_home: 170.0,
    damp: 16.0,
    k_pointer: 3000.0,
    pointer_r: 145.0,
    k_link: 55.0,
    link_r: 66.0,
    link_deadzone: 3.0,
    ambient: 2.0,
    wx: 0.9,
    wy: 1.15,
    max_disp: 20.0,
    max_vel: 700.0,
    phase_step: 1.3,
};

struct Item {
    el: HtmlElement,
    dx: f64, // displacement from slot
    dy: f64,
    vx: f64, // velocity (px/s)
    vy: f64,
    cx: f64, // current centre (client px, read each frame)
    cy: f64,
    hx: f64, // resting slot centre = current centre - displacement
    hy: f64,
    hw: f64, // slot size, for the pointer hover hit-test
    hh: f64,
    phase: f64, // idle-float phase offset, spreads the items out of sync
}

/// Attach a physics field to the elements matching `cfg.selector` inside
/// `group` (a stable container that stays mounted). Call once.
pub fn use_physics_field(group: NodeRef<html::Div>, cfg: &'static FieldConfig) {
    let started = Rc::new(Cell::new(false));
    Effect::new(move |_| {
        // `group.get()` is None until the container mounts; it then stays Some
        // (the container itself never unmounts), so init runs at most once.
        let Some(group_el) = group.get() else { return };
        if started.get() {
            return;
        }
        started.set(true);
        init(group_el.unchecked_into::<HtmlElement>(), cfg);
    });
}

fn mq(query: &str) -> Option<MediaQueryList> {
    window().match_media(query).ok().flatten()
}

fn matches(m: &Option<MediaQueryList>) -> bool {
    m.as_ref().map(|q| q.matches()).unwrap_or(false)
}

/// Rebuild the item list from the current DOM. Called on every (re)start so a
/// row that unmounted/remounted across the breakpoint is picked up fresh.
fn scan(group: &HtmlElement, cfg: &FieldConfig, items: &Rc<RefCell<Vec<Item>>>) {
    let mut v = items.borrow_mut();
    v.clear();
    if let Ok(list) = group.query_selector_all(cfg.selector) {
        for i in 0..list.length() {
            if let Some(el) = list.get(i).and_then(|n| n.dyn_into::<HtmlElement>().ok()) {
                v.push(Item {
                    el,
                    dx: 0.0,
                    dy: 0.0,
                    vx: 0.0,
                    vy: 0.0,
                    cx: 0.0,
                    cy: 0.0,
                    hx: 0.0,
                    hy: 0.0,
                    hw: 0.0,
                    hh: 0.0,
                    phase: i as f64 * cfg.phase_step,
                });
            }
        }
    }
}

fn init(group: HtmlElement, cfg: &'static FieldConfig) {
    let items: Rc<RefCell<Vec<Item>>> = Rc::new(RefCell::new(Vec::new()));

    // Pointer position in client px, plus whether the pointer is on the page.
    let ptr = Rc::new(Cell::new((0.0f64, 0.0f64, false)));
    {
        let p = ptr.clone();
        let mv = Closure::<dyn FnMut(web_sys::MouseEvent)>::new(move |e: web_sys::MouseEvent| {
            p.set((e.client_x() as f64, e.client_y() as f64, true));
        });
        let _ = window()
            .add_event_listener_with_callback("pointermove", mv.as_ref().unchecked_ref());
        mv.forget();

        // The pointer leaving the page, or the tab losing focus, releases the
        // items so they float home instead of freezing mid-shove.
        let p = ptr.clone();
        let release = Closure::<dyn FnMut(web_sys::Event)>::new(move |_e: web_sys::Event| {
            let (x, y, _) = p.get();
            p.set((x, y, false));
        });
        let _ = doc_element()
            .add_event_listener_with_callback("pointerleave", release.as_ref().unchecked_ref());
        let _ =
            window().add_event_listener_with_callback("blur", release.as_ref().unchecked_ref());
        release.forget();
    }

    // Don't simulate a group that's scrolled off-screen.
    let visible = Rc::new(Cell::new(true));
    {
        let vis = visible.clone();
        let cb = Closure::<dyn FnMut(js_sys::Array, web_sys::IntersectionObserver)>::new(
            move |entries: js_sys::Array, _o: web_sys::IntersectionObserver| {
                if let Some(entry) = entries.get(0).dyn_ref::<web_sys::IntersectionObserverEntry>()
                {
                    vis.set(entry.is_intersecting());
                }
            },
        );
        if let Ok(obs) = web_sys::IntersectionObserver::new(cb.as_ref().unchecked_ref()) {
            obs.observe(group.unchecked_ref::<web_sys::Element>());
            std::mem::forget(obs); // observe for the app's lifetime
        }
        cb.forget();
    }

    let last_t = Rc::new(Cell::new(0.0f64));
    let dirty = Rc::new(Cell::new(false));
    let running = Rc::new(Cell::new(false));
    // Watched live (not read once), so toggling reduced-motion — or crossing the
    // mobile breakpoint — after load takes effect without a reload.
    let mobile_mql = mq("(max-width: 768px)");
    let reduced_mql = mq("(prefers-reduced-motion: reduce)");

    // The rAF loop. It reschedules itself ONLY while active; when it stands down
    // (reduced-motion or the narrow/touch layout) it stops entirely, so the
    // battery-sensitive path does no per-frame work. The re-arm triggers below
    // restart it — clearing the item list so the loop re-scans the DOM — when we
    // return to the active state. The self-referential Rc keeps the closure
    // alive for the app's lifetime (the container never unmounts).
    let f: Rc<RefCell<Option<Closure<dyn FnMut(f64)>>>> = Rc::new(RefCell::new(None));
    {
        let f2 = f.clone();
        let group = group.clone();
        let items = items.clone();
        let ptr = ptr.clone();
        let visible = visible.clone();
        let last_t = last_t.clone();
        let dirty = dirty.clone();
        let running = running.clone();
        let mobile_mql = mobile_mql.clone();
        let reduced_mql = reduced_mql.clone();
        *f.borrow_mut() = Some(Closure::<dyn FnMut(f64)>::new(move |t: f64| {
            let prev = last_t.get();
            last_t.set(t);
            let dt = if prev == 0.0 {
                0.016
            } else {
                ((t - prev) / 1000.0).clamp(0.0, 0.033)
            };

            // Stand down for reduced-motion or the narrow/touch layout: clear the
            // transform we left behind (once) and reset each item's motion so a
            // later return starts from its slot, then stop the loop.
            if matches(&reduced_mql) || matches(&mobile_mql) {
                if dirty.get() {
                    for it in items.borrow_mut().iter_mut() {
                        let _ = it.el.style().remove_property("transform");
                        it.dx = 0.0;
                        it.dy = 0.0;
                        it.vx = 0.0;
                        it.vy = 0.0;
                    }
                    dirty.set(false);
                }
                running.set(false);
                return;
            }

            // Fresh start (or after a remount): re-scan the DOM. Runs inside the
            // rAF, i.e. after any pending render, so remounted elements exist.
            if items.borrow().is_empty() {
                scan(&group, cfg, &items);
                if items.borrow().is_empty() {
                    running.set(false); // nothing to animate; a later re-arm retries
                    return;
                }
            }

            if visible.get() {
                simulate(&items, &ptr, dt, t, cfg);
                dirty.set(true);
            }

            if running.get() {
                if let Some(cb) = f2.borrow().as_ref() {
                    let _ = window().request_animation_frame(cb.as_ref().unchecked_ref());
                }
            }
        }));
    }

    // (Re)start the loop when it isn't already running and we're active.
    let rearm: Rc<dyn Fn()> = {
        let f = f.clone();
        let running = running.clone();
        let last_t = last_t.clone();
        let items = items.clone();
        let mobile_mql = mobile_mql.clone();
        let reduced_mql = reduced_mql.clone();
        Rc::new(move || {
            if running.get() || matches(&reduced_mql) || matches(&mobile_mql) {
                return;
            }
            running.set(true);
            last_t.set(0.0); // reset dt after an idle gap
            items.borrow_mut().clear(); // force a fresh DOM scan in the loop
            if let Some(cb) = f.borrow().as_ref() {
                let _ = window().request_animation_frame(cb.as_ref().unchecked_ref());
            }
        })
    };

    // Re-arm whenever we leave the standing-down state (mobile -> desktop, or
    // reduced-motion turned off). Both fire this same handler.
    for mql in [mobile_mql.as_ref(), reduced_mql.as_ref()].into_iter().flatten() {
        let rearm = rearm.clone();
        let cb = Closure::<dyn FnMut(web_sys::MediaQueryListEvent)>::new(
            move |_e: web_sys::MediaQueryListEvent| rearm(),
        );
        let _ = mql.add_event_listener_with_callback("change", cb.as_ref().unchecked_ref());
        cb.forget();
    }

    // Initial start (no-op if we load on mobile or under reduced-motion).
    rearm();
}

/// One physics frame over a populated, on-screen item list.
fn simulate(
    items: &Rc<RefCell<Vec<Item>>>,
    ptr: &Rc<Cell<(f64, f64, bool)>>,
    dt: f64,
    t: f64,
    cfg: &FieldConfig,
) {
    let (px, py, active) = ptr.get();
    let secs = t / 1000.0;
    let mut cs = items.borrow_mut();
    let n = cs.len();

    // Read every item's layout first, then write — avoids read/write thrash.
    for c in cs.iter_mut() {
        let r = c.el.get_bounding_client_rect();
        c.hw = r.width();
        c.hh = r.height();
        c.cx = r.left() + c.hw / 2.0;
        c.cy = r.top() + c.hh / 2.0;
        c.hx = c.cx - c.dx;
        c.hy = c.cy - c.dy;
    }

    let mut fx = vec![0.0f64; n];
    let mut fy = vec![0.0f64; n];

    for i in 0..n {
        let c = &cs[i];
        // Idle float: the home spring chases a slowly drifting target so the
        // item traces a gentle ellipse instead of sitting dead still.
        let ax = cfg.ambient * (secs * cfg.wx + c.phase).sin();
        let ay = cfg.ambient * (secs * cfg.wy + c.phase * 1.3).sin();
        fx[i] += -cfg.k_home * (c.dx - ax) - cfg.damp * c.vx;
        fy[i] += -cfg.k_home * (c.dy - ay) - cfg.damp * c.vy;

        // Pointer repulsion, skipping the item directly under the pointer — it
        // stays put to be used and lifts via the CSS hover instead of fleeing.
        if active {
            let hovering = px >= c.cx - c.hw / 2.0
                && px <= c.cx + c.hw / 2.0
                && py >= c.cy - c.hh / 2.0
                && py <= c.cy + c.hh / 2.0;
            if !hovering {
                let rx = c.cx - px;
                let ry = c.cy - py;
                let d = (rx * rx + ry * ry).sqrt().max(0.001);
                if d < cfg.pointer_r {
                    // Linear falloff so a hovered item still reaches its
                    // neighbours and the whole row parts like a bow wave.
                    let s = cfg.k_pointer * (1.0 - d / cfg.pointer_r);
                    fx[i] += s * rx / d;
                    fy[i] += s * ry / d;
                }
            }
        }
    }

    // Neighbour coupling: a soft spring toward the rest gap between two slots.
    // Compressed (crowded) -> push apart; stretched -> pull together. A deadzone
    // keeps the idle float from continuously tugging on the links.
    for i in 0..n {
        for j in (i + 1)..n {
            let rest = {
                let rx = cs[j].hx - cs[i].hx;
                let ry = cs[j].hy - cs[i].hy;
                (rx * rx + ry * ry).sqrt()
            };
            if !(1.0..cfg.link_r).contains(&rest) {
                continue;
            }
            let dx = cs[j].cx - cs[i].cx;
            let dy = cs[j].cy - cs[i].cy;
            let dist = (dx * dx + dy * dy).sqrt().max(0.001);
            let stretch = dist - rest;
            let eff = if stretch > cfg.link_deadzone {
                stretch - cfg.link_deadzone
            } else if stretch < -cfg.link_deadzone {
                stretch + cfg.link_deadzone
            } else {
                0.0
            };
            if eff == 0.0 {
                continue;
            }
            let s = cfg.k_link * eff;
            let ux = dx / dist;
            let uy = dy / dist;
            fx[i] += s * ux;
            fy[i] += s * uy;
            fx[j] -= s * ux;
            fy[j] -= s * uy;
        }
    }

    // Integrate (semi-implicit Euler, mass = 1) and write the transform.
    for i in 0..n {
        let c = &mut cs[i];
        c.vx = (c.vx + fx[i] * dt).clamp(-cfg.max_vel, cfg.max_vel);
        c.vy = (c.vy + fy[i] * dt).clamp(-cfg.max_vel, cfg.max_vel);
        c.dx = (c.dx + c.vx * dt).clamp(-cfg.max_disp, cfg.max_disp);
        c.dy = (c.dy + c.vy * dt).clamp(-cfg.max_disp, cfg.max_disp);
        let _ = c.el.style().set_property(
            "transform",
            &format!("translate3d({:.2}px,{:.2}px,0)", c.dx, c.dy),
        );
    }
}
