import React, { useState } from 'react';
import { Music, Info, Play, Pause, ChevronRight, Plus, Trash } from 'lucide-react';

// Components
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

// Contexts
import { useAudio } from '@/contexts/AudioContext';
import { useUser } from '@/contexts/UserContext';

// Data
import { samplePlaylists } from '@/data/music';
import { Song, Playlist } from '@/types';

const MusicPage: React.FC = () => {
  const { 
    isPlaying, 
    currentSong, 
    currentPlaylist, 
    playlists, 
    play, 
    playPlaylist,
    playPause,
    next,
    previous,
    setVolume,
    volume,
    addPlaylist,
    removePlaylist,
  } = useAudio();
  
  const { userProfile, updatePreferences } = useUser();
  
  const [showHelp, setShowHelp] = useState(true);
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [activeTab, setActiveTab] = useState<'app' | 'device'>('device');
  
  // Combine sample playlists with user playlists
  const allPlaylists = [...samplePlaylists, ...playlists];
  
  // Handle volume change
  const handleVolumeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    await setVolume(newVolume);
    
    // Also update user preferences
    if (userProfile) {
      updatePreferences({ musicVolume: newVolume });
    }
  };
  
  // Create a new playlist
  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return;
    
    const newPlaylist: Playlist = {
      id: `playlist-${Date.now()}`,
      name: newPlaylistName.trim(),
      description: 'Custom playlist',
      songs: [],
    };
    
    await addPlaylist(newPlaylist);
    setNewPlaylistName('');
    setShowCreatePlaylist(false);
  };
  
  // Delete a playlist
  const handleDeletePlaylist = async (playlistId: string) => {
    if (confirm('Are you sure you want to delete this playlist?')) {
      await removePlaylist(playlistId);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Music Player</h1>
        <button 
          onClick={() => setShowHelp(!showHelp)}
          className="p-2 rounded-full bg-blue-100 text-primary-600"
          aria-label={showHelp ? 'Hide help' : 'Show help'}
        >
          <Info size={24} />
        </button>
      </div>
      
      {/* Help card */}
      {showHelp && (
        <Card className="bg-blue-50 border-none mb-6">
          <CardContent>
            <h3 className="font-medium mb-2">Play Music from Your Device</h3>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Before starting your exercise, open the Music app on your device</li>
              <li>Select and start playing your preferred playlist or song</li>
              <li>Return to CynthAI by pressing the home button and reopening this app</li>
              <li>Your music will continue playing in the background while you exercise</li>
              <li>You can access playback controls by swiping up to open Control Center</li>
            </ol>
          </CardContent>
        </Card>
      )}
      
      {/* Tabs for music sources */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'device' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('device')}
        >
          Device Music
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'app' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('app')}
        >
          In-App Music
        </button>
      </div>
      
      {/* Device Music Tab */}
      {activeTab === 'device' && (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="mb-6 p-4 bg-gray-100 rounded-full">
            <Music size={64} className="text-primary-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Use Your Music Library</h2>
          <p className="text-gray-600 text-center mb-8 max-w-md">
            CynthAI works with the Music app on your iPhone and iPad.
            Play your favorite songs while you practice!
          </p>
          
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Suggested Exercise Playlists</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* In-App Music Tab */}
      {activeTab === 'app' && (
        <div>
          {/* Now Playing */}
          {currentSong && (
            <Card className="mb-6">
              <CardContent>
                <div className="flex items-center">
                  <img 
                    src={currentSong.artwork} 
                    alt={currentSong.title}
                    className="w-20 h-20 rounded-lg object-cover mr-4"
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-bold">Now Playing</h3>
                    <p className="font-medium">{currentSong.title}</p>
                    <p className="text-gray-500 text-sm">{currentSong.artist}</p>
                  </div>
                </div>
                
                {/* Playback Controls */}
                <div className="mt-4">
                  <div className="flex justify-center items-center space-x-6">
                    <button 
                      onClick={previous}
                      className="p-2 hover:bg-gray-100 rounded-full"
                      aria-label="Previous"
                    >
                      <ChevronRight className="rotate-180" size={24} />
                    </button>
                    
                    <button
                      onClick={playPause}
                      className="bg-primary-500 text-white p-4 rounded-full hover:bg-primary-600"
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                    </button>
                    
                    <button 
                      onClick={next}
                      className="p-2 hover:bg-gray-100 rounded-full"
                      aria-label="Next"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </div>
                </div>
                
                {/* Volume Control */}
                <div className="mt-4 flex items-center">
                  <Music size={20} className="text-gray-400 mr-3" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <Music size={20} className="text-gray-900 ml-3" />
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Playlists */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Playlists</h2>
              <Button
                variant="primary"
                size="sm"
                icon={Plus}
                onClick={() => setShowCreatePlaylist(true)}
              >
                Create Playlist
              </Button>
            </div>
            
            {/* Create Playlist Form */}
            {showCreatePlaylist && (
              <Card className="mb-4">
                <CardContent>
                  <h3 className="font-medium mb-2">Create New Playlist</h3>
                  <div className="flex items-center">
                    <input
                      type="text"
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 mr-2"
                      placeholder="Playlist name"
                      value={newPlaylistName}
                      onChange={(e) => setNewPlaylistName(e.target.value)}
                    />
                    <Button
                      variant="primary"
                      onClick={handleCreatePlaylist}
                    >
                      Create
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setShowCreatePlaylist(false)}
                      className="ml-2"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Playlist Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allPlaylists.map((playlist) => (
                <Card key={playlist.id} className="hover:shadow-lg transition-shadow">
                  <CardContent>
                    <div className="flex justify-between">
                      <h3 className="font-bold">{playlist.name}</h3>
                      {!samplePlaylists.some(p => p.id === playlist.id) && (
                        <button
                          onClick={() => handleDeletePlaylist(playlist.id)}
                          className="text-red-500"
                          aria-label="Delete playlist"
                        >
                          <Trash size={16} />
                        </button>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm mb-2">{playlist.description}</p>
                    <p className="text-sm">{playlist.songs.length} songs</p>
                    
                    <div className="mt-3 flex justify-between">
                      <Button
                        variant="primary"
                        size="sm"
                        icon={Play}
                        onClick={() => playPlaylist(playlist)}
                      >
                        Play All
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          // Will show playlist details in future
                          alert(`Playlist details: ${playlist.name}`);
                        }}
                      >
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicPage;