//! Small web-sys helpers.
use web_sys::{Document, Element, Storage, Window};

pub fn window() -> Window {
    web_sys::window().expect("no window")
}

pub fn document() -> Document {
    window().document().expect("no document")
}

pub fn doc_element() -> Element {
    document().document_element().expect("no <html>")
}

pub fn local_storage() -> Option<Storage> {
    window().local_storage().ok().flatten()
}
