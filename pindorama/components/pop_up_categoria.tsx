import React, { useEffect } from 'react';
import { View, Text, Pressable, Image, ImageBackground } from 'react-native';
import { styles } from '@/styles/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, usePathname } from 'expo-router';

interface PopUpCategoriaProps {
    id_categoria: number;
    onClose: () => void;
}

export const PopUpCategoria: React.FC<PopUpCategoriaProps> = ({ id_categoria, onClose }) => {
    const [categoriaData, setCategoriaData] = React.useState<any>(null);
    const [fasesConcluidas, setFasesConcluidas] = React.useState<number>(0);
    const [fasesTotais, setFasesTotais] = React.useState<number>(0);

    const router = useRouter();
        const pathname = usePathname();
      
          const irParaCategoria = (nome_categoria: string) => {
                  router.push(`/tabs/categoria/${nome_categoria}` as any);
          }

    useEffect(() => {
        const fetchCategoria = async () => {
            const data = await AsyncStorage.getItem('Categoria');
            let categoria = null;
            if (data) {
                const categorias = JSON.parse(data);
                categoria = categorias.find((cat: any) => cat.id === id_categoria);
            }
            setCategoriaData(categoria);
        };
        fetchCategoria();
    }, [id_categoria]);

    useEffect(() => {
        const fetchFases = async () => {
    try {
      const data = await AsyncStorage.getItem('Fase');
      const dataUser = await AsyncStorage.getItem('UsuarioFase');
      const fases = JSON.parse(data || '[]');
      if (!Array.isArray(fases)) {
        console.error('Fases inválidas');
        return;
      }
      const total = fases.filter((fase: any) => fase.id_categoria === id_categoria).length;
      setFasesTotais(total);
      if (dataUser) {
        const usuarioFases = JSON.parse(dataUser || '[]');
        const faseMap = new Map(fases.map((f: any) => [f.id, f]));
        const concluidas = usuarioFases.filter((usuarioFase: any) => {
          const fase = faseMap.get(usuarioFase.id_fase);
          return fase && fase.id_categoria === id_categoria;
        }).length;
        setFasesConcluidas(concluidas);
      }
    } catch (error) {
      console.error('Erro ao buscar fases:', error);
    }
  };
        fetchFases();
    }, [id_categoria]);

    return (
        <View style={styles.popUpContainer}>
            <ImageBackground style={[styles.popUpDisplay]} resizeMode='contain'>
                <View style={[styles.row]}>
                    <Text style={[styles.title, {fontSize: 32, color: '#421D05', width: '80%'}]}>{categoriaData ? categoriaData.nome : 'Carregando...'}</Text>
                    <Pressable style={[styles.absolute, {top: 10, right: 0}]} onPress={onClose}>
                        <Image source={require('@/assets/images/icons/close.png')}></Image>
                    </Pressable>
                </View>
                <View style={[styles.row, {justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 20}]}>
                    <Text style={[styles.text, {fontSize: 20, color: '#421d05'}]}>{fasesConcluidas}/{fasesTotais}</Text>
                    <Pressable onPress={() => irParaCategoria(categoriaData.nome)}>
                        <Image source={require('@/assets/images/icons/entrar.png')}></Image>
                    </Pressable>
                </View>
            </ImageBackground>
        </View>
    );
};
