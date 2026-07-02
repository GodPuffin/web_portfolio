use crate::ui::*;
use leptos::prelude::*;

#[component]
pub fn BasicFooter() -> impl IntoView {
    let date = crate::build_date();
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
