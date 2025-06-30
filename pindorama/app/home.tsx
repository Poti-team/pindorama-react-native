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
    <View style={styles.conteudo}>
        <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center', width: '100%', paddingTop: 40 }}>
            <Image
                source={require('@/assets/images/pindorama.png')}
                style={{ width: '100%', resizeMode: 'contain' }}
            />
        </View>
        <ImageBackground 
            source={require('@/assets/images/placa_suporte.png')}
            style={[styles.placa_home]}
            imageStyle={{ resizeMode: 'contain' }}>
            <Pressable
                style={[styles.placa]}
                onPress={() => irPara('/tabs/mapa')}>
                <Image source={require('@/assets/images/placa_jogar.png')}
                style={{height: 80, resizeMode: 'contain' }}
                ></Image>
            </Pressable>
            <Pressable
                style={[styles.placa,]}
                onPress={() => irPara('/tabs/perfil')}>
                <Image source={require('@/assets/images/placa_meu_avatar.png')}
                style={{height: 80, resizeMode: 'contain' }}
                ></Image>
            </Pressable>
            <Pressable
                style={[styles.placa,]}
                onPress={() => irPara('/tabs/conquistas')}>
                <Image source={require('@/assets/images/placa_conquistas.png')}
                style={{height: 80, resizeMode: 'contain' }}
                ></Image>
            </Pressable>
            <Pressable
                style={[styles.placa,]}
                onPress={() => irPara('/creditos')}>
                <Image source={require('@/assets/images/placa_creditos.png')}
                style={{height: 80, resizeMode: 'contain' }}
                ></Image>
            </Pressable>
        </ImageBackground>
    </View>
    )
}
