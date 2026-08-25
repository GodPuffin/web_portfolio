# Marcus's Portfolio

My personal website: [marcus-lee.net](https://www.marcus-lee.net/).

## Design

A persistent app shell rather than a scrolling document. The identity column
(name, role, contextual controls) never unmounts; project content moves through
a 3D card deck beside it, and opening a card is a shared-element transition
rather than a navigation. Routes drive state, not subtree swaps: which is what
keeps transitions continuous.

- **Palette**: a warm off-white ground, near-black ink, one warm grey. Emphasis
  in body copy is carried by colour, never weight.
- **Type**: PP Neue Montreal (Regular / Semibold) with PP Neue Montreal Mono for
  dates and section labels. Subset to latin, served as woff2.
- **Motion**: springs rather than duration tweens, so interrupted animations
  keep their velocity. Every timing value lives in `src/lib/motion.ts`.

## Stack

React 19 · TypeScript · Vite · Tailwind v4 · Motion · Lenis · React Router

## Development

```sh
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build to dist/
npm run typecheck
```

## Content

All copy lives in `src/content/`: `profile.ts`, `projects.ts`, `experience.ts`,
`education.ts`. Nothing else needs touching to add a project or a role.

Project cards currently render a generated cover from `src/content/covers.ts`.
Dropping a real screenshot at `public/projects/<slug>.png` is the intended
upgrade path.

## Fonts

PP Neue Montreal is licensed **Free for Personal Use**. A commercial licence is
required if this site is ever used commercially.
