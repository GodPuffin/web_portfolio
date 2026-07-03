//! Recreated Mantine primitives — only the props actually used, emitting
//! markup + classes whose computed styles match Mantine 7.14.3 exactly.
use crate::hooks::use_in_view;
use leptos::html;
use leptos::prelude::*;

fn ai_size_px(size: &str) -> &'static str {
    match size {
        "sm" => "22px",
        "md" => "28px",
        "lg" => "34px",
        "xl" => "44px",
        _ => "28px",
    }
}

// --------------------------------------------------------------- ActionIcon
#[component]
pub fn ActionIcon(
    #[prop(into)] variant: String,
    #[prop(into)] size: String,
    #[prop(optional, into)] color: String,
    #[prop(optional, into)] hover_color: String,
    #[prop(optional, into)] href: String,
    #[prop(optional, into)] target: String,
    #[prop(optional, into)] rel: String,
    #[prop(optional, into)] aria_label: String,
    #[prop(optional)] on_click: Option<Callback<()>>,
    #[prop(optional, into)] class: String,
    children: Children,
) -> impl IntoView {
    // Render `rel` only when provided so bare links (navbar) stay attribute-free.
    let rel_attr = (!rel.is_empty()).then_some(rel);
    let mut st = format!("--ai-size:{};", ai_size_px(&size));
    if variant == "transparent" && !color.is_empty() {
        st.push_str(&format!("--ai-c:{};", text_color(&color)));
    }
    if !hover_color.is_empty() {
        st.push_str(&format!("--hover-c:{};", hover_color));
    }
    let cls = format!(
        "m-ai {} {class}",
        if hover_color.is_empty() {
            ""
        } else {
            "has-hover"
        }
    );
    if !href.is_empty() {
        view! {
            <a
                class=cls
                data-variant=variant
                style=st
                href=href
                target=target
                rel=rel_attr
                aria-label=aria_label
            >
                {children()}
            </a>
        }
        .into_any()
    } else {
        view! {
            <button
                class=cls
                data-variant=variant
                style=st
                aria-label=aria_label
                on:click=move |_| {
                    if let Some(cb) = on_click {
                        cb.run(());
                    }
                }
            >
                {children()}
            </button>
        }
        .into_any()
    }
}

// ------------------------------------------------------------------- Button
/// variant="default" — the only Button variant used.
#[component]
pub fn Button(
    #[prop(optional, into)] size: String,
    #[prop(optional)] full_width: bool,
    #[prop(optional, into)] href: String,
    #[prop(optional, into)] target: String,
    #[prop(optional)] on_click: Option<Callback<()>>,
    #[prop(optional)] left: Option<AnyView>,
    #[prop(optional, into)] class: String,
    children: Children,
) -> impl IntoView {
    let (h, px, fz) = match size.as_str() {
        "xl" => ("60px", "32px", "var(--m-font-size-xl)"),
        _ => ("36px", "18px", "var(--m-font-size-sm)"),
    };
    let st = format!("--btn-h:{h};--btn-px:{px};--btn-fz:{fz};");
    let target_attr = (!target.is_empty()).then_some(target);
    let has_left = left.is_some();
    let cls = format!(
        "m-btn {} {class}",
        if full_width { "m-btn--block" } else { "" }
    );
    let inner = view! {
        <span class="m-btn-inner">
            {left.map(|l| view! { <span class="m-btn-section">{l}</span> })}
            <span class="m-btn-label">{children()}</span>
        </span>
    };
    if !href.is_empty() {
        view! {
            <a class=cls data-lsec=has_left.to_string() style=st href=href target=target_attr>
                {inner}
            </a>
        }
        .into_any()
    } else {
        view! {
            <button
                class=cls
                data-lsec=has_left.to_string()
                style=st
                on:click=move |_| {
                    if let Some(cb) = on_click {
                        cb.run(());
                    }
                }
            >
                {inner}
            </button>
        }
        .into_any()
    }
}

/// Spacing keyword ("xs".."xl") -> CSS var; a bare number -> "<n>px"; "" -> "".
pub fn sp(kw: &str) -> String {
    match kw {
        "" => String::new(),
        "xs" | "sm" | "md" | "lg" | "xl" => format!("var(--m-spacing-{kw})"),
        n => format!("{n}px"),
    }
}

/// Text `c` prop -> color value.
pub fn text_color(c: &str) -> String {
    match c {
        "" => String::new(),
        "dimmed" => "var(--m-color-dimmed)".into(),
        "white" => "var(--m-color-white)".into(),
        "black" => "var(--m-color-black)".into(),
        "brown" => "#a52a2a".into(),
        other => format!("var(--m-color-{other}-text)"),
    }
}

fn radius_var(kw: &str) -> String {
    match kw {
        "" => "var(--m-radius-default)".into(),
        k => format!("var(--m-radius-{k})"),
    }
}

// ---------------------------------------------------------------- Container
#[component]
pub fn Container(
    #[prop(into)] size: String,
    #[prop(optional, into)] class: String,
    #[prop(optional, into)] style: String,
    children: Children,
) -> impl IntoView {
    view! {
        <div class=format!("m-container {class}") data-size=size style=style>
            {children()}
        </div>
    }
}

// -------------------------------------------------------------------- Paper
#[component]
pub fn Paper(
    #[prop(optional, into)] radius: String,
    #[prop(optional)] with_border: bool,
    #[prop(optional, into)] class: String,
    #[prop(optional, into)] style: String,
    children: Children,
) -> impl IntoView {
    let st = format!("--pr:{};{}", radius_var(&radius), style);
    view! {
        <div class=format!("m-paper {class}") data-border=with_border.to_string() style=st>
            {children()}
        </div>
    }
}

// --------------------------------------------------------- Card.Section
// (Cards are rendered directly as `.m-card` markup in BaseCard/Projects.)
#[component]
pub fn CardSection(
    #[prop(optional, into)] pad: String,
    #[prop(optional, into)] class: String,
    #[prop(optional, into)] style: String,
    children: Children,
) -> impl IntoView {
    let st = if pad.is_empty() {
        style
    } else {
        format!("padding:{};{}", sp(&pad), style)
    };
    view! { <div class=format!("m-card-section {class}") style=st>{children()}</div> }
}

// --------------------------------------------------------------------- Text
fn text_style(
    size: &str,
    c: &str,
    fw: &str,
    inherit: bool,
    mt: &str,
    ml: &str,
    extra: &str,
) -> String {
    let mut s = String::new();
    if !size.is_empty() {
        s.push_str(&format!(
            "--text-fz:var(--m-font-size-{size});--text-lh:var(--m-line-height-{size});"
        ));
    }
    let col = text_color(c);
    if !col.is_empty() {
        s.push_str(&format!("--text-color:{col};"));
    }
    if !fw.is_empty() {
        s.push_str(&format!("font-weight:{fw};"));
    }
    if !mt.is_empty() {
        s.push_str(&format!("margin-top:{};", sp(mt)));
    }
    if !ml.is_empty() {
        s.push_str(&format!("margin-left:{};", sp(ml)));
    }
    if inherit {
        // handled via data-inherit, nothing here
    }
    s.push_str(extra);
    s
}

#[component]
pub fn Text(
    #[prop(optional, into)] size: String,
    #[prop(optional, into)] c: String,
    #[prop(optional, into)] fw: String,
    #[prop(optional, into)] mt: String,
    #[prop(optional, into)] ml: String,
    #[prop(optional, into)] class: String,
    #[prop(optional, into)] style: String,
    children: Children,
) -> impl IntoView {
    let st = text_style(&size, &c, &fw, false, &mt, &ml, &style);
    view! { <p class=format!("m-text {class}") style=st>{children()}</p> }
}

/// Inline `<span>` variant (Mantine `<Text span>`), used for colored words.
#[component]
pub fn TextSpan(
    #[prop(optional, into)] c: String,
    #[prop(optional)] inherit: bool,
    #[prop(optional, into)] class: String,
    #[prop(optional, into)] style: String,
    children: Children,
) -> impl IntoView {
    let st = text_style("", &c, "", inherit, "", "", &style);
    view! {
        <span class=format!("m-text {class}") data-inherit=inherit.to_string() style=st>
            {children()}
        </span>
    }
}

/// Anchor variant (`<Text component="a">`).
#[component]
pub fn TextA(
    #[prop(into)] href: String,
    #[prop(optional, into)] c: String,
    #[prop(optional)] inherit: bool,
    #[prop(optional, into)] target: String,
    #[prop(optional, into)] class: String,
    #[prop(optional, into)] style: String,
    children: Children,
) -> impl IntoView {
    let st = text_style("", &c, "", inherit, "", "", &style);
    view! {
        <a
            href=href
            target=target
            class=format!("m-text {class}")
            data-inherit=inherit.to_string()
            style=st
        >
            {children()}
        </a>
    }
}

// -------------------------------------------------------------------- Title
#[component]
pub fn Title(
    #[prop(into)] order: u8,
    #[prop(optional, into)] ta: String,
    #[prop(optional, into)] class: String,
    #[prop(optional, into)] style: String,
    children: Children,
) -> impl IntoView {
    let h = order; // 1 or 2
    let st = format!(
        "--title-fz:var(--m-h{h}-font-size);--title-lh:var(--m-h{h}-line-height);--title-fw:var(--m-h{h}-font-weight);{}{}",
        if ta.is_empty() { String::new() } else { format!("text-align:{ta};") },
        style
    );
    // Only h1/h2 are used.
    if order == 1 {
        view! { <h1 class=format!("m-title {class}") style=st>{children()}</h1> }.into_any()
    } else {
        view! { <h2 class=format!("m-title {class}") style=st>{children()}</h2> }.into_any()
    }
}

// -------------------------------------------------------------------- Group
#[component]
pub fn Group(
    #[prop(optional, into)] gap: String,
    #[prop(optional, into)] justify: String,
    #[prop(optional, into)] align: String,
    #[prop(optional, into)] wrap: String,
    #[prop(optional)] node_ref: NodeRef<html::Div>,
    #[prop(optional, into)] class: String,
    #[prop(optional, into)] style: String,
    children: Children,
) -> impl IntoView {
    // Always set every var (Mantine sets defaults via defaultProps) so a parent
    // Group's inline vars never inherit into a nested Group.
    let gap = if gap.is_empty() {
        "var(--m-spacing-md)".to_string()
    } else {
        sp(&gap)
    };
    let justify = if justify.is_empty() {
        "flex-start".to_string()
    } else {
        justify
    };
    let align = if align.is_empty() {
        "center".to_string()
    } else {
        align
    };
    let wrap = if wrap.is_empty() {
        "wrap".to_string()
    } else {
        wrap
    };
    let st = format!(
        "--group-gap:{gap};--group-justify:{justify};--group-align:{align};--group-wrap:{wrap};{style}"
    );
    view! {
        <div node_ref=node_ref class=format!("m-group {class}") style=st>
            {children()}
        </div>
    }
}

// -------------------------------------------------------------------- Stack
#[component]
pub fn Stack(
    #[prop(optional, into)] gap: String,
    #[prop(optional, into)] align: String,
    #[prop(optional, into)] justify: String,
    #[prop(optional, into)] class: String,
    #[prop(optional, into)] style: String,
    children: Children,
) -> impl IntoView {
    let gap = if gap.is_empty() {
        "var(--m-spacing-md)".to_string()
    } else {
        sp(&gap)
    };
    let align = if align.is_empty() {
        "stretch".to_string()
    } else {
        align
    };
    let justify = if justify.is_empty() {
        "flex-start".to_string()
    } else {
        justify
    };
    let st = format!("--stack-gap:{gap};--stack-align:{align};--stack-justify:{justify};{style}");
    view! { <div class=format!("m-stack {class}") style=st>{children()}</div> }
}

// -------------------------------------------------------------------- Badge
/// variant="light" size="sm" fw={300} — the only badge shape used.
#[component]
pub fn Badge(#[prop(into)] color: String, children: Children) -> impl IntoView {
    let st = format!(
        "--bdg-bg:var(--m-color-{c}-light);--bdg-fg:var(--m-color-{c}-light-color);",
        c = color
    );
    view! {
        <span class="m-badge" style=st>
            <span class="m-badge-label">{children()}</span>
        </span>
    }
}

// -------------------------------------------------------------------- Image
#[component]
pub fn Image(
    #[prop(into)] src: Signal<String>,
    #[prop(into)] alt: String,
    #[prop(into)] height: u32,
    #[prop(optional, into)] class: String,
) -> impl IntoView {
    view! {
        <img
            class=format!("m-image {class}")
            src=move || src.get()
            alt=alt
            style=format!("height:{height}px;object-fit:contain;")
        />
    }
}

// ------------------------------------------------------------------- Reveal
/// A framer-motion-style reveal: opacity/translateY that plays once when
/// `amount` of the element is visible, after `delay` seconds.
#[component]
pub fn Reveal(
    #[prop(into)] amount: f64,
    #[prop(optional)] delay: f64,
    #[prop(optional, into)] class: String,
    #[prop(optional, into)] style: String,
    children: Children,
) -> impl IntoView {
    let node = NodeRef::<html::Div>::new();
    let in_view = use_in_view(node, amount);
    let st = format!("transition-delay:{delay}s;{style}");
    view! {
        <div
            node_ref=node
            class=format!("reveal {class}")
            class:in-view=move || in_view.get()
            style=st
        >
            {children()}
        </div>
    }
}
