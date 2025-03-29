# CynthAI Launch Checklist

Use this checklist to ensure a smooth deployment of the CynthAI application.

## Pre-Launch Preparation

### Content Creation
- [ ] Record and edit all exercise videos
- [ ] Take photos for the inspiration gallery
- [ ] Write or source inspirational quotes
- [ ] Create or source background music (if not using iOS Music integration)

### Account Setup
- [ ] Create a GitHub account (if you don't have one)
- [ ] Create a Vercel account and connect it to GitHub
- [ ] Set up a Vimeo Pro account for video hosting

## Video Hosting Setup

- [ ] Upload exercise videos to Vimeo Pro
- [ ] Organize videos into folders by program type and level
- [ ] Set privacy to "Only people with the link"
- [ ] Copy video IDs for use in the application
- [ ] Update video URLs in `src/data/programs.ts`

## Application Configuration

- [ ] Update program data in `src/data/programs.ts`
- [ ] Update inspiration content in `src/data/inspiration.ts`
- [ ] Customize user preferences defaults in `src/contexts/UserContext.ts`
- [ ] Set application name and branding in:
  - [ ] `public/manifest.json`
  - [ ] `index.html` (title and meta tags)
  - [ ] `src/components/ui/Logo.tsx` (if applicable)

## Deployment Process

### GitHub Setup
- [ ] Fork or clone the CynthAI repository
- [ ] Push your customized version to your GitHub account
- [ ] Ensure repository is public (for GitHub Pages) or connected to Vercel

### Vercel Deployment (Recommended)
- [ ] Import your GitHub repository in Vercel
- [ ] Configure build settings:
  - Framework preset: Vite
  - Build command: `npm run build`
  - Output directory: `dist`
- [ ] Deploy the application
- [ ] Set up a custom domain (optional)

### GitHub Pages Deployment (Alternative)
- [ ] Run `npm run build` locally
- [ ] Configure GitHub Pages in repository settings
- [ ] Deploy the built files to GitHub Pages

## Post-Launch Testing

- [ ] Test all links and navigation
- [ ] Verify video playback
- [ ] Test iOS music integration
- [ ] Check offline functionality
- [ ] Test on various devices:
  - [ ] iPhone
  - [ ] iPad
  - [ ] Desktop browsers (Chrome, Safari, Firefox)

## User Onboarding

- [ ] Provide the app URL to Cynthia
- [ ] Guide her through the "Add to Home Screen" process
- [ ] Help her set up music preferences
- [ ] Walk through the first exercise session
- [ ] Show her how to track progress

## Ongoing Maintenance

- [ ] Schedule regular content updates
- [ ] Backup user data periodically
- [ ] Monitor for any issues or bugs
- [ ] Plan for future enhancements based on feedback

## Helpful Resources

- [Vimeo API Documentation](https://developer.vimeo.com/api/reference)
- [Vercel Documentation](https://vercel.com/docs)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [PWA on iOS Guide](https://web.dev/progressive-web-apps/)
