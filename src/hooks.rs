//! Reactive hooks recreating framer-motion `useInView` and Mantine `useMediaQuery`.
use crate::dom::window;
use leptos::html;
use leptos::prelude::*;
use std::cell::RefCell;
use std::rc::Rc;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;

/// Tracks `(max-width: 768px)` like Mantine's `useMediaQuery`.
pub fn use_is_mobile() -> ReadSignal<bool> {
    let (matches, set_matches) = signal(false);
    Effect::new(move |_| {
        if let Ok(Some(mql)) = window().match_media("(max-width: 768px)") {
            set_matches.set(mql.matches());
            let cb = Closure::<dyn FnMut(web_sys::MediaQueryListEvent)>::new(
                move |e: web_sys::MediaQueryListEvent| set_matches.set(e.matches()),
            );
            let _ = mql.add_event_listener_with_callback("change", cb.as_ref().unchecked_ref());
            cb.forget();
        }
    });
    matches
}

/// Fires once when `amount` fraction of the element becomes visible
/// (framer-motion `useInView({ once: true, amount })`).
pub fn use_in_view(node: NodeRef<html::Div>, amount: f64) -> ReadSignal<bool> {
    let (in_view, set_in_view) = signal(false);
    Effect::new(move |_| {
        if in_view.get_untracked() {
            return;
        }
        let Some(el) = node.get() else { return };
        let observer_cell: Rc<RefCell<Option<web_sys::IntersectionObserver>>> =
            Rc::new(RefCell::new(None));
        let cell = observer_cell.clone();
        let cb = Closure::<dyn FnMut(js_sys::Array, web_sys::IntersectionObserver)>::new(
            move |entries: js_sys::Array, _obs: web_sys::IntersectionObserver| {
                if let Some(entry) = entries
                    .get(0)
                    .dyn_ref::<web_sys::IntersectionObserverEntry>()
                {
                    if entry.is_intersecting() {
                        set_in_view.set(true);
                        if let Some(o) = cell.borrow().as_ref() {
                            o.disconnect();
                        }
                    }
                }
            },
        );
        let init = web_sys::IntersectionObserverInit::new();
        init.set_threshold(&JsValue::from_f64(amount));
        if let Ok(observer) =
            web_sys::IntersectionObserver::new_with_options(cb.as_ref().unchecked_ref(), &init)
        {
            let target: &web_sys::Element = el.unchecked_ref();
            observer.observe(target);
            *observer_cell.borrow_mut() = Some(observer);
        }
        cb.forget();
    });
    in_view
}
