#!/usr/bin/env bash
# Vercel build: compile the Leptos app to WASM and emit static files to dist/.
set -euo pipefail

TRUNK_VERSION="v0.21.14"

# Install the Rust toolchain (rustup auto-adds the wasm32 target from
# rust-toolchain.toml) if it is not already present in the build image.
if ! command -v cargo >/dev/null 2>&1; then
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs \
    | sh -s -- -y --profile minimal --default-toolchain stable
fi
# shellcheck disable=SC1091
source "$HOME/.cargo/env"
rustup target add wasm32-unknown-unknown

# Install Trunk (prebuilt binary) if missing.
if ! command -v trunk >/dev/null 2>&1; then
  mkdir -p "$HOME/.cargo/bin"
  curl -fsSL \
    "https://github.com/trunk-rs/trunk/releases/download/${TRUNK_VERSION}/trunk-x86_64-unknown-linux-gnu.tar.gz" \
    | tar -xzf - -C "$HOME/.cargo/bin"
fi

trunk build --release
