use crate::base_card::BaseCard;
use crate::data::{badge_color, Link, LinkKind, PROJECTS};
use crate::hooks::{use_in_view, use_is_mobile};
use crate::icons;
use crate::physics::use_card_physics;
use crate::section_container::SectionContainer;
use crate::ui::*;
use leptos::html;
use leptos::prelude::*;

fn link_icon(kind: LinkKind) -> AnyView {
    match kind {
        LinkKind::Github => icons::brand_github(20, 1.5).into_any(),
        LinkKind::Devpost => icons::code(20, 1.5).into_any(),
        LinkKind::Website => icons::world(20, 1.5).into_any(),
    }
}

fn link_label(kind: LinkKind) -> &'static str {
    match kind {
        LinkKind::Github => "Github",
        LinkKind::Devpost => "Devpost",
        LinkKind::Website => "Website",
    }
}

#[component]
pub fn Projects() -> impl IntoView {
    let group_ref = NodeRef::<html::Div>::new();
    let group_in_view = use_in_view(group_ref, 0.1);
    let is_mobile = use_is_mobile();
    use_card_physics(group_ref, is_mobile);
    view! {
        <SectionContainer title="Projects" emoji="🚀" mt=50 group_ref=group_ref>
            {PROJECTS
                .iter()
                .map(|pr| {
                    view! {
                        <BaseCard
                            rotation=pr.rotation
                            z=pr.z
                            index=pr.index
                            is_group_in_view=group_in_view
                            is_mobile=is_mobile
                        >
                            <CardSection pad="md">
                                <Group>
                                    <Text size="lg" fw="500">{pr.title}</Text>
                                    {pr
                                        .links
                                        .iter()
                                        .map(|l: &Link| {
                                            view! {
                                                <ActionIcon
                                                    variant="transparent"
                                                    size="sm"
                                                    color="dimmed"
                                                    href=l.href
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    aria_label=link_label(l.kind)
                                                >
                                                    {link_icon(l.kind)}
                                                </ActionIcon>
                                            }
                                        })
                                        .collect_view()}
                                </Group>
                            </CardSection>
                            <Text size="sm">{pr.description}</Text>
                            <Group gap="xs" style="margin-top:var(--m-spacing-md);">
                                {pr
                                    .tech
                                    .iter()
                                    .map(|t| view! { <Badge color=badge_color(t)>{*t}</Badge> })
                                    .collect_view()}
                            </Group>
                        </BaseCard>
                    }
                })
                .collect_view()}
        </SectionContainer>
    }
}
