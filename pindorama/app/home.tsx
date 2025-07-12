import React, { use, useEffect, useState } from 'react';
import { View, Text,  Pressable, Image, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { styles } from '@/styles/styles';
import { supabase } from '@/services/supabase';
import { ConfigPopup } from '@/components/config';
import { useEfeitoSonoro } from '@/components/efeitosonoro';

export default function Home() {
    const [mostrarConfig, setMostrarConfig] = useState(false);
    const { tocarEfeito } = useEfeitoSonoro();
    const router = useRouter();
    
    const irPara = (rota: Parameters<typeof router.push>[0]) => {
        tocarEfeito('clique');
        router.push(rota);
    };

    return (
    <View style={[styles.conteudo, { justifyContent: 'flex-end' }]}>
        <View style={{ width: '100%', flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
            <Image
                source={require('@/assets/images/pindorama.png')}
                style={{ aspectRatio: 2, maxWidth: '100%' }}
                resizeMode="contain"
            />
        </View>
        <ImageBackground 
            source={require('@/assets/images/placa_suporte.png')}
            style={[styles.placa_home, { aspectRatio: 0.68, flex: 2, marginTop: -30 }]}
            imageStyle={{ resizeMode: 'contain' }}>
            <View style={{ flex: 1, width: '100%', justifyContent: 'flex-start', alignItems: 'center', gap: 20, paddingTop: 12 }}>
                <Pressable
                    style={[
                        styles.placa,
                        { alignItems: 'center', justifyContent: 'center', width: '80%' }
                    ]}
                    onPress={() => irPara('/tabs/mapa')}>
                    <ImageBackground
                        source={require('@/assets/images/placa_amarela.png')}
                        style={{ width: '100%', aspectRatio: 4, justifyContent: 'center', alignItems: 'center' }}
                        imageStyle={{ resizeMode: 'contain' }}>
                        <Text style={[styles.text, {fontSize: 24, transform: [{ rotate: '-2deg' }]}]}>Jogar</Text>
                    </ImageBackground>
                </Pressable>
                <Pressable
                    style={[
                        styles.placa,
                        { alignItems: 'center', justifyContent: 'center', width: '80%' }
                    ]}
                    onPress={() => irPara('/tabs/conquistas')}>
                    <ImageBackground
                        source={require('@/assets/images/placa_azul.png')}
                        style={{ width: '100%', aspectRatio: 4, justifyContent: 'center', alignItems: 'center' }}
                        imageStyle={{ resizeMode: 'contain' }}>
                        <Text style={[styles.text, {fontSize: 24, color: '#fff', transform: [{ rotate: '2deg' }]}]}>Conquistas</Text>
                    </ImageBackground>
                </Pressable>
                <Pressable
                    style={[
                        styles.placa,
                        { alignItems: 'center', justifyContent: 'center', width: '80%' }
                    ]}
                    onPress={() => irPara('/tabs/creditos')}>
                    <ImageBackground
                        source={require('@/assets/images/placa_verde.png')}
                        style={{ width: '100%', aspectRatio: 4, justifyContent: 'center', alignItems: 'center' }}
                        imageStyle={{ resizeMode: 'contain' }}>
                        <Text style={[styles.text, {fontSize: 24, color: '#fff'}]}>Créditos</Text>
                    </ImageBackground>
                </Pressable>
                <Pressable
                    style={[
                        styles.placa,
                        { alignItems: 'center', justifyContent: 'center', width: '80%' }
                    ]}
                    onPress={async () => {
                        tocarEfeito('clique');
                        
                        // Desloga do Supabase
                        await supabase.auth.signOut();
                        
                        // Limpa dados do usuário logado do AsyncStorage
                        await AsyncStorage.multiRemove([
                            'Usuario',
                            'UsuarioFase', 
                            'UsuarioItem',
                            'UsuarioConquista'
                        ]);
                        
                        // Navega para a tela de login
                        irPara('/');
                    }}>
                    <ImageBackground
                        source={require('@/assets/images/placa_vermelha.png')}
                        style={{ width: '100%', aspectRatio: 4, justifyContent: 'center', alignItems: 'center' }}
                        imageStyle={{ resizeMode: 'contain' }}>
                        <Text style={[styles.text, {fontSize: 24, color: '#fff', transform: [{ rotate: '-1deg' }]}]}>Sair</Text>
                    </ImageBackground>
                </Pressable>
            </View>
        </ImageBackground>
        
        {/* Botão de Configurações - Canto Superior Direito */}
        <Pressable 
            style={{
                position: 'absolute',
                top: 60,
                right: 40,
            }}
            onPress={() => {
                tocarEfeito('clique');
                setMostrarConfig(true);
            }}
        >
            <Image 
                source={require('@/assets/images/icons/config.png')} 
                style={{ width: 40, height: 40 }}
                resizeMode="contain"
            />
        </Pressable>

        {/* Popup de Configurações */}
        {mostrarConfig && (
            <ConfigPopup onClose={() => setMostrarConfig(false)} />
        )}
    </View>
    )
}
