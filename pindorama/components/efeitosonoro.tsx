import { Audio } from 'expo-av';

// Tipos de efeitos sonoros disponíveis
export type TipoEfeitoSonoro = 
  | 'clique'
  | 'acerto'
  | 'erro'
  | 'inicio';

// Mapeamento dos arquivos de áudio
const EFEITOS_SONOROS: Record<TipoEfeitoSonoro, any> = {
  clique: require('@/assets/audio/clique.mp3'),
  acerto: require('@/assets/audio/acerto.mp3'),
  erro: require('@/assets/audio/erro.mp3'),
  inicio: require('@/assets/audio/inicio.mp3'),
};

class EfeitoSonoroManager {
  private sounds: Map<TipoEfeitoSonoro, Audio.Sound> = new Map();
  private volumeGlobal: number = 0.7;
  private efeitosHabilitados: boolean = true;

  constructor() {
    this.configurarAudio();
  }

  private async configurarAudio() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    } catch (error) {
      console.warn('Erro ao configurar modo de áudio:', error);
    }
  }

  private async carregarSom(tipo: TipoEfeitoSonoro): Promise<Audio.Sound | null> {
    try {
      if (this.sounds.has(tipo)) {
        return this.sounds.get(tipo)!;
      }

      const { sound } = await Audio.Sound.createAsync(
        EFEITOS_SONOROS[tipo],
        {
          shouldPlay: false,
          isLooping: false,
          volume: this.volumeGlobal,
        }
      );

      this.sounds.set(tipo, sound);
      return sound;
    } catch (error) {
      console.warn(`Erro ao carregar efeito sonoro '${tipo}':`, error);
      return null;
    }
  }

  /**
   * Toca um efeito sonoro específico
   * @param tipo - Nome do efeito sonoro a ser tocado
   * @param volume - Volume específico para este efeito (0.0 a 1.0)
   */
  async tocarEfeito(tipo: TipoEfeitoSonoro, volume?: number): Promise<void> {
    if (!this.efeitosHabilitados) return;

    try {
      const som = await this.carregarSom(tipo);
      if (!som) return;

      // Para o som se estiver tocando e reinicia
      await som.stopAsync();
      await som.setPositionAsync(0);

      // Define o volume (usa o volume específico ou o global)
      const volumeFinal = volume !== undefined ? volume : this.volumeGlobal;
      await som.setVolumeAsync(Math.max(0, Math.min(1, volumeFinal)));

      // Toca o efeito
      await som.playAsync();
    } catch (error) {
      console.warn(`Erro ao tocar efeito sonoro '${tipo}':`, error);
    }
  }

  /**
   * Define o volume global para todos os efeitos
   * @param volume - Volume de 0.0 a 1.0
   */
  definirVolumeGlobal(volume: number): void {
    this.volumeGlobal = Math.max(0, Math.min(1, volume));
    
    // Atualiza o volume de todos os sons carregados
    this.sounds.forEach(async (som) => {
      try {
        await som.setVolumeAsync(this.volumeGlobal);
      } catch (error) {
        console.warn('Erro ao atualizar volume:', error);
      }
    });
  }

  /**
   * Habilita ou desabilita todos os efeitos sonoros
   * @param habilitado - true para habilitar, false para desabilitar
   */
  habilitarEfeitos(habilitado: boolean): void {
    this.efeitosHabilitados = habilitado;
  }

  /**
   * Para todos os efeitos sonoros que estão tocando
   */
  async pararTodosEfeitos(): Promise<void> {
    const promises = Array.from(this.sounds.values()).map(async (som) => {
      try {
        await som.stopAsync();
      } catch (error) {
        console.warn('Erro ao parar efeito:', error);
      }
    });

    await Promise.all(promises);
  }

  /**
   * Limpa todos os sons da memória
   */
  async limparSons(): Promise<void> {
    const promises = Array.from(this.sounds.values()).map(async (som) => {
      try {
        await som.unloadAsync();
      } catch (error) {
        console.warn('Erro ao descarregar som:', error);
      }
    });

    await Promise.all(promises);
    this.sounds.clear();
  }

  /**
   * Obtém informações sobre os efeitos carregados
   */
  obterEstatisticas() {
    return {
      efeitosCarregados: this.sounds.size,
      volumeGlobal: this.volumeGlobal,
      efeitosHabilitados: this.efeitosHabilitados,
      tiposDisponiveis: Object.keys(EFEITOS_SONOROS),
    };
  }
}

// Instância global do gerenciador
const efeitoSonoroManager = new EfeitoSonoroManager();

/**
 * Hook para usar efeitos sonoros nos componentes
 */
export const useEfeitoSonoro = () => {
  return {
    /**
     * Toca um efeito sonoro
     * @param tipo - Nome do efeito a ser tocado
     * @param volume - Volume específico (opcional)
     */
    tocarEfeito: (tipo: TipoEfeitoSonoro, volume?: number) => 
      efeitoSonoroManager.tocarEfeito(tipo, volume),

    /**
     * Define o volume global
     */
    definirVolume: (volume: number) => 
      efeitoSonoroManager.definirVolumeGlobal(volume),

    /**
     * Habilita/desabilita efeitos
     */
    habilitarEfeitos: (habilitado: boolean) => 
      efeitoSonoroManager.habilitarEfeitos(habilitado),

    /**
     * Para todos os efeitos
     */
    pararTodos: () => 
      efeitoSonoroManager.pararTodosEfeitos(),

    /**
     * Obtém estatísticas
     */
    obterEstatisticas: () => 
      efeitoSonoroManager.obterEstatisticas(),
  };
};

/**
 * Função global para tocar efeitos sonoros
 * @param tipo - Nome do efeito sonoro
 * @param volume - Volume específico (opcional)
 */
export const tocarEfeitoSonoro = (tipo: TipoEfeitoSonoro, volume?: number) => {
  return efeitoSonoroManager.tocarEfeito(tipo, volume);
};

export default efeitoSonoroManager;
