import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Image, ImageBackground } from 'react-native';
import { styles } from '@/styles/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEfeitoSonoro } from './efeitosonoro';

interface ConfigPopupProps {
    onClose: () => void;
}

// Chaves para armazenamento local
const STORAGE_KEYS = {
    MUSICA_HABILITADA: 'musica_habilitada',
    EFEITOS_HABILITADOS: 'efeitos_habilitados',
};

export const ConfigPopup: React.FC<ConfigPopupProps> = ({ onClose }) => {
    const [musicaHabilitada, setMusicaHabilitada] = useState(true);
    const [efeitosHabilitados, setEfeitosHabilitados] = useState(true);
    const { habilitarEfeitos, tocarEfeito } = useEfeitoSonoro();

    // Carrega configurações salvas ao abrir o popup
    useEffect(() => {
        carregarConfiguracoes();
    }, []);

    const carregarConfiguracoes = async () => {
        try {
            const musicaSalva = await AsyncStorage.getItem(STORAGE_KEYS.MUSICA_HABILITADA);
            const efeitosSalvos = await AsyncStorage.getItem(STORAGE_KEYS.EFEITOS_HABILITADOS);

            if (musicaSalva !== null) {
                setMusicaHabilitada(JSON.parse(musicaSalva));
            }
            if (efeitosSalvos !== null) {
                const efeitosStatus = JSON.parse(efeitosSalvos);
                setEfeitosHabilitados(efeitosStatus);
                habilitarEfeitos(efeitosStatus);
            }
        } catch (error) {
            console.warn('Erro ao carregar configurações de áudio:', error);
        }
    };

    const toggleMusica = async () => {
        const novoStatus = !musicaHabilitada;
        setMusicaHabilitada(novoStatus);
        
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.MUSICA_HABILITADA, JSON.stringify(novoStatus));
            // Aqui você pode adicionar lógica para controlar a música de fundo
            // Por exemplo: MusicaDefundo.setEnabled(novoStatus);
        } catch (error) {
            console.warn('Erro ao salvar configuração de música:', error);
        }

        // Toca som de clique se os efeitos estiverem habilitados
        if (efeitosHabilitados) {
            tocarEfeito('clique');
        }
    };

    const toggleEfeitos = async () => {
        const novoStatus = !efeitosHabilitados;
        setEfeitosHabilitados(novoStatus);
        
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.EFEITOS_HABILITADOS, JSON.stringify(novoStatus));
            habilitarEfeitos(novoStatus);
        } catch (error) {
            console.warn('Erro ao salvar configuração de efeitos:', error);
        }

        // Toca som apenas se estivermos HABILITANDO os efeitos
        if (novoStatus) {
            tocarEfeito('clique');
        }
    };

    const handleClose = () => {
        // Toca som antes de fechar se os efeitos estiverem habilitados
        if (efeitosHabilitados) {
            tocarEfeito('clique');
        }
        onClose();
    };

    return (
        <View style={styles.popUpContainer}>
            <ImageBackground 
                source={require('@/assets/images/quadro.png')}
                style={[styles.popUpDisplay, { minHeight: 300, paddingHorizontal: 30, paddingVertical: 25 }]} 
                resizeMode='contain'
            >
                {/* Header com título e botão fechar */}
                <View style={[styles.row, { marginBottom: 30 }]}>
                    <Text style={[styles.title, { fontSize: 28, color: '#421D05', width: '80%', textAlign: 'center' }]}>
                        Configurações de Áudio
                    </Text>
                    <Pressable 
                        style={[styles.absolute, { top: 10, right: 10 }]} 
                        onPress={handleClose}
                    >
                        <Image source={require('@/assets/images/icons/close.png')} />
                    </Pressable>
                </View>

                {/* Configuração de Música */}
                <View style={[styles.row, { 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: 25,
                    paddingHorizontal: 10 
                }]}>
                    <Text style={[styles.text, { fontSize: 20, color: '#421d05', flex: 1 }]}>
                        Música de Fundo
                    </Text>
                    <Pressable 
                        style={[
                            styles.checkbox, 
                            { 
                                backgroundColor: musicaHabilitada ? '#4CAF50' : '#F44336',
                                borderColor: musicaHabilitada ? '#45a049' : '#d32f2f',
                            }
                        ]}
                        onPress={toggleMusica}
                    >
                        {musicaHabilitada && (
                            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>✓</Text>
                        )}
                    </Pressable>
                </View>

                {/* Configuração de Efeitos Sonoros */}
                <View style={[styles.row, { 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    paddingHorizontal: 10 
                }]}>
                    <Text style={[styles.text, { fontSize: 20, color: '#421d05', flex: 1 }]}>
                        Efeitos Sonoros
                    </Text>
                    <Pressable 
                        style={[
                            styles.checkbox, 
                            { 
                                backgroundColor: efeitosHabilitados ? '#4CAF50' : '#F44336',
                                borderColor: efeitosHabilitados ? '#45a049' : '#d32f2f',
                            }
                        ]}
                        onPress={toggleEfeitos}
                    >
                        {efeitosHabilitados && (
                            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>✓</Text>
                        )}
                    </Pressable>
                </View>

                {/* Rodapé informativo */}
                <View style={{ marginTop: 30, alignItems: 'center' }}>
                    <Text style={[styles.text, { 
                        fontSize: 14, 
                        color: '#666', 
                        textAlign: 'center',
                        fontStyle: 'italic' 
                    }]}>
                        As configurações são salvas automaticamente
                    </Text>
                </View>
            </ImageBackground>
        </View>
    );
};

// Hook para acessar as configurações de áudio em outros componentes
export const useConfigAudio = () => {
    const [musicaHabilitada, setMusicaHabilitada] = useState(true);
    const [efeitosHabilitados, setEfeitosHabilitados] = useState(true);

    const carregarConfiguracoes = async () => {
        try {
            const musica = await AsyncStorage.getItem(STORAGE_KEYS.MUSICA_HABILITADA);
            const efeitos = await AsyncStorage.getItem(STORAGE_KEYS.EFEITOS_HABILITADOS);

            if (musica !== null) setMusicaHabilitada(JSON.parse(musica));
            if (efeitos !== null) setEfeitosHabilitados(JSON.parse(efeitos));
        } catch (error) {
            console.warn('Erro ao carregar configurações:', error);
        }
    };

    useEffect(() => {
        carregarConfiguracoes();
    }, []);

    return {
        musicaHabilitada,
        efeitosHabilitados,
        recarregarConfiguracoes: carregarConfiguracoes,
    };
};
