use crate::ui::*;
use leptos::html;
use leptos::prelude::*;

#[component]
pub fn SectionContainer(
    #[prop(into)] title: String,
    #[prop(into)] emoji: String,
    #[prop(optional)] mt: u32,
    group_ref: NodeRef<html::Div>,
    children: Children,
) -> impl IntoView {
    let mt = if mt == 0 { 100 } else { mt };
    view! {
        <Container size="md">
            <Stack gap="xl" style=format!("margin-top:{mt}px;margin-bottom:50px;")>
                <Container size="xs" style="z-index:5;">
                    <Reveal amount=0.3 delay=0.2>
                        <Title order=2 ta="center">{title} " " {emoji}</Title>
                    </Reveal>
                </Container>
                <Group
                    node_ref=group_ref
                    justify="center"
                    align="flex-start"
                    style="position:relative;"
                >
                    {children()}
                </Group>
            </Stack>
        </Container>
    }
}
