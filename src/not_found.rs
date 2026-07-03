use crate::icons;
use crate::ui::*;
use leptos::prelude::*;

#[component]
pub fn NotFound() -> impl IntoView {
    view! {
        <Container size="md" style="text-align:center;margin-top:100px;">
            <Title order=1>"404 - Page Not Found! 😢"</Title>
            <Text size="lg" mt="md">"Oops! The page you are looking for does not exist."</Text>
            <div style="margin-top:var(--m-spacing-lg);">
                <Button href="/" left=icons::arrow_left(24, 2.0).into_any()>
                    "Go Back Home"
                </Button>
            </div>
        </Container>
    }
}
