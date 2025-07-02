import React, { use, useEffect, useState } from 'react';
import { View, Text,  Pressable, Image, ImageBackground } from 'react-native';
import 'react-native-url-polyfill/auto';
import { useRouter, usePathname } from 'expo-router';

import { styles } from '@/styles/styles';
import { PopUpCategoria } from '@/components/pop_up_categoria';

export default function Mapa() {
    const [popUpCategoriaId, setPopUpCategoriaId] = useState<number | null>(null);

    const router = useRouter();
    const pathname = usePathname();

    const irPara = (rota: Parameters<typeof router.push>[0]) => {
        if (rota !== pathname) {
            router.push(rota);
        }
    }

    return (
    <View style={styles.conteudo}>
        <View style={[styles.header]}>
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
                onPress={() => setPopUpCategoriaId(1)}>
                <Image source={require('@/assets/images/bolinha.png')} />
            </Pressable>
            <Pressable style={[{position: 'absolute', top: 75, right: 47}]}
                onPress={() => setPopUpCategoriaId(2)}>
                <Image source={require('@/assets/images/bolinha.png')} />
            </Pressable>
            <Pressable style={[{position: 'absolute', top: 211, right: 84}]}
                onPress={() => setPopUpCategoriaId(3)}>
                <Image source={require('@/assets/images/bolinha.png')} />
            </Pressable>
            <Pressable style={[{position: 'absolute', top: 306, right: 122}]}
                onPress={() => setPopUpCategoriaId(4)}>
                <Image source={require('@/assets/images/bolinha.png')} />
            </Pressable>
            <Pressable style={[{position: 'absolute', top: 151, right: 111}]}
                onPress={() => setPopUpCategoriaId(5)}>
                <Image source={require('@/assets/images/bolinha.png')} />
            </Pressable>
            <Pressable style={[{position: 'absolute', top: 164, right: 238}]}
                onPress={() => setPopUpCategoriaId(6)}>
                <Image source={require('@/assets/images/bolinha.png')} />
            </Pressable>
            <Pressable style={[{position: 'absolute', top: 112, right: 185}]}
                onPress={() => setPopUpCategoriaId(7)}>
                <Image source={require('@/assets/images/bolinha.png')} />
            </Pressable>
            <Pressable style={[{position: 'absolute', top: 32, right: 222}]}
                onPress={() => setPopUpCategoriaId(8)}>
                <Image source={require('@/assets/images/bolinha.png')} />
            </Pressable>
            <Pressable style={[{position: 'absolute', top: 147, right: 22}]}
                onPress={() => setPopUpCategoriaId(9)}>
                <Image source={require('@/assets/images/bolinha.png')} />
            </Pressable>
        </ImageBackground>

        {popUpCategoriaId !== null && (
            <PopUpCategoria
                id_categoria={popUpCategoriaId}
                onClose={() => setPopUpCategoriaId(null)}
            />
        )}
    </View>
    )
}
