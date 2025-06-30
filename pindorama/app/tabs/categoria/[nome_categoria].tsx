import { View, Text, Pressable, Image, ImageBackground } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '@/styles/styles';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

export default function CategoriaPage() {
  const { nome_categoria } = useLocalSearchParams();
  const [categoria, setCategoria] = useState<any | null>(null);

  const router = useRouter();

  useEffect(() => {
        const fetchCategoria = async () => {
            const data = await AsyncStorage.getItem('Categoria');
            let categoria = null;
            if (data) {
                const categorias = JSON.parse(data);
                categoria = categorias.find((cat: any) => cat.nome === nome_categoria);
            }
            setCategoria(categoria);
        };
        fetchCategoria();
    }, [nome_categoria]);

  return (
    <View style={styles.conteudo}>
            {/* Absolutes, design */}
            <View style={[styles.div, {alignItems: 'flex-start', gap: 10}]}>
                <Pressable
                    style={[styles.row, {width: 'auto', alignItems: 'baseline'}]} 
                    onPress={() => router.back()}>
    
                    <Image source={require('@/assets/images/icons/setinha.png')} />
                    <Text style={[styles.text, {marginLeft: 10, fontSize: 20, color: '#B89B7F'}]}>Voltar</Text>
                </Pressable>
                <Text style={[styles.title, {width: '100%'}]}>{nome_categoria}</Text>
            </View>
    
            {/* Conteúdo mesmo da página */}
            <ImageBackground style={[styles.div, {height: 370, width: 334}]}
                    source={require('@/assets/images/mapa.png')}
                    resizeMode="contain">
    
            </ImageBackground>
        </View>
  );
}
