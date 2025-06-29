import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import 'react-native-url-polyfill/auto';

import { styles } from '@/styles/styles';

export default function Home() {
    const router = useRouter();
    const mapa = () => {
        router.push('/tabs/mapa');
    }
    useEffect(() => {
    }, []);

    return (<View style={styles.container}>
        <Text style={styles.title}>Pindorama</Text>
        <Text style={styles.text}>Bem-vindo ao Pindorama!</Text>
        <Pressable
            style={[styles.button, { backgroundColor: 'green' }]}
            onPress={() => mapa()}>
                <Text>Mapa</Text>
        </Pressable>
        </View>
    )
}
