use crate::ui::*;
use leptos::prelude::*;

#[component]
pub fn Welcome() -> impl IntoView {
    view! {
        <Stack gap="xl">
            <Container size="xs" style="z-index:5;">
                <Reveal amount=0.3>
                    <Title order=1 ta="center">
                        "Hello, I'm Marcus " <span class="wave-emoji">"👋"</span>
                    </Title>
                </Reveal>
            </Container>
            <Reveal amount=0.3 delay=0.1 style="z-index:5;">
                <Text size="lg">
                    "I'm a "
                    <TextSpan c="grape" inherit=true>"Computer Engineering"</TextSpan>
                    " student at the "
                    <TextA href="https://www.ubc.ca/" target="_blank" c="blue" inherit=true>
                        "University of British Columbia"
                    </TextA> ", with a background in "
                    <TextSpan c="green" inherit=true>"Computer Science"</TextSpan> " and "
                    <TextSpan c="orange" inherit=true>"Math"</TextSpan>
                    ". I'm skilled at creating "
                    <TextSpan c="indigo" inherit=true>"innovative solutions"</TextSpan> " across "
                    <TextSpan c="red" inherit=true>"mechanical"</TextSpan> ", "
                    <TextSpan c="violet" inherit=true>"electrical"</TextSpan> ", and "
                    <TextSpan c="cyan" inherit=true>"software engineering"</TextSpan>
                    ", with a recent focus on developing "
                    <TextSpan c="pink" inherit=true>"AI tools"</TextSpan>
                    " for everyday use. When I'm not coding, you can find me "
                    <TextSpan c="teal" inherit=true>"skiing"</TextSpan> ", "
                    <TextSpan c="indigo" inherit=true>"sailing"</TextSpan> ", or "
                    <TextSpan c="brown" inherit=true>"rock climbing"</TextSpan> "."
                </Text>
            </Reveal>
        </Stack>
    }
}
