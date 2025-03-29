import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Song, Playlist } from '@/types';
import { useUser } from './UserContext';

type AudioContextType = {
  isPlaying: boolean;
  currentSong: Song | null;
  currentPlaylist: Playlist | null;
  volume: number;
  playlists: Playlist[];
  play: (song: Song) => Promise<void>;
  playPlaylist: (playlist: Playlist) => Promise<void>;
  playPause: () => Promise<void>;
  next: () => Promise<void>;
  previous: () => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  addPlaylist: (playlist: Playlist) => Promise<void>;
  removePlaylist: (playlistId: string) => Promise<void>;
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = (): AudioContextType => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

export const AudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { userProfile } = useUser();
  const [sound, setSound] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [playlistIndex, setPlaylistIndex] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  // Load playlists on mount
  useEffect(() => {
    const loadPlaylists = async () => {
      try {
        const playlistsData = localStorage.getItem('@cynthai_playlists');
        if (playlistsData) {
          setPlaylists(JSON.parse(playlistsData));
        }
      } catch (error) {
        console.error('Error loading playlists:', error);
      }
    };

    loadPlaylists();
  }, []);

  // Set volume from user preferences
  useEffect(() => {
    if (userProfile?.preferences?.musicVolume !== undefined) {
      setVolumeState(userProfile.preferences.musicVolume);
      if (sound) {
        sound.volume = userProfile.preferences.musicVolume;
      }
    }
  }, [userProfile, sound]);

  // Clean up sound on unmount
  useEffect(() => {
    return () => {
      if (sound) {
        sound.pause();
        sound.src = '';
      }
    };
  }, [sound]);

  // Save playlists to local storage
  const savePlaylists = async (data: Playlist[]) => {
    try {
      localStorage.setItem('@cynthai_playlists', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving playlists:', error);
    }
  };

  // Handle when song ends
  const handleSongEnd = () => {
    if (currentPlaylist) {
      next();
    } else {
      setIsPlaying(false);
    }
  };

  // Play song
  const play = async (song: Song) => {
    try {
      // Unload current sound if exists
      if (sound) {
        sound.pause();
        sound.removeEventListener('ended', handleSongEnd);
      }

      // Create new audio element
      const newSound = new Audio(song.url);
      newSound.volume = volume;
      
      // Add event listeners
      newSound.addEventListener('ended', handleSongEnd);
      
      // Start playing
      const playPromise = newSound.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setSound(newSound);
            setCurrentSong(song);
            setIsPlaying(true);
            setCurrentPlaylist(null);
          })
          .catch(error => {
            console.error('Error playing audio:', error);
            // Handle play() promise rejection - usually due to autoplay policy
            setIsPlaying(false);
          });
      }
    } catch (error) {
      console.error('Error playing song:', error);
    }
  };

  // Play playlist
  const playPlaylist = async (playlist: Playlist) => {
    if (playlist.songs.length === 0) return;

    setCurrentPlaylist(playlist);
    setPlaylistIndex(0);
    await play(playlist.songs[0]);
  };

  // Play/pause
  const playPause = async () => {
    if (!sound) return;

    if (isPlaying) {
      sound.pause();
      setIsPlaying(false);
    } else {
      try {
        await sound.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Error resuming playback:', error);
      }
    }
  };

  // Next song
  const next = async () => {
    if (!currentPlaylist || !currentSong) return;

    const nextIndex = (playlistIndex + 1) % currentPlaylist.songs.length;
    setPlaylistIndex(nextIndex);
    await play(currentPlaylist.songs[nextIndex]);
  };

  // Previous song
  const previous = async () => {
    if (!currentPlaylist || !currentSong) return;

    const prevIndex = (playlistIndex - 1 + currentPlaylist.songs.length) % currentPlaylist.songs.length;
    setPlaylistIndex(prevIndex);
    await play(currentPlaylist.songs[prevIndex]);
  };

  // Set volume
  const setVolume = async (newVolume: number) => {
    if (sound) {
      sound.volume = newVolume;
    }
    setVolumeState(newVolume);
  };

  // Add playlist
  const addPlaylist = async (playlist: Playlist) => {
    const updatedPlaylists = [...playlists, playlist];
    setPlaylists(updatedPlaylists);
    await savePlaylists(updatedPlaylists);
  };

  // Remove playlist
  const removePlaylist = async (playlistId: string) => {
    const updatedPlaylists = playlists.filter(p => p.id !== playlistId);
    setPlaylists(updatedPlaylists);
    await savePlaylists(updatedPlaylists);
  };

  const value: AudioContextType = {
    isPlaying,
    currentSong,
    currentPlaylist,
    volume,
    playlists,
    play,
    playPlaylist,
    playPause,
    next,
    previous,
    setVolume,
    addPlaylist,
    removePlaylist,
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};
