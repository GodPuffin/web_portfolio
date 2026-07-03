# Marcus's Portfolio

[![Made in Canada](https://img.shields.io/badge/Made_in-Canada_🇨🇦-FF0000?style=flat-square)](https://www.marcus-lee.net/)
[![Rust](https://img.shields.io/badge/Rust-CE422B?style=flat-square&logo=rust&logoColor=white)](https://www.rust-lang.org/)
[![WebAssembly](https://img.shields.io/badge/WebAssembly-654FF0?style=flat-square&logo=webassembly&logoColor=white)](https://webassembly.org/)
[![Leptos](https://img.shields.io/badge/Leptos-EF3939?style=flat-square)](https://leptos.dev/)
[![Bundle size](https://img.shields.io/badge/bundle-203_KB_gzip-3178C6?style=flat-square)](#bundle-size)

My personal website — [marcus-lee.net](https://www.marcus-lee.net/) — written in Rust/WASM with [Leptos](https://leptos.dev/).

## Bundle size

Core app payload from a release build (`trunk build --release`):

| Asset | Raw | Gzip |
| ----- | ------: | -----: |
| WASM  | 675.5 KB | 189.4 KB |
| JS    | 33.6 KB  | 6.6 KB   |
| CSS   | 38.8 KB  | 6.9 KB   |
| **Total** | **747.8 KB** | **202.9 KB** |

## Development

```sh
trunk serve    # dev server at http://127.0.0.1:8080
trunk build --release
```
