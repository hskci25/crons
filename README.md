# Crons — Engineering Practice Platform

Landing page for **Crons**, a platform for engineers to master repo‑based
technical interviews. Built as a faithful React port of the Stitch design
[`Landing Page - Split Layout`](./screens/landing-page-split-layout/screenshot.png)
(project `3459930097535651455`, screen `b708f1e4f03643a6bfa63364fd7884e3`).

## Stack

- **Vite** + **React 18** + **TypeScript**
- **Tailwind CSS v3** with the Stitch design tokens (Material 3‑style color
  roles, custom radii, `gutter` / `margin` / `container-max` spacing)
- **Inter** for UI, **JetBrains Mono** for code/labels, **Material Symbols
  Outlined** for icons (loaded via Google Fonts)

## Layout

The page is a strict two‑viewport split, anchored by a sticky `TopNavBar` and
trailing `Footer`:

1. `HeroSection` — full‑viewport `CRONS` wordmark in monospace `#E8720C` over
   `#0F0F0F`, with a bouncing scroll indicator.
2. `ProductIntro` → `SplitPanel` (spec + Go test snippet) → `FeaturesGrid` →
   `CTASection` — the actual product content.
3. `GridBackground` paints a subtle 32px grid behind everything.

## Getting started

```bash
npm install
cp .env.example .env.local   # add Supabase URL + anon key
npm run dev                  # http://localhost:5173
```

### Questions workspace (Java)

1. Apply Supabase migrations in `supabase/migrations/` (Dashboard SQL or CLI).
2. Start the Java test runner (**JDK 17+** required; Docker is optional):

```bash
bash scripts/setup-runner.sh
npm run runner:dev    # http://localhost:8787 — uses local JDK by default
```

If you see `spawn docker ENOENT`, restart the runner with `USE_DOCKER=false` (now the default) and install a JDK:

```bash
brew install openjdk@17
export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"
```

3. Start the assistant (optional; works in fallback mode without API keys):

```bash
cp services/chat/.env.example services/chat/.env
npm run chat:dev      # http://localhost:8788
```

4. Sign in, open **Challenges** → **Two Sum**, edit code, **Run tests**, then **Submit**.

Vite proxies `/api/run` and `/api/chat` to the local services.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Frontend dev server |
| `npm run build` | Production build |
| `npm run runner:dev` | Java JUnit test runner |
| `npm run chat:dev` | Question assistant API |

## Project structure

```
src/
├── pages/QuestionsPage.tsx, QuestionWorkspacePage.tsx
├── components/questions/    # File tree, Monaco editor, test results
├── components/assistant/    # Contextual chat panel
├── lib/questions.ts, chat.ts, seedQuestions.ts
└── stores/workspaceStore.ts
runner/                      # Java test execution API
services/chat/               # LLM assistant (OpenAI / Anthropic)
supabase/migrations/         # Schema + Two Sum seed
content/questions/two-sum/   # Source-of-truth problem files
```

Design tokens live in `tailwind.config.js` and mirror the Stitch theme 1:1, so
you can extend the design without re‑deriving colors. The accent
(`primary-container` / `#E8720C`) is the only loud color in the system.
