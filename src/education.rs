use crate::base_card::BaseCard;
use crate::card_header::CardHeader;
use crate::data::EDUCATION;
use crate::hooks::{use_in_view, use_is_mobile};
use crate::physics::{use_physics_field, CARDS};
use crate::section_container::SectionContainer;
use crate::ui::*;
use leptos::html;
use leptos::prelude::*;

#[component]
pub fn Education() -> impl IntoView {
    let group_ref = NodeRef::<html::Div>::new();
    let group_in_view = use_in_view(group_ref, 0.1);
    let is_mobile = use_is_mobile();
    use_physics_field(group_ref, &CARDS);
    view! {
        <SectionContainer title="Education" emoji="🎓" group_ref=group_ref>
            {EDUCATION
                .iter()
                .map(|ed| {
                    view! {
                        <BaseCard
                            rotation=ed.rotation
                            z=ed.z
                            index=ed.index
                            is_group_in_view=group_in_view
                            is_mobile=is_mobile
                        >
                            <CardHeader
                                title=ed.institution
                                logo=ed.logo
                                dark_logo=ed.dark_logo
                                logo_height=50
                            >
                                {(!ed.degree.is_empty())
                                    .then(|| view! { <Text size="sm" c="dimmed">{ed.degree}</Text> })}
                                <Text size="sm">{ed.date}</Text>
                            </CardHeader>
                        </BaseCard>
                    }
                })
                .collect_view()}
        </SectionContainer>
    }
}
