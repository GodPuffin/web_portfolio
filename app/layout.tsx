import "@mantine/core/styles.css"
import { ColorSchemeScript, MantineProvider } from "@mantine/core"
import { Analytics } from "@vercel/analytics/next"
import type { Metadata } from "next"
import type { ReactNode } from "react"
import { theme } from "../theme"

export const metadata: Metadata = {
  title: "Marcus's Website",
  description:
    "Marcus's personal website showcasing projects, experience, and more.",
  metadataBase: new URL("https://www.marcus-lee.net/"),
  openGraph: {
    title: "Marcus's Website",
    description:
      "Marcus's personal website showcasing projects, experience, and more.",
    url: "https://www.marcus-lee.net/",
    siteName: "Marcus's Website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Marcus's Website",
      },
    ],
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Marcus's Website",
    description:
      "Marcus's personal website showcasing projects, experience, and more.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </head>
      <body>
        <MantineProvider theme={theme}>{children}</MantineProvider>
        <Analytics />
      </body>
    </html>
  )
}
