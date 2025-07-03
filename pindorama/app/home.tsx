import React, { use, useEffect, useState } from 'react';
import { View, Text,  Pressable, Image, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import 'react-native-url-polyfill/auto';

import { styles } from '@/styles/styles';

export default function Home() {
    const router = useRouter();
    const irPara = (rota: Parameters<typeof router.push>[0]) => {
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
            style={[styles.placa_home, { aspectRatio: 0.68, flex: 2, }]}
            imageStyle={{ resizeMode: 'contain' }}>
            <View style={{ flex: 1, width: '100%', justifyContent: 'flex-start', alignItems: 'center', gap: 20, paddingTop: 12 }}>
                <Pressable
                    style={[
                        styles.placa,
                        { alignItems: 'center', justifyContent: 'center', width: '80%' }
                    ]}
                    onPress={() => irPara('/tabs/mapa')}>
                    <ImageBackground
                        source={require('@/assets/images/placa_jogar.png')}
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
                    onPress={() => irPara('/tabs/perfil')}>
                    <ImageBackground
                        source={require('@/assets/images/placa_meu_avatar.png')}
                        style={{ width: '100%', aspectRatio: 4, justifyContent: 'center', alignItems: 'center' }}
                        imageStyle={{ resizeMode: 'contain' }}>
                        <Text style={[styles.text, {fontSize: 24, color: '#fff', transform: [{ rotate: '2deg' }]}]}>Meu Avatar</Text>
                    </ImageBackground>
                </Pressable>
                <Pressable
                    style={[
                        styles.placa,
                        { alignItems: 'center', justifyContent: 'center', width: '80%' }
                    ]}
                    onPress={() => irPara('/tabs/conquistas')}>
                    <ImageBackground
                        source={require('@/assets/images/placa_conquistas.png')}
                        style={{ width: '100%', aspectRatio: 4, justifyContent: 'center', alignItems: 'center' }}
                        imageStyle={{ resizeMode: 'contain' }}>
                        <Text style={[styles.text, {fontSize: 24, color: '#fff'}]}>Conquistas</Text>
                    </ImageBackground>
                </Pressable>
                <Pressable
                    style={[
                        styles.placa,
                        { alignItems: 'center', justifyContent: 'center', width: '80%' }
                    ]}
                    onPress={() => irPara('/tabs/creditos')}>
                    <ImageBackground
                        source={require('@/assets/images/placa_creditos.png')}
                        style={{ width: '100%', aspectRatio: 4, justifyContent: 'center', alignItems: 'center' }}
                        imageStyle={{ resizeMode: 'contain' }}>
                        <Text style={[styles.text, {fontSize: 24, color: '#fff', transform: [{ rotate: '-1deg' }]}]}>Créditos</Text>
                    </ImageBackground>
                </Pressable>
            </View>
        </ImageBackground>
    </View>
    )
}
