# CynthAI - Chair Yoga & Tai Chi for Seniors

![CynthAI Logo](./public/assets/icons/icon-192x192.png)

## Overview

CynthAI is a personalized chair yoga and tai chi web application designed specifically for seniors, featuring progressive exercise programs, inspirational content, and music integration. The application is optimized for use on iOS devices (iPhone and iPad) and functions as a Progressive Web App (PWA) for an app-like experience without App Store requirements.

## Features

### Core Functionality

- **Progressive Exercise Programs**: Year-long structured programs for both chair yoga and tai chi
- **Multiple Difficulty Levels**: Novice, Active, and Advanced levels for appropriate progression
- **Video-Based Exercises**: High-quality video demonstrations with clear instructions
- **Personalized Experience**: Customized for the user's specific needs and preferences

### Sleek and Modern Design

- **Modern UI/UX**: Visually stunning graphic interface, well laid out sitemap, and cohesive design
- **Music and Video Integration**: Includes built in media players that seamlessly plays their files within the app 
- **Error Prevention**: Forgiving inputs and clear recovery paths

### Content Features

- **Exercise Videos**: Professional video demonstrations hosted on Vimeo
- **Inspiration Gallery**: Motivational images, quotes, and videos
- **Music Integration**: Background music player and iOS Music app integration
- **Achievement System**: Streaks, milestones, and progress tracking

### Technical Capabilities

- **Offline Functionality**: Core features work without internet connection
- **PWA Installation**: Add to home screen for app-like experience
- **Cross-Device Support**: Responsive design for both iPhone and iPad
- **Performance Optimization**: Fast loading and smooth animations

## Technology Stack

### Frontend

- **Framework**: React with TypeScript
- **Build System**: Vite
- **CSS Framework**: Tailwind CSS
- **State Management**: React Context API
- **Routing**: React Router

### Media Handling

- **Video Player**: React Player
- **Video Hosting**: Vimeo Pro
- **Audio Integration**: Web Audio API
- **Image Optimization**: Modern formats and lazy loading

### PWA Features

- **Service Worker**: Workbox for offline caching
- **App Manifest**: Full PWA support
- **Installation**: Add to home screen capability
- **Offline Detection**: Automatic offline mode

## Project Structure

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


## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Git

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/rtsii/cynthai.git
   cd cynthai
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Configure environment variables
   Create a `.env` file with:
   ```
   VITE_APP_VERSION=1.0.0
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

### Building for Production

1. Build the application
   ```bash
   npm run build
   ```

2. Preview the production build
   ```bash
   npm run preview
   ```

## Deployment

The recommended deployment method is through Vercel:

1. Push your code to GitHub
2. Import your repository in Vercel
3. Configure the build settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Deploy the application

For detailed deployment instructions, see [LAUNCH_INSTRUCTIONS.md](./LAUNCH_INSTRUCTIONS.md).

## Video Content Setup

CynthAI uses Vimeo Pro for video hosting. To set up your exercise videos:

1. Create a Vimeo Pro account
2. Upload your exercise videos to organized folders
3. Set privacy to "Only people with the link"
4. Note the video IDs and update them in `src/data/programs.ts`

## Customization

### User Preferences

Modify `src/contexts/UserContext.tsx` to change default user settings:

```typescript
const DEFAULT_USER: UserProfile = {
  id: 'user-1',
  name: 'Cynthia', // Change to user's name
  preferences: {
    textSize: 'normal', // Options: 'normal', 'large', 'extraLarge'
    highContrast: false,
    reducedMotion: false,
    audioFeedback: true,
  },
  // Other settings...
};
```

### Program Content

Update `src/data/programs.ts` to customize exercise programs:

```typescript
export const programs: Program[] = [
  {
    id: 'chair-yoga-novice-month-1',
    title: 'Gentle Foundations',
    // Other program properties...
    days: [
      {
        // Day definition...
        exercises: [
          {
            id: 'cy-novice-1-intro',
            title: 'Introduction to Chair Yoga',
            videoUrl: 'https://player.vimeo.com/video/YOUR_VIDEO_ID',
            // Other exercise properties...
          },
          // More exercises...
        ],
      },
      // More days...
    ],
  },
  // More programs...
];
```

### Styling

Customize the application appearance in `tailwind.config.js` and `src/styles/index.css`.

## Accessibility Features

CynthAI accessibility features:

- **Keyboard Navigation**: Full keyboard accessibility for all functions
- **Error Recovery**: Clear error messages and easy recovery paths

## Offline Support

The application uses a service worker to enable offline functionality:

- **Cached Content**: Core application files are cached for offline use
- **Video Caching**: Previously watched videos are available offline
- **Offline Mode Detection**: Automatic detection of connectivity changes
- **Sync on Reconnect**: Data synchronization when connection is restored

## iOS-Specific Features

CynthAI is optimized for iOS devices:

- **PWA Installation**: Add to home screen for app-like experience
- **Safe Area Handling**: Proper handling of notches and home indicators
- **Music Integration**: Background playback with iOS Music app
- **Touch Optimization**: iOS-specific touch handling improvements

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Contact

For support or questions, please contact [your-email@example.com](mailto:your-email@example.com).
