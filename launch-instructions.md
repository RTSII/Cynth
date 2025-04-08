# CynthAI Launch Instructions

This guide provides detailed instructions for setting up, deploying, and launching the CynthAI web application for Cynthia Steen.

## Prerequisites

### Required Accounts

1. **GitHub Account**
   - For source code hosting and version control
   - Sign up at [github.com](https://github.com) if you don't have an account

2. **Vercel Account**
   - For hosting the web application
   - Sign up at [vercel.com](https://vercel.com) - the free tier is sufficient for personal use
   - Connect it to your GitHub account during signup

3. **Vimeo Pro Account** ($20/month)
   - For hosting exercise videos with privacy controls
   - Sign up at [vimeo.com/pro](https://vimeo.com/pro)

4. **Domain Name** (Optional, ~$12/year)
   - For a custom URL (e.g., cynthai.app)
   - Can use Vercel's free subdomain initially (cynthai.vercel.app)

### Development Tools

If you plan to make changes to the application, you'll need:

1. **Node.js** (v18 or higher)
   - Download from [nodejs.org](https://nodejs.org/)

2. **Git**
   - Download from [git-scm.com](https://git-scm.com/)

3. **Code Editor**
   - Visual Studio Code is recommended
   - Download from [code.visualstudio.com](https://code.visualstudio.com/)

## Step 1: Set Up Video Content

### Preparing Videos on Vimeo

1. **Create a Vimeo Pro Account**
   - Go to [vimeo.com/pro](https://vimeo.com/pro) and sign up
   - Complete the account setup process

2. **Organize Your Videos**
   - Create folders for different program types:
     - Chair Yoga
     - Tai Chi
   - Create subfolders for different levels:
     - Novice
     - Active
     - Advanced

3. **Upload Exercise Videos**
   - Upload each exercise video to the appropriate folder
   - For each video:
     - Set privacy to "Only people with the link can see this video"
     - Disable comments and likes
     - Enable download option (for offline viewing in the app)
     - Under advanced settings, enable "Hide from Vimeo" to ensure privacy

4. **Get Video IDs**
   - For each uploaded video, open it in Vimeo
   - From the URL (e.g., https://vimeo.com/123456789), note the ID (123456789)
   - You'll need these IDs to update the video URLs in the app

## Step 2: Deploy the Application

### Using GitHub and Vercel (Recommended)

1. **Fork the Repository**
   - Go to the CynthAI GitHub repository
   - Click "Fork" to create your own copy
   - Optionally, rename the repository to something meaningful like "cynthai-app"

2. **Update Video URLs**
   - Navigate to your forked repository
   - Open the file `src/data/programs.ts`
   - Replace all the sample video URLs with your Vimeo video URLs
   - Format should be: `https://player.vimeo.com/video/YOUR_VIDEO_ID`
   - Commit your changes with a message like "Update video URLs"

3. **Deploy to Vercel**
   - Log in to Vercel dashboard at [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure the project:
     - Framework Preset: Vite
     - Root Directory: `./` (default)
     - Build Command: `npm run build` (default)
     - Output Directory: `dist` (default)
   - Click "Deploy"
   - Vercel will build and deploy your application

4. **Set Up Custom Domain** (Optional)
   - In Vercel project dashboard, go to "Settings" > "Domains"
   - Add your custom domain and follow the instructions
   - Typically involves adding DNS records with your domain provider

## Step 3: Set Up for iOS Use

### Creating Home Screen Shortcut

Guide Cynthia through these steps:

1. **Open Safari** on her iPhone or iPad

2. **Navigate to App URL**
   - Enter the Vercel URL (e.g., https://cynthai.vercel.app) or your custom domain

3. **Add to Home Screen**
   - Tap the Share button (rectangle with arrow)
   - Scroll down and tap "Add to Home Screen"
   - Name it "CynthAI"
   - Tap "Add" in the top right

4. **Launch as App**
   - The app will now appear as an icon on her home screen
   - When tapped, it opens in a full-screen app-like experience

### iOS Music Integration

Instruct Cynthia on how to use her Music app with CynthAI:

1. **Create Playlists** (Optional)
   - Help her create playlists in the Apple Music app
   - Suggest creating playlists named "Chair Yoga" and "Tai Chi" with suitable music

2. **Using Music During Practice**
   - Open the Music app and start playing desired music
   - Return to home screen without closing Music
   - Open CynthAI from the home screen icon
   - The music will continue playing in the background
   - To control music during practice, she can:
     - Swipe down (newer iOS) or up (older iOS) to access Control Center
     - Use the music controls to pause, play, or change tracks

## Step 4: Testing and Verification

### Functionality Check

Perform these checks before sharing with Cynthia:

1. **Navigation Test**
   - Verify all navigation links work
   - Check that the bottom tabs navigate to the correct screens

2. **Video Playback Test**
   - Verify that exercise videos play correctly
   - Test the playback controls (play, pause)
   - Ensure the completion screen shows after finishing a video

3. **Music Integration Test**
   - Test the iOS Music app integration
   - Verify the in-app music player works correctly

4. **Offline Functionality Test**
   - Load the app, then enable Airplane Mode
   - Verify that previously viewed content is accessible
   - Check that the app doesn't crash when offline

5. **Accessibility Test**
   - Test with different text size settings
   - Verify high contrast mode works correctly

### Device Compatibility

Test on devices similar to what Cynthia will use:

1. **iPhone Testing**
   - Test on an iPhone with similar model/iOS version
   - Check both portrait and landscape orientations

2. **iPad Testing**
   - Test on an iPad if Cynthia will use one
   - Verify the layout adapts properly to the larger screen

## Step 5: Onboarding Cynthia

### Initial Setup Session

Schedule a session with Cynthia to:

1. **Install the App**
   - Guide her through accessing the web app
   - Help her add it to her home screen

2. **Complete Onboarding**
   - Help her through the onboarding process
   - Enter her preferences and settings

3. **First Practice**
   - Guide her through starting her first practice session
   - Demonstrate how to navigate between exercises
   - Show her how to use the music integration

4. **Answer Questions**
   - Allow time for questions and concerns
   - Take notes on any issues she encounters

### User Guide

Provide Cynthia with the CynthAI User Guide (included in the repository) which covers:

1. **Basic Navigation**
   - How to move between different sections
   - How to find and start practice sessions

2. **Practice Instructions**
   - How to follow along with exercise videos
   - How to track progress

3. **Managing Settings**
   - How to adjust text size and contrast
   - How to update preferences

4. **Troubleshooting**
   - Common issues and solutions
   - Who to contact for help

## Step 6: Ongoing Maintenance

### Regular Updates

Plan for these ongoing activities:

1. **Content Updates**
   - Add new exercise videos monthly
   - Upload to Vimeo and update program data
   - Deploy changes to keep content fresh

2. **App Updates**
   - Monitor for any issues or bugs
   - Make improvements based on feedback
   - Update dependencies periodically

3. **Backup Plan**
   - Regularly back up the repository
   - Keep copies of all video content
   - Document any custom changes made

### Support Process

Establish a clear support process for Cynthia:

1. **Primary Contact**
   - Designate a primary contact person
   - Provide clear contact information

2. **Regular Check-ins**
   - Schedule periodic check-ins to ensure everything is working
   - Gather feedback for improvements

3. **Issue Resolution**
   - Document any issues encountered
   - Prioritize fixes based on impact to user experience

## Technical Reference

### Repository Structure

```
cynthai/
├── public/             # Static assets
├── src/                # Source code
│   ├── components/     # UI components
│   ├── contexts/       # React context providers
│   ├── data/           # Data files and API functions
│   ├── pages/          # Page components
│   ├── styles/         # Global styles
│   └── utils/          # Utility functions
├── index.html          # HTML entry point
├── package.json        # Dependencies
└── README.md           # Documentation
```

### Key Files for Content Updates

- `src/data/programs.ts` - Exercise program data
- `src/data/inspiration.ts` - Inspirational content
- `src/data/music.ts` - Music data (for in-app player)

### Updating Content

To update content:

1. Edit the appropriate data file
2. Commit and push your changes to GitHub
3. Vercel will automatically deploy the updated version

## Conclusion

Following these instructions will result in a fully functional CynthAI web application that Cynthia can access from her iOS devices. The app provides a personalized chair yoga and tai chi experience with features tailored specifically for her needs.

The progressive web app approach allows for easy updates without requiring App Store approval, while the Vimeo integration provides high-quality video streaming with privacy controls.

For any technical issues during setup or maintenance, refer to the documentation in the repository or contact technical support.
