use crate::ui::*;
use leptos::prelude::*;
use wasm_bindgen::JsValue;

/// Format the build timestamp in the visitor's local timezone as en-CA
/// (YYYY-MM-DD), matching the original `new Date(BUILD_TIME).toLocaleDateString("en-CA")`.
fn build_date_local() -> String {
    let iso = crate::build_time();
    if iso.is_empty() {
        return String::new();
    }
    let date = js_sys::Date::new(&JsValue::from_str(iso));
    let formatted = date.to_locale_date_string("en-CA", &JsValue::UNDEFINED);
    JsValue::from(formatted).as_string().unwrap_or_default()
}

#[component]
pub fn BasicFooter() -> impl IntoView {
    let date = build_date_local();
    view! {
        <Reveal amount=0.0 style="position:relative;z-index:3;margin-top:100px;">
            <Paper with_border=true style="padding:var(--m-spacing-md);">
                <Container size="md">
                    <Group justify="space-between">
                        <Text size="sm" c="dimmed">"Made in Montreal."</Text>
                        <Text size="sm" c="dimmed">
                            {(!date.is_empty()).then(|| format!("Updated on {date}"))}
                        </Text>
                    </Group>
                </Container>
            </Paper>
        </Reveal>
    }
}
