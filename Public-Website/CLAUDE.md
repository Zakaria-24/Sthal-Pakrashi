@AGENTS.md

Explore this repository. Then create a CLAUDE.md at the repo root documenting: framework & version, styling system, folder structure, state management, and our conventions. Add these rules explicitly:

Never hardcode colors, font sizes, or spacing — always use design tokens / theme variables.
All user-facing text must go through the i18n layer with EN + BN values and a localized fallback.
All image uploads must go through the shared crop+validate component. Do not change any feature code yet. Just explore and write CLAUDE.md.
