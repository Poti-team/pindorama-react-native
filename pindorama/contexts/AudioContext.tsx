import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AudioContextType {
  musicaHabilitada: boolean;
  efeitosHabilitados: boolean;
  volumeMusica: number;
  setMusicaHabilitada: (enabled: boolean) => void;
  setEfeitosHabilitados: (enabled: boolean) => void;
  setVolumeMusica: (volume: number) => void;
  toggleMusica: () => void;
  toggleEfeitos: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

// Chaves para armazenamento local
const STORAGE_KEYS = {
  MUSICA_HABILITADA: 'musica_habilitada',
  EFEITOS_HABILITADOS: 'efeitos_habilitados',
  VOLUME_MUSICA: 'volume_musica',
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [musicaHabilitada, setMusicaHabilitada] = useState(true);
  const [efeitosHabilitados, setEfeitosHabilitados] = useState(true);
  const [volumeMusica, setVolumeMusica] = useState(0.3);

  // Carrega configurações salvas ao inicializar
  useEffect(() => {
    carregarConfiguracoes();
  }, []);

  const carregarConfiguracoes = async () => {
    try {
      const musicaSalva = await AsyncStorage.getItem(STORAGE_KEYS.MUSICA_HABILITADA);
      const efeitosSalvos = await AsyncStorage.getItem(STORAGE_KEYS.EFEITOS_HABILITADOS);
      const volumeSalvo = await AsyncStorage.getItem(STORAGE_KEYS.VOLUME_MUSICA);

      if (musicaSalva !== null) {
        setMusicaHabilitada(JSON.parse(musicaSalva));
      }
      if (efeitosSalvos !== null) {
        setEfeitosHabilitados(JSON.parse(efeitosSalvos));
      }
      if (volumeSalvo !== null) {
        setVolumeMusica(JSON.parse(volumeSalvo));
      }
    } catch (error) {
      console.warn('Erro ao carregar configurações de áudio:', error);
    }
  };

  const salvarMusicaHabilitada = async (enabled: boolean) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.MUSICA_HABILITADA, JSON.stringify(enabled));
      setMusicaHabilitada(enabled);
    } catch (error) {
      console.warn('Erro ao salvar configuração de música:', error);
    }
  };

  const salvarEfeitosHabilitados = async (enabled: boolean) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.EFEITOS_HABILITADOS, JSON.stringify(enabled));
      setEfeitosHabilitados(enabled);
    } catch (error) {
      console.warn('Erro ao salvar configuração de efeitos:', error);
    }
  };

  const salvarVolumeMusica = async (volume: number) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.VOLUME_MUSICA, JSON.stringify(volume));
      setVolumeMusica(volume);
    } catch (error) {
      console.warn('Erro ao salvar volume da música:', error);
    }
  };

  const toggleMusica = () => {
    salvarMusicaHabilitada(!musicaHabilitada);
  };

  const toggleEfeitos = () => {
    salvarEfeitosHabilitados(!efeitosHabilitados);
  };

  const value: AudioContextType = {
    musicaHabilitada,
    efeitosHabilitados,
    volumeMusica,
    setMusicaHabilitada: salvarMusicaHabilitada,
    setEfeitosHabilitados: salvarEfeitosHabilitados,
    setVolumeMusica: salvarVolumeMusica,
    toggleMusica,
    toggleEfeitos,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};

export const useAudioContext = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudioContext deve ser usado dentro de um AudioProvider');
  }
  return context;
};
