//! Color-scheme context — mirrors Mantine's useMantineColorScheme.
//! Persists to localStorage and reflects onto `<html data-scheme>`.
use crate::dom::{doc_element, local_storage};
use leptos::prelude::*;

const KEY: &str = "portfolio-color-scheme";

#[derive(Clone, Copy)]
pub struct Theme {
    pub dark: RwSignal<bool>,
}

impl Theme {
    pub fn toggle(self) {
        self.dark.update(|d| *d = !*d);
    }
    pub fn is_dark(self) -> bool {
        self.dark.get()
    }
}

pub fn provide_theme() {
    let initial = local_storage()
        .and_then(|s| s.get_item(KEY).ok().flatten())
        .map(|v| v == "dark")
        .unwrap_or(false);
    let dark = RwSignal::new(initial);

    Effect::new(move |_| {
        let d = dark.get();
        let scheme = if d { "dark" } else { "light" };
        let _ = doc_element().set_attribute("data-scheme", scheme);
        if let Some(s) = local_storage() {
            let _ = s.set_item(KEY, scheme);
        }
    });

    provide_context(Theme { dark });
}

pub fn use_theme() -> Theme {
    use_context::<Theme>().expect("Theme not provided")
}
