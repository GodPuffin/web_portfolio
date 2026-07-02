//! Inlined Tabler icons (v3.40.0, MIT) — exact path data, outline style.
use leptos::prelude::*;

fn svg(size: u32, stroke: f64, paths: &'static str) -> impl IntoView {
    view! {
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width=size
            height=size
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width=stroke
            stroke-linecap="round"
            stroke-linejoin="round"
            inner_html=paths
        ></svg>
    }
}

pub fn brand_github(size: u32, stroke: f64) -> impl IntoView {
    svg(
        size,
        stroke,
        r#"<path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5"/>"#,
    )
}

pub fn brand_linkedin(size: u32, stroke: f64) -> impl IntoView {
    svg(
        size,
        stroke,
        r#"<path d="M8 11v5"/><path d="M8 8v.01"/><path d="M12 16v-5"/><path d="M16 16v-3a2 2 0 1 0 -4 0"/><path d="M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4l0 -10"/>"#,
    )
}

pub fn brand_instagram(size: u32, stroke: f64) -> impl IntoView {
    svg(
        size,
        stroke,
        r#"<path d="M4 8a4 4 0 0 1 4 -4h8a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4l0 -8"/><path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"/><path d="M16.5 7.5v.01"/>"#,
    )
}

pub fn mail(size: u32, stroke: f64) -> impl IntoView {
    svg(
        size,
        stroke,
        r#"<path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10"/><path d="M3 7l9 6l9 -6"/>"#,
    )
}

pub fn download(size: u32, stroke: f64) -> impl IntoView {
    svg(
        size,
        stroke,
        r#"<path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"/><path d="M7 11l5 5l5 -5"/><path d="M12 4l0 12"/>"#,
    )
}

pub fn category2(size: u32, stroke: f64) -> impl IntoView {
    svg(
        size,
        stroke,
        r#"<path d="M14 4h6v6h-6l0 -6"/><path d="M4 14h6v6h-6l0 -6"/><path d="M14 17a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/><path d="M4 7a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/>"#,
    )
}

pub fn moon_stars(size: u32, stroke: f64) -> impl IntoView {
    svg(
        size,
        stroke,
        r#"<path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454l0 .008"/><path d="M17 4a2 2 0 0 0 2 2a2 2 0 0 0 -2 2a2 2 0 0 0 -2 -2a2 2 0 0 0 2 -2"/><path d="M19 11h2m-1 -1v2"/>"#,
    )
}

pub fn sun(size: u32, stroke: f64) -> impl IntoView {
    svg(
        size,
        stroke,
        r#"<path d="M8 12a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"/><path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7"/>"#,
    )
}

pub fn arrow_left(size: u32, stroke: f64) -> impl IntoView {
    svg(
        size,
        stroke,
        r#"<path d="M5 12l14 0"/><path d="M5 12l6 6"/><path d="M5 12l6 -6"/>"#,
    )
}

pub fn code(size: u32, stroke: f64) -> impl IntoView {
    svg(
        size,
        stroke,
        r#"<path d="M7 8l-4 4l4 4"/><path d="M17 8l4 4l-4 4"/><path d="M14 4l-4 16"/>"#,
    )
}

pub fn world(size: u32, stroke: f64) -> impl IntoView {
    svg(
        size,
        stroke,
        r#"<path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"/><path d="M3.6 9h16.8"/><path d="M3.6 15h16.8"/><path d="M11.5 3a17 17 0 0 0 0 18"/><path d="M12.5 3a17 17 0 0 1 0 18"/>"#,
    )
}
