import React, { use, useEffect, useState } from 'react';
import { View, Text,  Pressable, Image, ImageBackground } from 'react-native';
import 'react-native-url-polyfill/auto';
import { useRouter, usePathname } from 'expo-router';

import { styles } from '@/styles/styles';
import { PopUpCategoria } from '@/components/pop_up_categoria';
import { ConfigPopup } from '@/components/config';
import { useEfeitoSonoro } from '@/components/efeitosonoro';

export default function Mapa() {
    const [popUpCategoriaId, setPopUpCategoriaId] = useState<number | null>(null);
    const [mostrarConfig, setMostrarConfig] = useState(false);
    const { tocarEfeito } = useEfeitoSonoro();

    const router = useRouter();
    const pathname = usePathname();

    const irPara = (rota: Parameters<typeof router.push>[0]) => {
        if (rota !== pathname) {
            tocarEfeito('clique');
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
                onPress={() => {
                    tocarEfeito('clique');
                    setPopUpCategoriaId(1);
                }}>
                <Image source={require('@/assets/images/bolinha.png')} />
            </Pressable>
            <Pressable style={[{position: 'absolute', top: 75, right: 47}]}
                onPress={() => {
                    tocarEfeito('clique');
                    setPopUpCategoriaId(2);
                }}>
                <Image source={require('@/assets/images/bolinha.png')} />
            </Pressable>
            <Pressable style={[{position: 'absolute', top: 211, right: 84}]}
                onPress={() => {
                    tocarEfeito('clique');
                    setPopUpCategoriaId(3);
                }}>
                <Image source={require('@/assets/images/bolinha.png')} />
            </Pressable>
            <Pressable style={[{position: 'absolute', top: 306, right: 122}]}
                onPress={() => {
                    tocarEfeito('clique');
                    setPopUpCategoriaId(4);
                }}>
                <Image source={require('@/assets/images/bolinha.png')} />
            </Pressable>
            <Pressable style={[{position: 'absolute', top: 151, right: 111}]}
                onPress={() => {
                    tocarEfeito('clique');
                    setPopUpCategoriaId(5);
                }}>
                <Image source={require('@/assets/images/bolinha.png')} />
            </Pressable>
            <Pressable style={[{position: 'absolute', top: 164, right: 238}]}
                onPress={() => {
                    tocarEfeito('clique');
                    setPopUpCategoriaId(6);
                }}>
                <Image source={require('@/assets/images/bolinha.png')} />
            </Pressable>
            <Pressable style={[{position: 'absolute', top: 112, right: 185}]}
                onPress={() => {
                    tocarEfeito('clique');
                    setPopUpCategoriaId(7);
                }}>
                <Image source={require('@/assets/images/bolinha.png')} />
            </Pressable>
            <Pressable style={[{position: 'absolute', top: 32, right: 222}]}
                onPress={() => {
                    tocarEfeito('clique');
                    setPopUpCategoriaId(8);
                }}>
                <Image source={require('@/assets/images/bolinha.png')} />
            </Pressable>
            <Pressable style={[{position: 'absolute', top: 147, right: 22}]}
                onPress={() => {
                    tocarEfeito('clique');
                    setPopUpCategoriaId(9);
                }}>
                <Image source={require('@/assets/images/bolinha.png')} />
            </Pressable>
        </ImageBackground>

        {/* Botão de Configurações - Canto Superior Direito */}
        <Pressable 
            style={{
                position: 'absolute',
                top: 100, // Abaixo do header
                right: 40, // Respeitando a margem lateral
                width: 40,
                height: 40,
                backgroundColor: '#956046',
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 2,
                borderColor: '#642C08',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 5,
                zIndex: 10, // Para ficar acima do mapa
            }}
            onPress={() => {
                tocarEfeito('clique');
                setMostrarConfig(true);
            }}
        >
            <Text style={{ fontSize: 18, color: '#FFF' }}>⚙️</Text>
        </Pressable>

        {/* Popups */}
        {popUpCategoriaId !== null && (
            <PopUpCategoria
                id_categoria={popUpCategoriaId}
                onClose={() => setPopUpCategoriaId(null)}
            />
        )}
        
        {mostrarConfig && (
            <ConfigPopup onClose={() => setMostrarConfig(false)} />
        )}
    </View>
    )
}
