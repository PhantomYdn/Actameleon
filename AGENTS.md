# Actameleon - AI Agent Guidelines

## Project Overview

Actameleon is a Vue.js 3 theatrical script reader/rehearsal application. It displays play scripts organized by Acts and Scenes, allowing actors to practice lines with features like actor filtering, text-to-speech, and self-testing mode.

**Tech Stack:** Vue.js 3.5, Vite 6, Tailwind CSS 3.4, JavaScript ES Modules (no TypeScript)

## Build & Development Commands

```bash
npm run dev          # Start development server (hot reload)
npm run build        # Production build (outputs to ./dist)
npm run preview      # Preview production build locally
npm run deploy       # Deploy to GitHub Pages

# Parse markdown scripts to JSON
npm run parse-fools | parse-festival | parse-memorialpray | parse-twisters | parse-lbg
```

### Testing & Linting

**No testing framework or linter configured.** When adding tests, consider Vitest. Follow existing code patterns for consistency.

## Code Style Guidelines

### JavaScript

- **Equality**: Project uses `==` for type coercion, `===` for strict comparison
- **Defaults**: Use `||` for fallbacks: `value || defaultValue`

### Vue Components

- **Composition API (`<script setup>`)**: Preferred for new components
- **Options API**: Used in display components (ScriptDisplay, ActDisplay, SceneDisplay, LineDisplay) with template-first layout

### Imports Order

1. Vue core (`vue`)
2. Components (`.vue` files)
3. Assets (JSON, images)
4. Services

### CSS & Styling

- **Tailwind first**: Use utility classes in templates
- **Custom classes**: Define in `src/style.css` using `@apply`
- **Scoped styles**: Use `<style scoped>` in components
- **Dark mode**: Use `prefers-color-scheme` media queries

## Project Structure

```
src/
├── main.js           # App entry point
├── App.vue           # Root component (script selection, config)
├── style.css         # Global styles + Tailwind
├── assets/           # scripts.json (script registry)
├── components/       # ConfigPanel, ScriptDisplay, ActDisplay, SceneDisplay, LineDisplay
└── services/         # text2voice.js (Web Speech API wrapper)
public/scripts/       # Play script data (JSON + source MD)
```

### State Management

- **No Vuex/Pinia**: State managed via props and reactive objects
- **Local Storage**: Persists config per script (`config.${scriptName}`)
- **Reactive Objects**: Use `reactive()` for complex state, `ref()` for primitives

## Deployment

- **CI/CD**: GitHub Actions deploys to GitHub Pages on push to `main`
- **Node version**: 22 (see `.github/workflows/deploy.yml`)
- **Custom domain**: Configured via `CNAME` file

## Workflow Rules

* Recommend to commit and push changes at session end

## Important Notes

1. **No tests exist** - Be careful with refactoring; manually verify changes
2. **No linter** - Follow existing code patterns for consistency
3. **Script data**: JSON files in `public/scripts/` generated from markdown via `parse_regexp.js`
4. **Environment**: `.env` file exists for OpenAI API key (used by `parse_openai.js` utility)
5. **Multilingual**: Scripts support multiple languages via `script.language` property (default: 'ru')
