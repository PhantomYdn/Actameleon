# Actameleon

Theatrical script reader for rehearsal practice.

**[Live Demo](https://actameleon.orienteer.org/)**

## Features

- Script display organized by Acts & Scenes
- Actor filtering - focus on specific character's lines
- "Show Lines Prior" - see cue lines before your part
- Hide text mode - self-test your memorization
- Text-to-speech - listen to the script read aloud
- Dark/light mode (follows system preference)
- Multilingual script support
- Full-screen script selector with metadata
- Bottom sheet filters with searchable actor list
- Highlight mode - show all lines, highlight your character
- Active filter pills with quick remove
- Scene quick-navigation dropdown
- Mobile-first touch-friendly UI

## Roadmap

### Next Steps
- [x] Reset filters - per-section reset buttons in filter sheet
- [ ] Rehearsal profiles - save/load different filter presets for quick switching
- [x] Auto-scroll during playback - keep currently spoken line visible
- [x] Mobile-friendly filters - bottom sheet with searchable lists
- [x] UI/UX improvements - mobile-first redesign with highlight mode

### Planned Features
- [ ] Keyboard shortcuts - space to play/pause, arrows for navigation
- [ ] Loading indicators - show progress while scripts load
- [ ] Playback controls - pause/resume, speed adjustment
- [ ] Voice selection - choose from available TTS voices
- [ ] Print view - printer-friendly layout for rehearsals
- [ ] PWA support - offline access and installable app

### Future
- [ ] Google Docs integration - import/sync scripts on demand

## Development

```bash
npm install    # Install dependencies
npm run dev    # Start dev server
npm run build  # Production build
npm run deploy # Deploy to GitHub Pages
```

See [AGENTS.md](AGENTS.md) for detailed development guidelines.

## Recent Changes

### Mobile-First UI Redesign (Feb 2026)

Complete redesign of the filter UI with mobile-first approach:

- **Full-screen script selector** - Card-based script picker with metadata (acts, scenes, actors count)
- **Bottom sheet filters** - Swipeable bottom sheet with searchable actor list showing line counts
- **Hierarchical scene selection** - Acts collapsed by default, expand to select individual scenes. Selecting an Act selects all its scenes.
- **Active filter pills** - Compact bar showing selected filters with quick remove buttons
- **Highlight mode** - New option to show all lines but highlight selected actor's lines (yellow background + left border)
- **Per-section reset** - Reset buttons for each filter category (actors, scenes)
- **Live filtering** - Filters apply immediately as you tap

**Dependencies added:**
- `radix-vue` - Accessible UI primitives
- `@webzlodimir/vue-bottom-sheet` - Touch-friendly bottom sheet

### Previous: UI/UX Overhaul (Feb 2026)

Initial improvements to the user interface:

- **Actor chip selector** - Replaced multi-select dropdown with clickable chips
- **Toggle switches** - iOS-style toggle switches for options
- **Collapsible filter panel** - Accordion-style panel with filter summary
- **Scene quick-nav** - Floating button to jump to any scene
- **Improved FABs** - Floating action buttons with icons
