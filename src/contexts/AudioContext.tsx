import React, { createContext, useContext, useState } from 'react';

interface AudioContextType {
  playSound: (soundName: string) => void;
  setVolume: (volume: number) => void;
}

export const AudioContext = createContext<AudioContextType>({
  playSound: () => { },
  setVolume: () => { },
});

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [volume, setVolume] = useState(1);

  const playSound = (soundName: string) => {
    // Implement sound playing logic here
    console.log(`Playing sound: ${soundName} at volume ${volume}`);
  };

  return (
    <AudioContext.Provider value={{ playSound, setVolume }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudioContext = () => useContext(AudioContext);
