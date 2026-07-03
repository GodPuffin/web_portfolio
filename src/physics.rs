//! A small spring/repulsion field that makes the fanned cards behave
//! physically: each card gently floats in its slot, flees the pointer, and
//! shoves its neighbours — which then spring back into place. This is what
//! gives the "pushing and pulling from each other" feel.
//!
//! Desktop only. On touch / narrow layouts (`max-width: 768px`, matching
//! `use_is_mobile`) the simulation stands down and the cards fall back to a
//! pure-CSS bob (see `styles/animations.css`), so scrolling stays cheap and
//! the layout is untouched. The whole thing is disabled under
//! `prefers-reduced-motion: reduce`.
//!
//! The transform lives on a dedicated `.card-float` layer so it never fights
//! the card's own rotation/hover transition, and because it is a pure
//! translation the element's box centre stays exact — we recover each card's
//! resting slot every frame as `centre - displacement`, which keeps the field
//! correct through scrolling and the reveal animation.

use crate::dom::{doc_element, window};
use leptos::html;
use leptos::prelude::*;
use std::cell::{Cell, RefCell};
use std::rc::Rc;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use web_sys::HtmlElement;

// --- tuning ---------------------------------------------------------------
const K_HOME: f64 = 90.0; // spring pulling a card back to its slot
const DAMP: f64 = 13.0; // velocity damping (underdamped -> a little bounce)
const K_POINTER: f64 = 7500.0; // pointer shove (acceleration at contact)
const POINTER_R: f64 = 400.0; // pointer influence radius (px), reaches neighbours
const K_LINK: f64 = 22.0; // neighbour coupling: push when crowded, pull when stretched
const LINK_R: f64 = 290.0; // two cards couple when their slots are within this (px)
const LINK_DEADZONE: f64 = 12.0; // ignore gaps this small so idle float stays independent
const AMBIENT: f64 = 6.0; // idle float amplitude (px)
const WX: f64 = 0.5; // idle float angular frequency, x (rad/s)
const WY: f64 = 0.7; // idle float angular frequency, y (rad/s)
const MAX_DISP: f64 = 85.0; // clamp so a card never flies off its slot
const MAX_VEL: f64 = 1500.0; // clamp velocity (px/s)

struct Card {
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
    phase: f64, // idle-float phase offset, spreads the cards out of sync
}

/// Attach the physics field to the cards inside `group` (a section's card row).
/// Call once per section, passing that section's `use_is_mobile` signal.
pub fn use_card_physics(group: NodeRef<html::Div>, is_mobile: ReadSignal<bool>) {
    let started = Rc::new(Cell::new(false));
    Effect::new(move |_| {
        // `group.get()` is None until the row mounts; it then stays Some, so
        // this effect body runs its init at most once.
        let Some(group_el) = group.get() else { return };
        if started.get() {
            return;
        }
        // Always init — reduced-motion (and mobile) are gated per-frame inside
        // the loop, so toggling either preference after load takes effect live
        // without a reload, and the loop idles cheaply when standing down.
        started.set(true);
        init(group_el.unchecked_into::<HtmlElement>(), is_mobile);
    });
}

fn init(group: HtmlElement, is_mobile: ReadSignal<bool>) {
    // Collect the card layers once — they render with the row and never change.
    let cards: Rc<RefCell<Vec<Card>>> = Rc::new(RefCell::new(Vec::new()));
    if let Ok(list) = group.query_selector_all(".card-float") {
        let mut v = cards.borrow_mut();
        for i in 0..list.length() {
            if let Some(el) = list.get(i).and_then(|n| n.dyn_into::<HtmlElement>().ok()) {
                v.push(Card {
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
                    phase: i as f64 * 1.9,
                });
            }
        }
    }
    if cards.borrow().is_empty() {
        return;
    }

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
        // cards so they float home instead of freezing mid-shove.
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

    // Don't simulate a row that's scrolled off-screen.
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

    // requestAnimationFrame loop. The closure holds an Rc to itself so it can
    // reschedule; the resulting cycle keeps it alive for the app's lifetime
    // (sections never unmount), the standard wasm-bindgen rAF pattern.
    let last_t = Rc::new(Cell::new(0.0f64));
    let dirty = Rc::new(Cell::new(false));
    let running = Rc::new(Cell::new(false));
    // Watched live (not read once) so toggling reduced-motion — or crossing the
    // mobile breakpoint — after load takes effect without a reload.
    let reduced_mql = window()
        .match_media("(prefers-reduced-motion: reduce)")
        .ok()
        .flatten();

    // The rAF step reschedules itself ONLY while active. When it stands down
    // (reduced-motion or the narrow/touch layout, which hands off to the CSS
    // bob) it stops the loop entirely, so the battery-sensitive path does no
    // per-frame work; the re-arm triggers below restart it when we reactivate.
    let f: Rc<RefCell<Option<Closure<dyn FnMut(f64)>>>> = Rc::new(RefCell::new(None));
    {
        let f2 = f.clone();
        let cards = cards.clone();
        let ptr = ptr.clone();
        let visible = visible.clone();
        let last_t = last_t.clone();
        let dirty = dirty.clone();
        let running = running.clone();
        let reduced_mql = reduced_mql.clone();
        *f.borrow_mut() = Some(Closure::<dyn FnMut(f64)>::new(move |t: f64| {
            let reduced = reduced_mql.as_ref().map(|m| m.matches()).unwrap_or(false);
            let standing_down = reduced || is_mobile.get_untracked();
            step(t, &cards, &ptr, &visible, &last_t, &dirty, standing_down);
            if standing_down {
                running.set(false); // re-arm restarts us if we reactivate
                return;
            }
            if running.get() {
                if let Some(cb) = f2.borrow().as_ref() {
                    let _ = window().request_animation_frame(cb.as_ref().unchecked_ref());
                }
            }
        }));
    }

    // (Re)start the loop when it isn't already running.
    let rearm: Rc<dyn Fn()> = {
        let f = f.clone();
        let running = running.clone();
        let last_t = last_t.clone();
        Rc::new(move || {
            if running.get() {
                return;
            }
            running.set(true);
            last_t.set(0.0); // reset dt after an idle gap
            if let Some(cb) = f.borrow().as_ref() {
                let _ = window().request_animation_frame(cb.as_ref().unchecked_ref());
            }
        })
    };

    // Arm on desktop, and whenever the viewport returns to it from mobile.
    {
        let rearm = rearm.clone();
        Effect::new(move |_| {
            if !is_mobile.get() {
                rearm();
            }
        });
    }
    // Arm when reduced-motion is turned back off.
    if let Some(mql) = reduced_mql.as_ref() {
        let cb = Closure::<dyn FnMut(web_sys::MediaQueryListEvent)>::new(
            move |e: web_sys::MediaQueryListEvent| {
                if !e.matches() {
                    rearm();
                }
            },
        );
        let _ = mql.add_event_listener_with_callback("change", cb.as_ref().unchecked_ref());
        cb.forget();
    }
}

#[allow(clippy::too_many_arguments)]
fn step(
    t: f64,
    cards: &Rc<RefCell<Vec<Card>>>,
    ptr: &Rc<Cell<(f64, f64, bool)>>,
    visible: &Rc<Cell<bool>>,
    last_t: &Rc<Cell<f64>>,
    dirty: &Rc<Cell<bool>>,
    standing_down: bool,
) {
    // dt in seconds, clamped so the first frame and tab-switches don't jump.
    let prev = last_t.get();
    last_t.set(t);
    let dt = if prev == 0.0 {
        0.016
    } else {
        ((t - prev) / 1000.0).clamp(0.0, 0.033)
    };

    // Standing down (reduced-motion or the narrow/touch layout, which hands off
    // to the CSS bob): clear the transform we left behind (once) and reset each
    // card's motion so a later return starts from its slot instead of snapping
    // back a stale displacement. Done before the visibility gate so the reset
    // still happens on the frame the caller then stops the loop.
    if standing_down {
        if dirty.get() {
            for c in cards.borrow_mut().iter_mut() {
                let _ = c.el.style().remove_property("transform");
                c.dx = 0.0;
                c.dy = 0.0;
                c.vx = 0.0;
                c.vy = 0.0;
            }
            dirty.set(false);
        }
        return;
    }

    if !visible.get() {
        return;
    }

    let (px, py, active) = ptr.get();
    let secs = t / 1000.0;
    let mut cs = cards.borrow_mut();
    let n = cs.len();

    // Read every card's layout first, then write — avoids read/write thrash.
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
        // card traces a gentle ellipse instead of sitting dead still.
        let ax = AMBIENT * (secs * WX + c.phase).sin();
        let ay = AMBIENT * (secs * WY + c.phase * 1.3).sin();
        fx[i] += -K_HOME * (c.dx - ax) - DAMP * c.vx;
        fy[i] += -K_HOME * (c.dy - ay) - DAMP * c.vy;

        // Pointer repulsion, skipping the card directly under the pointer — it
        // stays put to be read and lifts via the CSS hover instead of fleeing.
        if active {
            let hovering = px >= c.cx - c.hw / 2.0
                && px <= c.cx + c.hw / 2.0
                && py >= c.cy - c.hh / 2.0
                && py <= c.cy + c.hh / 2.0;
            if !hovering {
                let rx = c.cx - px;
                let ry = c.cy - py;
                let d = (rx * rx + ry * ry).sqrt().max(0.001);
                if d < POINTER_R {
                    // Linear falloff so a hovered card still reaches its
                    // neighbours and the whole row parts like a bow wave.
                    let s = K_POINTER * (1.0 - d / POINTER_R);
                    fx[i] += s * rx / d;
                    fy[i] += s * ry / d;
                }
            }
        }
    }

    // Neighbour coupling: a soft spring toward the rest gap between two slots.
    // Compressed (crowded) -> push apart; stretched -> pull together.
    for i in 0..n {
        for j in (i + 1)..n {
            let rest = {
                let rx = cs[j].hx - cs[i].hx;
                let ry = cs[j].hy - cs[i].hy;
                (rx * rx + ry * ry).sqrt()
            };
            if !(1.0..LINK_R).contains(&rest) {
                continue;
            }
            let dx = cs[j].cx - cs[i].cx;
            let dy = cs[j].cy - cs[i].cy;
            let dist = (dx * dx + dy * dy).sqrt().max(0.001);
            // Soft deadzone: no coupling for gaps within LINK_DEADZONE of rest,
            // ramping in continuously beyond it. Keeps the idle float clean while
            // still pushing/pulling once the pointer actually crowds a card.
            let stretch = dist - rest;
            let eff = if stretch > LINK_DEADZONE {
                stretch - LINK_DEADZONE
            } else if stretch < -LINK_DEADZONE {
                stretch + LINK_DEADZONE
            } else {
                0.0
            };
            if eff == 0.0 {
                continue;
            }
            let s = K_LINK * eff;
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
        c.vx = (c.vx + fx[i] * dt).clamp(-MAX_VEL, MAX_VEL);
        c.vy = (c.vy + fy[i] * dt).clamp(-MAX_VEL, MAX_VEL);
        c.dx = (c.dx + c.vx * dt).clamp(-MAX_DISP, MAX_DISP);
        c.dy = (c.dy + c.vy * dt).clamp(-MAX_DISP, MAX_DISP);
        let _ = c.el.style().set_property(
            "transform",
            &format!("translate3d({:.2}px,{:.2}px,0)", c.dx, c.dy),
        );
    }
    dirty.set(true);
}
