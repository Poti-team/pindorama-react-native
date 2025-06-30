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
        {/* Absolutes, design */}
        <View style={[styles.div, {alignItems: 'flex-start', gap: 10}]}>
            <Pressable
                style={[styles.row, {width: 'auto'}]} 
                onPress={() => irPara('/home')}>

                <Image source={require('@/assets/images/icons/inicio.png')} />
                <Text style={[styles.text, {marginLeft: 10, fontSize: 20, color: '#B89B7F'}]}>Início</Text>
            </Pressable>
            <Text style={[styles.title, {width: '100%'}]}>Mapa</Text>
        </View>

        {/* Conteúdo mesmo da página */}
        <ImageBackground style={[styles.div, {height: 370, width: 334}]}
                source={require('@/assets/images/mapa.png')}
                resizeMode="contain">

            <Pressable style={[{position: 'absolute', top: 21, right: 140}]}
                onPress={() => irPara('/tabs/categoria')}>
                <Image source={require('@/assets/images/bolinha.png')} />
            </Pressable>
            <Pressable style={[{position: 'absolute', top: 75, right: 47}]}
                onPress={() => irPara('/tabs/categoria')}>
                <Image source={require('@/assets/images/bolinha.png')} />
            </Pressable>
            <Pressable style={[{position: 'absolute', top: 211, right: 84}]}
                onPress={() => irPara('/tabs/categoria')}>
                <Image source={require('@/assets/images/bolinha.png')} />
            </Pressable>
            <Pressable style={[{position: 'absolute', top: 306, right: 122}]}
                onPress={() => irPara('/tabs/categoria')}>
                <Image source={require('@/assets/images/bolinha.png')} />
            </Pressable>
            <Pressable style={[{position: 'absolute', top: 151, right: 111}]}
                onPress={() => irPara('/tabs/categoria')}>
                <Image source={require('@/assets/images/bolinha.png')} />
            </Pressable>
            <Pressable style={[{position: 'absolute', top: 164, right: 238}]}
                onPress={() => irPara('/tabs/categoria')}>
                <Image source={require('@/assets/images/bolinha.png')} />
            </Pressable>
            <Pressable style={[{position: 'absolute', top: 112, right: 185}]}
                onPress={() => irPara('/tabs/categoria')}>
                <Image source={require('@/assets/images/bolinha.png')} />
            </Pressable>
            <Pressable style={[{position: 'absolute', top: 32, right: 222}]}
                onPress={() => irPara('/tabs/categoria')}>
                <Image source={require('@/assets/images/bolinha.png')} />
            </Pressable>
            <Pressable style={[{position: 'absolute', top: 147, right: 22}]}
                onPress={() => irPara('/tabs/categoria')}>
                <Image source={require('@/assets/images/bolinha.png')} />
            </Pressable>
        </ImageBackground>
    </View>
    )
}
