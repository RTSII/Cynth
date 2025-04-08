# CynthAI Launch Instructions

This guide provides detailed instructions for setting up, deploying, and launching the CynthAI web application for Cynthia Steen using free hosting options.

## Video Hosting Setup

### Option 1: YouTube Unlisted Videos (Recommended)

1. **Create a YouTube Account**
   - Go to youtube.com and sign in with a Google account
   - This will be used to host all exercise videos

2. **Upload Exercise Videos**
   - Click the camera icon in the top right and select "Upload video"
   - Upload each exercise video
   - Set each video to "Unlisted" in the visibility settings
   - This makes videos accessible only via direct link, not searchable

3. **Organize Videos**
   - Create playlists for different exercise types (Chair Yoga, Tai Chi)
   - Add videos to appropriate playlists
   - Copy video IDs for use in the app (the part after "v=" in YouTube URLs)

4. **Update App Configuration**
   - Update the video URLs in the app data to use YouTube links

### Option 2: Google Drive (Alternative)

1. **Set Up Google Drive**
   - Sign in to Google Drive (drive.google.com)
   - Create folders for organizing exercise videos

2. **Upload Videos**
   - Upload exercise videos to appropriate folders
   - Right-click each video and select "Get shareable link"
   - Set sharing to "Anyone with the link can view"

3. **Configure for Direct Play**
   - Replace the file ID in each shared link:
     - From: `https://drive.google.com/file/d/{FILE_ID}/view?usp=sharing`
     - To: `https://drive.google.com/uc?export=download&id={FILE_ID}`

4. **Update App Configuration**
   - Update video URLs in the app data to use the direct Google Drive links

## Application Hosting

### GitHub Pages (Free Hosting)

1. **Create GitHub Account**
   - Sign up at github.com if you don't have an account

2. **Create New Repository**
   - Name it "cynthai" or similar
   - Make it public (for free GitHub Pages hosting)

3. **Upload App Files**
   - Clone the repository to your computer
   - Add all app files to the repository
   - Push to GitHub

4. **Enable GitHub Pages**
   - Go to repository settings
   - Scroll down to "GitHub Pages" section
   - Set source to "main" branch
   - The app will be available at `https://[your-username].github.io/cynthai/`

### Alternative: InfinityFree Hosting

1. **Sign Up for InfinityFree**
   - Go to infinityfree.net and create a free account

2. **Create a New Hosting Account**
   - Name it "CynthAI" or similar
   - Choose a subdomain (e.g., cynthai.infinityfreeapp.com)

3. **Upload Files via FTP**
   - Use FileZilla or similar FTP client
   - Connect using credentials provided by InfinityFree
   - Upload all app files to the public_html folder

## Setting Up Music Integration

The app has been configured to work with Cynthia's existing Music app on her iPhone/iPad. No additional music hosting is needed.

Instructions for Cynthia:

1. **Playing Music During Exercise**
   - Open the Music app on your iPhone/iPad before starting exercise
   - Start playing your desired playlist or song
   - Switch to CynthAI app (the music will continue playing)
   - Access music controls by swiping to open Control Center

2. **Creating Exercise Playlists**
   - Create playlists in the Music app named "Chair Yoga" and "Tai Chi"
   - Add relaxing songs appropriate for each exercise type
   - These will be easy to find when starting an exercise session

## iOS Device Setup

### Adding CynthAI to Home Screen

1. **Open Safari** on the iPhone/iPad
2. **Navigate** to the app URL (e.g., `https://[your-username].github.io/cynthai/`)
3. **Tap the Share button** (rectangle with arrow)
4. **Select "Add to Home Screen"**
5. **Name it "CynthAI"** and tap "Add"

This creates an app-like experience that Cynthia can access directly from her home screen.

## Tips for Cynthia

### Using the App

- **Start music first**: Open the Music app and start playing before opening CynthAI
- **Access music controls**: Swipe to open Control Center while using CynthAI
- **Save to home screen**: For quick access, add the web app to your home screen
- **Exercise offline**: Once loaded, most features will work without internet
- **Adjust text size**: Use the accessibility settings if text is hard to read

### Troubleshooting

- **If videos don't play**: Check internet connection or restart the app
- **If music stops**: Return to Music app and restart playback
- **If app freezes**: Close and reopen from the home screen

## Maintenance and Updates

To update the app in the future:

1. Make changes to the app files
2. Upload the new files via the same method used for initial deployment
3. The app will automatically update next time Cynthia opens it

---

These instructions provide a cost-effective way to set up CynthAI using free hosting options while integrating with Cynthia's existing music library. The app is designed to be simple to use and maintain for your mother's specific needs.
