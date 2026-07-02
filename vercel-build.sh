#!/usr/bin/env bash
# Vercel build: compile the Leptos app to WASM and emit static files to dist/.
set -euo pipefail

TRUNK_VERSION="v0.21.14"

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

# Install Trunk (prebuilt binary) if missing.
if ! command -v trunk >/dev/null 2>&1; then
  mkdir -p "$CARGO_HOME/bin"
  curl -fsSL \
    "https://github.com/trunk-rs/trunk/releases/download/${TRUNK_VERSION}/trunk-x86_64-unknown-linux-gnu.tar.gz" \
    | tar -xzf - -C "$CARGO_HOME/bin"
fi

trunk build --release
