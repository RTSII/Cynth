# CynthAI Project Structure

```
cynthai/
│
├── public/
│   ├── assets/
│   │   ├── icons/
│   │   │   └── (app icons & favicon files)
│   │   ├── images/
│   │   │   ├── exercises/
│   │   │   ├── inspiration/
│   │   │   ├── programs/
│   │   │   └── music/
│   │   └── audio/
│   │       └── (sample audio files)
│   ├── manifest.json
│   ├── favicon.svg
│   └── robots.txt
│
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── CircularProgress.tsx
│   │   │   ├── Button.tsx
│   │   │   └── Card.tsx
│   │   ├── Layout.tsx
│   │   ├── NavBar.tsx
│   │   └── exercise/
│   │       ├── ExerciseCard.tsx
│   │       ├── VideoPlayer.tsx
│   │       └── ProgressIndicator.tsx
│   │
│   ├── contexts/
│   │   ├── UserContext.tsx
│   │   ├── ProgressContext.tsx
│   │   └── AudioContext.tsx
│   │
│   ├── data/
│   │   ├── programs.ts
│   │   ├── inspiration.ts
│   │   └── music.ts
│   │
│   ├── hooks/
│   │   ├── useLocalStorage.ts
│   │   └── useMediaQuery.ts
│   │
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── TodayPractice.tsx
│   │   ├── Programs.tsx
│   │   ├── ExercisePlayer.tsx
│   │   ├── Inspiration.tsx
│   │   ├── Music.tsx
│   │   ├── Settings.tsx
│   │   └── Onboarding.tsx
│   │
│   ├── styles/
│   │   └── index.css
│   │
│   ├── types.ts
│   ├── App.tsx
│   └── main.tsx
│
├── docs/
│   ├── launch-instructions.md
│   └── project-roadmap.md
│
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.ts
├── tsconfig.json
<<<<<<< HEAD
├── tsconfig.node.json
=======
>>>>>>> 56360646f92426441bd53b9be28d308739174b72
└── README.md
```
