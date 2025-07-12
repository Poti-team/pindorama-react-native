import React, { useEffect } from 'react';
import { View, Text, Pressable, Image, ImageBackground } from 'react-native';
import { styles } from '@/styles/styles';
import { useEfeitoSonoro } from './efeitosonoro';
import { useAudioContext } from '@/contexts/AudioContext';

interface ConfigPopupProps {
    onClose: () => void;
}

export const ConfigPopup: React.FC<ConfigPopupProps> = ({ onClose }) => {
    const { musicaHabilitada, efeitosHabilitados, toggleMusica, toggleEfeitos } = useAudioContext();
    const { habilitarEfeitos, tocarEfeito } = useEfeitoSonoro();

    // Sincroniza efeitos sonoros com o contexto quando o componente for montado
    useEffect(() => {
        habilitarEfeitos(efeitosHabilitados);
    }, [efeitosHabilitados, habilitarEfeitos]);

    const handleToggleMusica = () => {
        toggleMusica();
        // Toca som de clique se os efeitos estiverem habilitados
        if (efeitosHabilitados) {
            tocarEfeito('clique');
        }
    };

    const handleToggleEfeitos = () => {
        const novoStatus = !efeitosHabilitados;
        toggleEfeitos();
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
            <View 
                style={[styles.popUpDisplay, { minHeight: 300, paddingHorizontal: 30, paddingVertical: 25, justifyContent: 'space-between' }]} 
            >
                {/* Header com título e botão fechar */}
                <View style={[styles.row, { marginBottom: 30 }]}>
                    <Pressable 
                        style={[styles.absolute, { top: 0, right: -5 }]} 
                        onPress={handleClose}
                    >
                        <Image source={require('@/assets/images/icons/close.png')} />
                    </Pressable>
                </View>

                {/* Configuração de Música */}
                <View style={[styles.row, { 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    paddingHorizontal: 10 
                }]}>
                    <Text style={[styles.text, { fontSize: 20, color: '#642C08' }]}>
                        Música de Fundo
                    </Text>
                    <Pressable 
                        style={[
                            styles.checkbox, 
                            { 
                                borderColor: '#642C08',
                            }
                        ]}
                        onPress={toggleMusica}
                    >
                        {musicaHabilitada && (
                            <Text style={{ color: '#642C08', fontSize: 16, fontWeight: 'bold' }}>✓</Text>
                        )}
                    </Pressable>
                </View>

                {/* Configuração de Efeitos Sonoros */}
                <View style={[styles.row, { 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    paddingHorizontal: 10 
                }]}>
                    <Text style={[styles.text, { fontSize: 20, color: '#642C08' }]}>
                        Efeitos Sonoros
                    </Text>
                    <Pressable 
                        style={[
                            styles.checkbox, 
                            { 
                                borderColor: '#642C08',
                            }
                        ]}
                        onPress={toggleEfeitos}
                    >
                        {efeitosHabilitados && (
                            <Text style={{ color: '#642C08', fontSize: 16, fontWeight: 'bold' }}>✓</Text>
                        )}
                    </Pressable>
                </View>

                {/* Rodapé informativo */}
                <View style={{ marginTop: 30, alignItems: 'center' }}>
                    <Text style={[styles.text, { 
                        fontSize: 14, 
                        color: '#000', 
                        textAlign: 'center',
                        fontStyle: 'italic' 
                    }]}>
                        As configurações são salvas automaticamente
                    </Text>
                </View>
            </View>
        </View>
    );
};

// Hook para facilitar o uso das configurações de áudio
export const useConfiguracoesAudio = () => {
    const { musicaHabilitada, efeitosHabilitados } = useAudioContext();
    
    return {
        musicaHabilitada,
        efeitosHabilitados,
    };
};
