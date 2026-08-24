type IconProps = { className?: string };

/**
 * 24×24 line icons on a shared grid, 1.75 stroke. Sized by the button that
 * holds them via `w-*`/`h-*`, never by a hardcoded size prop.
 */
const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const make =
  (path: React.ReactNode, filled = false) =>
  ({ className }: IconProps) => (
    <svg
      {...base}
      {...(filled ? { fill: "currentColor", stroke: "none" } : null)}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {path}
    </svg>
  );

export const PersonIcon = make(
  <>
    <circle cx="12" cy="8" r="3.25" />
    <path d="M5.5 19.5a6.5 6.5 0 0 1 13 0" />
  </>,
);

export const ChatIcon = make(
  <>
    <path d="M20 12.5a7.5 7.5 0 0 1-10.9 6.7L4.5 20.5l1.4-4.4A7.5 7.5 0 1 1 20 12.5Z" />
  </>,
);

export const CloseIcon = make(
  <>
    <path d="m7 7 10 10M17 7 7 17" />
  </>,
);

export const ChevronLeftIcon = make(
  <>
    <path d="M14.5 5.5 8 12l6.5 6.5" />
  </>,
);

export const MailIcon = make(
  <>
    <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
    <path d="m4 8 7.1 4.9a1.6 1.6 0 0 0 1.8 0L20 8" />
  </>,
);

export const ExternalIcon = make(
  <>
    <path d="M14 4h6v6" />
    <path d="M20 4 11 13" />
    <path d="M18 14.5V18a2.5 2.5 0 0 1-2.5 2.5H6A2.5 2.5 0 0 1 3.5 18V8.5A2.5 2.5 0 0 1 6 6h3.5" />
  </>,
);

export const InfoIcon = make(
  <>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 11v5.5" />
    <path d="M12 7.75h.01" />
  </>,
);

export const CollapseIcon = make(
  <>
    <path d="M9.5 4.5V9a.5.5 0 0 1-.5.5H4.5" />
    <path d="M14.5 19.5V15a.5.5 0 0 1 .5-.5h4.5" />
    <path d="M20 4 15 9" />
    <path d="M4 20l5-5" />
  </>,
);

export const DownloadIcon = make(
  <>
    <path d="M12 3.5v11" />
    <path d="m7.5 10.5 4.5 4.5 4.5-4.5" />
    <path d="M4.5 19.5h15" />
  </>,
);

export const ArrowUpIcon = make(
  <>
    <path d="M12 19.5v-15" />
    <path d="m5.5 11 6.5-6.5L18.5 11" />
  </>,
);

export const ArrowDownIcon = make(
  <>
    <path d="M12 4.5v15" />
    <path d="m18.5 13-6.5 6.5L5.5 13" />
  </>,
);

/* Brand marks are filled paths — they don't read correctly as strokes. */
export const GithubIcon = make(
  <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />,
  true,
);

export const LinkedinIcon = make(
  <path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM3 21h4V10H3v11ZM9.5 10v11h4v-6.1c0-1.6 2.1-1.75 2.1 0V21h4v-7c0-4.9-5-4.72-6.1-2.31V10h-4Z" />,
  true,
);

export const InstagramIcon = make(
  <>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="3.75" />
    <path d="M16.9 7.1h.01" />
  </>,
);

export const DevpostIcon = make(
  <path d="M12 2 2.6 7v10L12 22l9.4-5V7L12 2Zm-2.6 6.3h3.1c2.4 0 3.9 1.4 3.9 3.7s-1.5 3.7-3.9 3.7H9.4V8.3Zm1.9 1.7v4h1.1c1.3 0 2-.7 2-2s-.7-2-2-2h-1.1Z" />,
  true,
);
