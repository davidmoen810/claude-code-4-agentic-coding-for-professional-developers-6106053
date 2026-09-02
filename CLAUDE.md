# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

Exercise files for the LinkedIn Learning course *"Claude Code 4: Agentic Coding for Professional Developers"* (instructor: Ray Villalobos). The app is a teaching vehicle for demonstrating agentic coding workflows, not a production product.

Branches map to course videos, named `CHAPTER_MOVIE` (e.g. `02_03`), sometimes suffixed `b` (beginning state) or `e` (end state). `main` holds the final state of the code. The `Copy To Branches` workflow (`.github/workflows/main.yml`, manual dispatch only) propagates `main` out to the per-video branches — treat `main` as the source of truth and expect changes there to be replicated.

`CONTRIBUTING.md` states the upstream repo does not accept pull requests.

## Commands

```
npm install
npm run dev       # Vite dev server
npm run build     # builds to docs/ (committed, served via GitHub Pages)
npm run preview
npm run lint      # eslint . — see caveat below
```

There is **no test suite** and **no test runner** configured.

`npm run lint` is declared in `package.json` but there is no `eslint.config.js` in the repo, so it will fail until one is added — the eslint 9 flat-config plugins (`@eslint/js`, `eslint-plugin-react`, `-react-hooks`, `-react-refresh`, `-react-compiler`, `globals`) are all installed and ready for it.

## Architecture

React 19 + Vite 6, ~225 lines of source. Notable non-obvious pieces:

- **Build output is `docs/`, not `dist/`** (`vite.config.js`), with `base: './'` for relative asset paths. `docs/` is committed to git so GitHub Pages can serve it. A build therefore produces a large tracked diff — don't run `npm run build` incidentally.
- **React Compiler is enabled** via `babel-plugin-react-compiler` in the Vite React plugin. Manual `useMemo`/`useCallback` memoization is generally unnecessary.
- **All state lives in `src/App.jsx`** — `cast` (the roster) and `memberInfo` (which member the modal shows). Child components are presentational and communicate upward through `onChoice` / `handleClose` / `handleChange` callbacks. There is no router, no state library, no context.
- **Data comes from `public/cast.json`**, fetched at runtime by relative path (`fetch('cast.json')`), never imported. Each record has `id` (a 0-based integer matching its array index), `slug`, `name`, `bio`, `origin`, `eyes`, `hobby`. The `slug` is the contract with the image assets, and modal prev/next navigation relies on `id` being the array index.
- **Images are convention-driven, not referenced explicitly.** `public/images/` holds hundreds of SVGs keyed off `slug`: `{slug}_tn.svg` for grid thumbnails, `{slug}.svg` for the modal portrait, `{slug}-02.svg`…`-12.svg` for alternate poses, plus `bg-*`, `card-*`, `product-*`, and logo assets. Adding a cast member means adding matching `slug`-named files.
- **Styling is Pico CSS + semantic HTML + inline style objects.** Pico is imported once in `App.jsx`; layout uses bare `<nav>`, `<article>`, `<dialog>`, `<hgroup>` and inline `style={{...}}` rather than CSS classes. `src/App.css` is minimal and `src/components/InterfaceStyles.jsx` exports shared inline style objects. Match this idiom rather than introducing class-based CSS or a styling library.
- **Theming** is owned by `src/components/ToggleTheme.jsx`, which cycles `auto → light → dark`, writes `data-theme` on `<html>` for Pico to consume, and persists to `localStorage` under the `theme` key.

## Known rough edges

Pre-existing bugs, likely intentional teaching material — confirm with the user before "fixing" them as drive-by cleanups:

- `src/App.jsx:21-23` — the `useEffect` calling `fetchCast()` has no dependency array, so `cast.json` is refetched on every render.
- `src/components/Modals.jsx:29,32` — prev/next arrows don't bound-check `member.id`, so the first member's "prev" and the last member's "next" pass an out-of-range index and blank the modal.
- `src/components/icons/Arrow.jsx` — the flip transform string is missing its closing paren (`'rotate(180deg'`), so the arrow never flips.
- `src/components/ToggleTheme.jsx:9` — the `auto` icon uses HTML `stroke-linecap`/`stroke-width` attributes instead of React's camelCase props (the light/dark icons in the same file do it correctly).
