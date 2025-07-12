import React, { useEffect, useState } from 'react';
import { Audio } from 'expo-av';

interface MusicaDefundoProps {
  volume?: number; // Volume de 0.0 a 1.0
  enabled?: boolean; // Permite ligar/desligar a música
}

export default function MusicaDefundo({ volume = 0.3, enabled = true }: MusicaDefundoProps) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadSound();
    
    // Cleanup quando o componente for desmontado
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    if (sound && isLoaded) {
      if (enabled) {
        playSound();
      } else {
        pauseSound();
      }
    }
  }, [enabled, sound, isLoaded]);

  useEffect(() => {
    if (sound && isLoaded) {
      sound.setVolumeAsync(volume);
    }
  }, [volume, sound, isLoaded]);

  const loadSound = async () => {
    try {
      // Configurar modo de áudio para permitir reprodução em background
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      // Carregar o arquivo de áudio
      // Usando o arquivo trilha.mp3 que você fez upload
      const { sound: newSound } = await Audio.Sound.createAsync(
        require('@/assets/audio/trilha.mp3'),
        {
          shouldPlay: enabled,
          isLooping: true,
          volume: volume,
        }
      );

      setSound(newSound);
      setIsLoaded(true);
    } catch (error) {
      console.warn('Erro ao carregar música de fundo:', error);
    }
  };

  const playSound = async () => {
    try {
      if (sound) {
        await sound.playAsync();
      }
    } catch (error) {
      console.warn('Erro ao reproduzir música:', error);
    }
  };

  const pauseSound = async () => {
    try {
      if (sound) {
        await sound.pauseAsync();
      }
    } catch (error) {
      console.warn('Erro ao pausar música:', error);
    }
  };

  // Este componente não renderiza nada visualmente
  return null;
}

// Hook personalizado para controlar a música globalmente
export const useMusicaDefundo = () => {
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [volume, setVolume] = useState(0.3);

  const toggleMusic = () => setMusicEnabled(!musicEnabled);
  const changeVolume = (newVolume: number) => setVolume(Math.max(0, Math.min(1, newVolume)));

  return {
    musicEnabled,
    volume,
    toggleMusic,
    changeVolume,
    setMusicEnabled,
    setVolume,
  };
};
