use crate::basic_footer::BasicFooter;
use crate::education::Education;
use crate::experience::Experience;
use crate::navbar::Navbar;
use crate::projects::Projects;
use crate::ui::*;
use crate::welcome::Welcome;
use leptos::prelude::*;

#[component]
pub fn Home() -> impl IntoView {
    view! {
        <Navbar />
        <Container size="lg" style="padding:var(--m-spacing-xl);margin-top:180px;">
            <Welcome />
            <Experience />
            <Projects />
            <Education />
            <BasicFooter />
        </Container>
    }
}
