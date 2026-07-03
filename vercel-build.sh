#!/usr/bin/env bash
# Vercel build: compile the Leptos app to WASM and emit static files to dist/.
#
# Prebuilt Trunk / wasm-bindgen binaries are dynamically linked against a newer
# glibc than Vercel's build image provides, so we build both from source with
# `cargo install`. Trunk then uses the PATH-installed wasm-bindgen (matching the
# locked version) instead of downloading the glibc-linked release binary.
set -euo pipefail

TRUNK_VERSION="0.21.14"
WASM_BINDGEN_VERSION="0.2.126"

export RUSTUP_HOME="${RUSTUP_HOME:-$HOME/.rustup}"
export CARGO_HOME="${CARGO_HOME:-$HOME/.cargo}"

# Install rustup + a stable toolchain only if it isn't already on the image.
if ! command -v rustup >/dev/null 2>&1; then
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs \
    | sh -s -- -y --profile minimal --default-toolchain stable --no-modify-path
fi
export PATH="$CARGO_HOME/bin:$PATH"

# rust-toolchain.toml also requests this target; add it explicitly to be safe.
rustup target add wasm32-unknown-unknown

# Build Trunk and wasm-bindgen-cli from source (see header comment).
if ! command -v trunk >/dev/null 2>&1; then
  cargo install trunk --version "$TRUNK_VERSION" --locked
fi
if ! command -v wasm-bindgen >/dev/null 2>&1; then
  cargo install wasm-bindgen-cli --version "$WASM_BINDGEN_VERSION" --locked
fi

trunk build --release
