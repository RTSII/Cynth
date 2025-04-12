import React, { useState } from 'react';
import { Music, Info } from 'lucide-react';

const LocalMusicPlayer = () => {
  const [showHelp, setShowHelp] = useState(true);
  
  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Music Player</h1>
        <button 
          onClick={() => setShowHelp(!showHelp)}
          className="p-2 rounded-full bg-blue-100 text-blue-600"
        >
          <Info size={24} />
        </button>
      </div>
      
      {showHelp && (
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="font-medium mb-2">Play Music from Your Device</h3>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Before starting your exercise, open the Music app on your device</li>
            <li>Select and start playing your preferred playlist or song</li>
            <li>Return to CynthAI by pressing the home button and reopening this app</li>
            <li>Your music will continue playing in the background while you exercise</li>
            <li>You can access playback controls by swiping up to open Control Center</li>
          </ol>
        </div>
      )}
      
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="mb-6 p-4 bg-gray-100 rounded-full">
          <Music size={64} className="text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Use Your Music Library</h2>
        <p className="text-gray-600 text-center mb-8">
          CynthAI works with the Music app on your iPhone and iPad.
          Play your favorite songs while you practice!
        </p>
        
        <div className="w-full max-w-md bg-white rounded-lg shadow p-4">
          <h3 className="font-medium mb-3">Suggested Exercise Playlists</h3>
          <ul className="space-y-3">
            <li className="flex items-center p-2 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-purple-600 text-lg">🧘</span>
              </div>
              <div>
                <p className="font-medium">Calming Melodies</p>
                <p className="text-sm text-gray-500">Perfect for gentle stretching</p>
              </div>
            </li>
            <li className="flex items-center p-2 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-blue-600 text-lg">🌊</span>
              </div>
              <div>
                <p className="font-medium">Nature Sounds</p>
                <p className="text-sm text-gray-500">Ideal for tai chi movements</p>
              </div>
            </li>
            <li className="flex items-center p-2 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-green-600 text-lg">🌿</span>
              </div>
              <div>
                <p className="font-medium">Morning Meditation</p>
                <p className="text-sm text-gray-500">Start your day with calm</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LocalMusicPlayer;