use crate::theme::use_theme;
use crate::ui::*;
use leptos::prelude::*;

#[component]
pub fn CardHeader(
    #[prop(into)] title: String,
    #[prop(optional, into)] logo: String,
    #[prop(optional, into)] dark_logo: String,
    #[prop(optional)] logo_height: u32,
    #[prop(optional)] children: Option<Children>,
) -> impl IntoView {
    let theme = use_theme();
    let has_logo = !logo.is_empty() || !dark_logo.is_empty();
    let h = if logo_height == 0 { 50 } else { logo_height };
    let src = {
        let logo = logo.clone();
        let dark = dark_logo.clone();
        Signal::derive(move || {
            if theme.is_dark() && !dark.is_empty() {
                dark.clone()
            } else {
                logo.clone()
            }
        })
    };
    let alt = title.clone();
    view! {
        <CardSection pad="md">
            {has_logo.then(move || view! { <Image src=src alt=alt height=h class="card-logo" /> })}
            <div>
                {(!has_logo).then(move || view! { <Text size="lg">{title.clone()}</Text> })}
                {children.map(|c| c())}
            </div>
        </CardSection>
    }
}
