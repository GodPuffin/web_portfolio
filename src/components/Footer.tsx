import { Paper, Text, Group, Container } from '@mantine/core';

export function Footer() {

    return (
        <Paper
            component="footer"
            p="md"
            withBorder
        >
            <Container size="md">
                <Group justify="space-between">
                    <Text size="sm" c="dimmed">
                        Made with ❤️ by Marcus Lee
                    </Text>
                    <Text size="sm" c="dimmed">
                        2024 © All rights reserved
                    </Text>
                </Group>
            </Container>
        </Paper>
    );
}

// import { Paper, Text, Group, Container, ColorSwatch, CheckIcon, rem, TextInput } from '@mantine/core';
// import { useState } from 'react';

// export function Footer() {

//     const [checked, setChecked] = useState(false);

//     return (
//         <Paper
//             component="footer"
//             p="md"
//             withBorder
//         >
//             <Container size="md">
//                 <Group justify="space-between">
//                     <Text size="sm" c="dimmed">
//                         Made with ❤️ by Marcus Lee
//                     </Text>
//                 <Group>
//                     {['orange', 'red', 'pink', 'grape', 'indigo', 'blue', 'cyan', 'teal', 'green'].map((color) => (
//                         <ColorSwatch
//                             key={color}
//                             component="button"
//                             color={`var(--mantine-color-${color}-6)`}
//                             onClick={() => setChecked((c) => !c)}
//                             style={{ color: '#fff', cursor: 'pointer' }}
//                         >
//                             {checked && <CheckIcon style={{ width: rem(12), height: rem(12) }} />}
//                         </ColorSwatch>
//                     ))}
//                 </Group>
//                     <TextInput placeholder="Hello from 🇨🇦!" label="Sign the webpage" />
//                 </Group>
//             </Container>
//         </Paper>
//     );
// }
