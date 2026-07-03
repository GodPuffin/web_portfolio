use leptos::prelude::*;
use wasm_bindgen::prelude::*;

mod base_card;
mod basic_footer;
mod card_header;
mod data;
mod dom;
mod education;
mod experience;
mod home;
mod hooks;
mod icons;
mod navbar;
mod not_found;
mod physics;
mod projects;
mod section_container;
mod theme;
mod ui;
mod welcome;

/// ISO-8601 UTC build timestamp, injected by build.rs. The footer formats it
/// at runtime in the visitor's timezone.
pub fn build_time() -> &'static str {
    env!("BUILD_TIME")
}

#[wasm_bindgen(start)]
pub fn start() {
    console_error_panic_hook::set_once();
    mount_to_body(App);
}

#[component]
fn App() -> impl IntoView {
    theme::provide_theme();
    let path = dom::window()
        .location()
        .pathname()
        .unwrap_or_else(|_| "/".to_string());
    if path == "/" {
        view! { <home::Home /> }.into_any()
    } else {
        view! { <not_found::NotFound /> }.into_any()
    }
}
