import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Image, ImageBackground, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '@/styles/styles';

export default function FasePage() {
  const { id_fase } = useLocalSearchParams();
  const [fase, setFase] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [paginas, setPaginas] = useState<any[]>([]);
  const [paginasDict, setPaginasDict] = useState<{ [key: number]: { texto: string; imagem: string } }>({});
  const [ordem, setOrdem] = useState(1);
  
  useEffect(() => {
    const fetchFase = async () => {
      setLoading(true);
      const data = await AsyncStorage.getItem('Fase');
      if (data) {
        const fases = JSON.parse(data);
        const found = fases.find((f: any) => String(f.id) == String(id_fase));
        setFase(found);
      }
      setLoading(false);
    };
    fetchFase();
  }, [id_fase]);

  useEffect(() => {
      // Cria o dicionário de páginas quando 'paginas' muda
      const dict: { [key: number]: { texto: string; imagem: string } } = {};
      paginas.forEach((pagina: any) => {
          dict[pagina.ordem] = {
              texto: pagina.texto,
              imagem: pagina.imagem,
          };
      });
      setPaginasDict(dict);
  }, [paginas]);

  useEffect(() => {
    const fetchPagina = async () => {
      setLoading(true);
      const data = await AsyncStorage.getItem('Pagina');
      if (data) {
        const paginas = JSON.parse(data);
        const paginasFase = paginas
          .filter((p: any) => String(p.id_fase) === String(id_fase))
          .sort((a: any, b: any) => a.ordem - b.ordem);
        setPaginas(paginasFase);
      }
      setLoading(false);
    };
    fetchPagina();
  }, [fase]);



  if (loading) {
    return (
      <View style={styles.conteudo}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.text}>Carregando fase...</Text>
      </View>
    );
  }

  if (!fase) {
    return (
      <View style={styles.conteudo}>
        <Text style={styles.title}>Fase não encontrada</Text>
      </View>
    );
  }

  return (
    <View style={[styles.conteudo, { justifyContent: 'space-between', paddingBottom: 40 }]}>
        <View style={[styles.header]}>
            <Pressable style={[styles.row, { width: 'auto' }]} onPress={() => router.back()}>
                <Image source={require('@/assets/images/icons/setinha.png')} />
                <Text style={[styles.text, { marginLeft: 10, fontSize: 20, color: '#B89B7F' }]}>Voltar</Text>
            </Pressable>
            <Text style={[styles.title, {width: '100%', fontSize: 32}]}>{fase.nome}</Text>
        </View>
        <View style={[styles.div, {flex:1, justifyContent: 'flex-start', gap: 20}]}>
            <Text style={[styles.text, styles.abz, {fontSize: 15}]}>
                {paginasDict[ordem]?.texto}
            </Text>
            {paginasDict[ordem]?.imagem ? (
                <ImageBackground
                    source={require('@/assets/images/quadro.png')}
                    style={{ width: 332, height: 166, justifyContent: 'center', alignItems: 'center'}}
                    resizeMode="cover"
                >
                    <Image 
                        source={{ uri: paginasDict[ordem]?.imagem }}
                        style={{ marginTop: 3, marginRight: 3, width: 312, height: 146, resizeMode: 'contain'}}
                    />
                </ImageBackground>
            ) : null}
        </View>
        <View style={[styles.div, {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}]}>
            <Pressable 
                style={[styles.button, { width: 80, paddingHorizontal: 0, paddingVertical: 4, opacity: ordem <= 1 ? 0 : 1 }]} disabled={ordem <= 1}
                onPress={() => {if (ordem > 1) { setOrdem(ordem - 1) }}}>
                <Text style={[styles.text]}>Anterior</Text>
            </Pressable>
            <Text style={[styles.text]}>{`Página ${ordem} de ${Object.keys(paginasDict).length}`}</Text>
            <Pressable 
                style={[styles.button, { width: 80, paddingVertical: 4, paddingHorizontal: 0 }]}
                onPress={() => {if (ordem < Object.keys(paginasDict).length) {setOrdem(ordem + 1) }
                else {
                    // Navegar para o quiz
                    router.push(`/tabs/categoria/fase/quiz/${fase.id}` as any);
                }
                }}>
                <Text style={[styles.text]}>{ordem < Object.keys(paginasDict).length ? `Próximo` : 'Quiz'}</Text>
            </Pressable>
        </View>
    </View>
  );
}