use crate::hooks::use_is_mobile;
use crate::icons;
use crate::theme::use_theme;
use crate::ui::*;
use leptos::prelude::*;

struct NavLink {
    label: &'static str,
    href: &'static str,
    hover: &'static str, // css color var
    icon: fn(u32, f64) -> leptos::prelude::AnyView,
}

fn links() -> Vec<NavLink> {
    vec![
        NavLink {
            label: "GitHub",
            href: "https://github.com/GodPuffin/",
            hover: "var(--m-color-green-6)",
            icon: |s, w| icons::brand_github(s, w).into_any(),
        },
        NavLink {
            label: "LinkedIn",
            href: "https://www.linkedin.com/in/marcus-m-lee/",
            hover: "var(--m-color-blue-6)",
            icon: |s, w| icons::brand_linkedin(s, w).into_any(),
        },
        NavLink {
            label: "Instagram",
            href: "https://www.instagram.com/marcus.lee._/",
            hover: "var(--m-color-pink-6)",
            icon: |s, w| icons::brand_instagram(s, w).into_any(),
        },
        NavLink {
            label: "Email",
            href: "mailto:fromportfolio@puffin.mozmail.com",
            hover: "var(--m-color-grape-6)",
            icon: |s, w| icons::mail(s, w).into_any(),
        },
        NavLink {
            label: "Resume",
            href: "/resume.pdf",
            hover: "var(--m-color-orange-6)",
            icon: |s, w| icons::download(s, w).into_any(),
        },
    ]
}

#[component]
pub fn Navbar() -> impl IntoView {
    let theme = use_theme();
    let is_mobile = use_is_mobile();
    let (drawer, set_drawer) = signal(false);

    view! {
        <Container size="xs" class="navbar-wrapper" style="padding:var(--m-spacing-xl);">
            <Paper radius="xl" with_border=true style="padding:var(--m-spacing-md);">
                <Group justify="space-between" wrap="nowrap">
                    <Text size="lg" ml="md" class="nav-name">"Marcus Lee"</Text>

                    <Show
                        when=move || !is_mobile.get()
                        fallback=move || {
                            view! {
                                <ActionIcon
                                    variant="transparent"
                                    size="lg"
                                    class="burger"
                                    aria_label="Open menu"
                                    on_click=Callback::new(move |()| set_drawer.set(true))
                                >
                                    {icons::category2(24, 2.0)}
                                </ActionIcon>
                            }
                        }
                    >
                        <div class="icon-group">
                            {links()
                                .into_iter()
                                .map(|l| {
                                    view! {
                                        <ActionIcon
                                            variant="default"
                                            size="xl"
                                            class="nav-icon"
                                            hover_color=l.hover
                                            href=l.href
                                            target="_blank"
                                            aria_label=l.label
                                        >
                                            {(l.icon)(24, 2.0)}
                                        </ActionIcon>
                                    }
                                })
                                .collect_view()}
                            <ActionIcon
                                variant="default"
                                size="xl"
                                class="nav-icon theme-toggle"
                                aria_label="Toggle color scheme"
                                on_click=Callback::new(move |()| theme.toggle())
                            >
                                {move || {
                                    if theme.is_dark() {
                                        icons::sun(24, 2.0).into_any()
                                    } else {
                                        icons::moon_stars(24, 2.0).into_any()
                                    }
                                }}
                            </ActionIcon>
                        </div>
                    </Show>
                </Group>
            </Paper>

            <Show when=move || drawer.get()>
                <div
                    class="drawer-overlay"
                    on:click=move |_| set_drawer.set(false)
                ></div>
                <div class="drawer-panel">
                    <div class="drawer-header">
                        <button
                            class="drawer-close"
                            aria-label="Close menu"
                            on:click=move |_| set_drawer.set(false)
                        >
                            "×"
                        </button>
                    </div>
                    <Stack>
                        {links()
                            .into_iter()
                            .map(|l| {
                                view! {
                                    <Button
                                        size="xl"
                                        full_width=true
                                        href=l.href
                                        target="_blank"
                                        left=(l.icon)(24, 2.0)
                                    >
                                        {l.label}
                                    </Button>
                                }
                            })
                            .collect_view()}
                        <Button
                            size="xl"
                            full_width=true
                            left=if theme.is_dark() {
                                icons::sun(24, 2.0).into_any()
                            } else {
                                icons::moon_stars(24, 2.0).into_any()
                            }
                            on_click=Callback::new(move |()| theme.toggle())
                        >
                            "Toggle Theme"
                        </Button>
                    </Stack>
                </div>
            </Show>
        </Container>
    }
}
