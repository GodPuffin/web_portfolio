use crate::hooks::use_in_view;
use leptos::html;
use leptos::prelude::*;

#[component]
pub fn BaseCard(
    rotation: f64,
    z: i32,
    index: usize,
    #[prop(into)] is_group_in_view: Signal<bool>,
    #[prop(into)] is_mobile: Signal<bool>,
    children: Children,
) -> impl IntoView {
    let node = NodeRef::<html::Div>::new();
    let self_in_view = use_in_view(node, 0.0);
    let should = Memo::new(move |_| {
        if is_mobile.get() {
            self_in_view.get()
        } else {
            is_group_in_view.get()
        }
    });
    let delay = Memo::new(move |_| {
        if is_mobile.get() {
            0.2
        } else {
            index as f64 * 0.15
        }
    });

    // Reproduce the marginLeft overlap quirk: `-${40 - z*10}px`; z>=5 => invalid => 0.
    let v = 40 - z * 10;
    let ml = if v >= 0 {
        format!("-{v}px")
    } else {
        "0px".to_string()
    };
    let card_style =
        format!("--ml:{ml};--cz:{z};--card-padding:var(--m-spacing-lg);--pr:var(--m-radius-md);");
    let wrapper_style = move || format!("--rot:{rotation}deg;transition-delay:{}s;", delay.get());

    view! {
        <div
            node_ref=node
            class="reveal card-wrapper"
            class:in-view=move || should.get()
            style=wrapper_style
        >
            <div class="m-card base-card" data-border="true" style=card_style>
                {children()}
            </div>
        </div>
    }
}
