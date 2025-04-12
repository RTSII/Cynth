# CynthAI Launch Instructions

This guide provides step-by-step instructions for deploying the optimized CynthAI application, setting up the video content, and onboarding Cynthia to use the app.

## Prerequisites

### Development Tools (For Setup Only)

1. **Node.js** (v18 or later)
   - Download from [nodejs.org](https://nodejs.org/)

2. **Git**
   - Download from [git-scm.com](https://git-scm.com/)

3. **GitHub Account**
   - Sign up at [github.com](https://github.com) if you don't already have an account

### Services

1. **Vercel Account** (Free)
   - Sign up at [vercel.com](https://vercel.com)
   - Connect it to your GitHub account during signup

2. **Vimeo Pro Account** ($20/month)
   - Sign up at [vimeo.com/pro](https://vimeo.com/pro)
   - This will host all exercise videos with privacy controls

3. **Domain Name** (Optional, ~$12/year)
   - Recommended for easier access (e.g., cynthai.app)
   - Can use services like Namecheap, Google Domains, or GoDaddy

## Step 1: Set Up the Repository

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/cynthai.git
   cd cynthai
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Create the Public Assets Directory Structure**
   ```bash
   mkdir -p public/assets/icons
   mkdir -p public/assets/images/exercises
   mkdir -p public/assets/images/inspiration
   mkdir -p public/assets/images/programs
   mkdir -p public/assets/audio/feedback
   ```

4. **Add Placeholder Icons and Images**
   - Place app icons in `public/assets/icons/`
   - Add program thumbnails in `public/assets/images/programs/`
   - Add audio feedback sounds in `public/assets/audio/feedback/`

## Step 2: Prepare Video Content

### Upload Videos to Vimeo

1. **Create a Vimeo Pro Account**
   - Complete the signup process at [vimeo.com/pro](https://vimeo.com/pro)

2. **Create Organized Folders**
   - Create a "CynthAI" project
   - Create subfolders for "Chair Yoga" and "Tai Chi"
   - Create further subfolders for difficulty levels: "Novice", "Active", "Advanced"

3. **Record and Upload Exercise Videos**
   - Follow the recording guidelines:
     - Use landscape orientation (16:9)
     - Ensure good lighting with clear visibility
     - Record in 1080p resolution
     - Use a tripod for stability
     - Include clear verbal instructions
     - Keep videos between 3-5 minutes per exercise

4. **Configure Video Settings**
   - Set privacy to "Only people with the link"
   - Enable download option (for offline viewing)
   - Disable comments and likes
   - Hide from Vimeo's main site

5. **Collect Video IDs**
   - For each uploaded video, note the ID from the URL (e.g., https://vimeo.com/123456789)
   - Update these IDs in the `src/data/programs.ts` file

## Step 3: Customize Application Settings

1. **Update User Information**
   - Open `src/contexts/UserContext.tsx`
   - Modify the `DEFAULT_USER` object to include Cynthia's name and preferences

2. **Customize Program Data**
   - Open `src/data/programs.ts`
   - Update the program data with your actual video IDs and content
   - Ensure exercises are appropriate for Cynthia's needs

3. **Add Inspirational Content**
   - Create an `src/data/inspiration.ts` file
   - Add personally meaningful images and quotes

4. **Configure App Settings**
   - Update app name, description, and theme colors in `vite.config.ts`
   - Adjust accessibility settings based on Cynthia's specific needs

## Step 4: Local Testing

1. **Start the Development Server**
   ```bash
   npm run dev
   ```

2. **Test on Desktop Browser**
   - Open `http://localhost:3000` in Chrome, Firefox, and Safari
   - Test all features and navigation
   - Verify video playback works correctly

3. **Test on Mobile Devices**
   - Enable the development server on your network
   ```bash
   npm run dev -- --host
   ```
   - Connect your iPhone/iPad to the same network
   - Visit the network IP address shown in the terminal
   - Test PWA installation by adding to home screen

4. **Verify Offline Functionality**
   - After loading the app, enable Airplane Mode
   - Check that the app can still function with cached content

## Step 5: Deployment

### Build and Deploy with Vercel

1. **Push Your Code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push
   ```

2. **Set Up Vercel Project**
   - Log in to your Vercel account
   - Click "New Project"
   - Import your GitHub repository
   - Configure the build settings:
     - Framework Preset: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`

3. **Configure Environment Variables** (if needed)
   - Add any required API keys or configuration values

4. **Deploy the Project**
   - Click "Deploy"
   - Wait for the build to complete

5. **Set Up Custom Domain** (Optional)
   - In the Vercel dashboard, go to your project settings
   - Click on "Domains"
   - Add your custom domain and follow the instructions

## Step 6: Set Up Cynthia's Devices

### iPhone Setup

1. **Open Safari on Cynthia's iPhone**
   - Navigate to your Vercel URL (e.g., `https://cynthai.vercel.app`) or custom domain

2. **Add to Home Screen**
   - Tap the Share button (rectangle with arrow)
   - Scroll down and tap "Add to Home Screen"
   - Name it "CynthAI"
   - Tap "Add"

3. **Launch the App**
   - The app will now appear on the home screen
   - Tap the icon to open in fullscreen mode

### iPad Setup (If Applicable)

1. **Repeat the Same Process on iPad**
   - Follow the iPhone steps to add to home screen
   - The app will automatically adjust its layout for the larger screen

2. **Position for Optimal Viewing**
   - Show Cynthia how to position the iPad for the best view during exercises
   - Consider getting a tablet stand for hands-free viewing

## Step 7: Onboard Cynthia

### Initial Setup Session

1. **Guide Through First Launch**
   - Sit with Cynthia during the first launch
   - Help her complete the onboarding process
   - Explain each screen and setting

2. **Set Up Personal Preferences**
   - Adjust text size to her comfort level
   - Enable high contrast mode if needed
   - Configure audio preferences

3. **Select Initial Programs**
   - Help her select the appropriate starting programs for Chair Yoga and Tai Chi
   - Explain the progression system

### First Practice Session

1. **Demonstrate Exercise Flow**
   - Start a practice session together
   - Show how to play, pause, and navigate between exercises
   - Explain modifications and safety considerations

2. **Teach Music Integration**
   - Demonstrate how to use the iOS Music app with CynthAI
   - Show how to create and select playlists

3. **Explain Progress Tracking**
   - Show how streaks and achievements work
   - Explain the importance of consistent practice

## Step 8: Ongoing Maintenance

### Regular Content Updates

1. **Schedule Monthly Updates**
   - Plan to add new exercise videos monthly
   - Update the program data with new content
   - Add fresh inspirational material

2. **Technical Maintenance**
   - Check for dependency updates quarterly
   - Run the latest build and test on current devices
   - Monitor for any issues or bugs

### Support Process

1. **Create a Support System**
   - Set up a simple way for Cynthia to report issues (phone, text, email)
   - Schedule regular check-ins to ensure the app is working well
   - Be available for technical assistance when needed

2. **Document Common Solutions**
   - Create a simple troubleshooting guide for common issues
   - Include steps for restarting the app, clearing cache, etc.

## Important File Locations

### Key Configuration Files

- **Program Data**: `src/data/programs.ts`
- **User Context**: `src/contexts/UserContext.tsx`
- **Progress Tracking**: `src/contexts/ProgressContext.tsx`
- **UI Styles**: `src/styles/index.css`

### Core Components

- **Video Player**: `src/components/exercise/VideoPlayer.tsx`
- **Layout**: `src/components/Layout.tsx`
- **Dashboard**: `src/pages/Dashboard.tsx`
- **Exercise Player**: `src/pages/ExercisePlayer.tsx`

## Backup Procedures

### Regular Backups

1. **Code Repository**
   - The GitHub repository serves as the primary backup
   - Consider creating periodic releases for version tracking

2. **Video Content**
   - Keep local copies of all uploaded videos
   - Vimeo Pro includes cloud storage for your content

3. **User Data**
   - The app uses localStorage for user data
   - Consider implementing cloud backup for progress data in future updates

## Technical Requirements

### Minimum Device Requirements

- **iOS**: Version 14.0 or later
- **Safari**: Latest version recommended
- **Storage**: 100MB for app, plus space for cached videos
- **Internet**: Required for initial setup and video streaming
  - 5 Mbps or faster recommended for smooth streaming

### Recommended Setup

- **Device**: iPad (any current model) for larger display
- **Internet**: Wi-Fi connection with 10+ Mbps
- **Accessories**: Tablet stand for hands-free viewing
- **Music**: Pre-created playlists in the Apple Music app

## Conclusion

By following these instructions, you'll have a fully functional CynthAI application deployed and ready for Cynthia to use. The progressive web app approach provides a seamless, app-like experience without requiring App Store approval, while the Vimeo integration ensures high-quality video delivery with privacy controls.

Remember to maintain regular contact with Cynthia to address any questions or difficulties she might encounter, and to provide updates with new content to keep her engaged with her yoga and tai chi practice.
