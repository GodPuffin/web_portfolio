# My Portfolio :)

Rewritten in **Rust / WebAssembly** with [Leptos](https://leptos.dev) (client-side
rendered), built with [Trunk](https://trunkrs.dev). The visual design — a faithful
recreation of the original Mantine + Framer Motion site — is hand-written CSS driven
by design tokens, with animations recreated via `IntersectionObserver` + CSS.

## Development

```bash
# one-time: toolchain
rustup target add wasm32-unknown-unknown
cargo install trunk

# dev server with live reload
trunk serve

# production build -> dist/
trunk build --release
```

## Quality checks

```bash
cargo fmt --check
cargo clippy --target wasm32-unknown-unknown -- -D warnings
```

## Deployment

Deployed on Vercel as a static site. `vercel.json` runs `vercel-build.sh`
(installs Rust + Trunk, `trunk build --release`) and serves `dist/` with an
SPA fallback rewrite.
