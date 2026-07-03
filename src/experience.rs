use crate::base_card::BaseCard;
use crate::card_header::CardHeader;
use crate::data::{badge_color, EXPERIENCES};
use crate::hooks::{use_in_view, use_is_mobile};
use crate::section_container::SectionContainer;
use crate::ui::*;
use leptos::html;
use leptos::prelude::*;

#[component]
pub fn Experience() -> impl IntoView {
    let group_ref = NodeRef::<html::Div>::new();
    let group_in_view = use_in_view(group_ref, 0.1);
    let is_mobile = use_is_mobile();
    view! {
        <SectionContainer title="Experience" emoji="📝" group_ref=group_ref>
            {EXPERIENCES
                .iter()
                .map(|e| {
                    view! {
                        <BaseCard
                            rotation=e.rotation
                            z=e.z
                            index=e.index
                            is_group_in_view=group_in_view
                            is_mobile=is_mobile
                        >
                            <CardHeader
                                title=e.company
                                logo=e.logo
                                dark_logo=e.dark_logo
                                logo_height=e.logo_height
                            />
                            {e
                                .positions
                                .iter()
                                .enumerate()
                                .map(|(i, p)| {
                                    let last = i == e.positions.len() - 1;
                                    view! {
                                        <div style=format!(
                                            "margin-bottom:{};",
                                            if last { "0" } else { "1rem" },
                                        )>
                                            <Text size="sm">{p.title}</Text>
                                            <Badge color="gray">{p.date}</Badge>
                                            <Text size="sm" ml="md">{p.description}</Text>
                                            {(!p.skills.is_empty())
                                                .then(|| {
                                                    view! {
                                                        <Group
                                                            gap="xs"
                                                            style="margin-top:var(--m-spacing-xs);margin-left:var(--m-spacing-md);"
                                                        >
                                                            {p
                                                                .skills
                                                                .iter()
                                                                .map(|s| view! { <Badge color=badge_color(s)>{*s}</Badge> })
                                                                .collect_view()}
                                                        </Group>
                                                    }
                                                })}
                                        </div>
                                    }
                                })
                                .collect_view()}
                        </BaseCard>
                    }
                })
                .collect_view()}
        </SectionContainer>
    }
}
