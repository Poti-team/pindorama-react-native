import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, Pressable, Animated, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '@/styles/styles';

const { router } = require('expo-router');

export default function Carrossel({ id_categoria }: { id_categoria: number }) {
  const [fases, setFases] = useState<any[]>([]);
  const [fasesDict, setFasesDict] = useState<{ [key: number]: { id: number; nome: string; status: string } }>({});
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Carrega as fases ao abrir ou mudar categoria
  useEffect(() => {
    const fetchFases = async () => {
      const data = await AsyncStorage.getItem('Fase');
      let fases = [];
      if (data) {
        const fasesData = JSON.parse(data);
        fases = fasesData.filter((fase: any) => fase.id_categoria === id_categoria);
      }
      setFases(fases);
    };
    fetchFases();
  }, [id_categoria]);

  // Monta o dict e checa concluídas/libera próxima
  useEffect(() => {
    setLoading(true);
    const montarDict = async () => {
      const data = await AsyncStorage.getItem('UsuarioFase');
      let fasesConcluidas: any[] = [];
      if (data) {
        fasesConcluidas = JSON.parse(data);
      }
      if (fases && fases.length > 0) {
        const dict: { [key: number]: { id: number; nome: string; status: string } } = {};
        fases.forEach((fase: any) => {
          dict[fase.id] = {
            id: fase.id,
            nome: fase.nome,
            status: 'trancada',
          };
        });
        // Marca concluídas
        fases.forEach((fase: any) => {
          const faseConcluida = fasesConcluidas.find((usuarioFase: any) => usuarioFase.id_fase === fase.id);
          if (faseConcluida) {
            dict[fase.id].status = 'concluida';
          }
        });
        // Libera a primeira trancada
        const disponivel = Object.values(dict).find((fase: any) => fase.status === 'disponivel');
        if (!disponivel) {
          const primeiraTrancada = fases.find((fase: any, idx: number) => dict[fase.id].status === 'trancada');
          if (primeiraTrancada) {
            dict[primeiraTrancada.id].status = 'disponivel';
            const idx = fases.findIndex(f => f.id === primeiraTrancada.id);
            setIndex(idx);
          }
        }
        setFasesDict(dict);
        setLoading(false);
      }
    };
    montarDict();
  }, [fases]);

  // Imagens
  const faseImages: { [key: string]: any } = {
    trancada: require('@/assets/images/fase_trancada.png'),
    disponivel: require('@/assets/images/fase_disponivel.png'),
    concluida: require('@/assets/images/fase_concluida.png'),
  };

  // Navegação do carrossel
  const handlePrev = () => setIndex((i) => Math.max(i - 1, 0));
  const handleNext = () => setIndex((i) => Math.min(i + 1, fases.length - 1));

// Mostra até 4 fases a partir do index atual (inclusive), sem mostrar anteriores
const maxFases = 5;
const [fasesParaMostrar, setFasesParaMostrar] = useState<any[]>([]);

useEffect(() => {
    const novasFases = fases
    .map((fase, i) => ({
        ...fase,
        ordem: i,
    })).slice(index, index + maxFases);
    setFasesParaMostrar(novasFases);
}, [fases, index]);

const animatedIndex = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(animatedIndex, {
      toValue: index,
      useNativeDriver: true,
      friction: 10,
    }).start();
  }, [index]);

  if (loading) {
      return null
    }

  return (
    <View style={[styles.div, { height: '100%', alignItems: 'center', justifyContent: 'center', gap: 20, paddingBottom: 20}]}>
      <View style={{ flexDirection: 'column-reverse', alignItems: 'center', width: '100%', height: '70%', justifyContent: 'flex-start', overflow: 'hidden', marginTop: 0 }}>
        {fases.map((fase, faseIndex) => {
  const pos = Animated.subtract(faseIndex, animatedIndex);

  // Ajuste para escala: anteriores levemente maiores, foco = 1, próximas menores
  const animatedScale = pos.interpolate({
    inputRange: [-4, -3, -2, -1, 0, 1, 2, 3, 4],
    outputRange: [1.4, 1.3, 1.2, 1.1, 1, 0.8, 0.6, 0.4, 0.3],
    extrapolate: 'clamp',
  });

  // Ajuste para translateY: foco sempre em 0 (base), próximas sobem, anteriores descem
  const animatedTranslateY = pos.interpolate({
    inputRange: [-4, -3, -2, -1, 0, 1, 2, 3, 4],
    outputRange: [1200, 900, 600, 300, -10, -130, -300, -600, -960],
    extrapolate: 'clamp',
  });

  const status = fasesDict[fase.id]?.status || 'trancada';
  const podeFocar = faseIndex !== index;

  return (
    <Animated.View
      key={fase.id}
      style={{
        alignItems: 'center',
        position: 'absolute',
        transform: [
          { scale: animatedScale },
          { translateY: animatedTranslateY },
        ],
        opacity: 1 - 0.18 * Math.abs(faseIndex - index),
        marginVertical: 0,
      }}
    >
      <Pressable
        disabled={!podeFocar}
        onPress={() => setIndex(faseIndex)}
      >
        <Image
          source={faseImages[status]}
          style={{ width: 120, height: 80, marginVertical: 4 }}
          resizeMode="contain"
        />
      </Pressable>
    </Animated.View>
  );
})}
        <Image source={require('@/assets/images/nevoa.png')} style={[styles.absolute, {zIndex: 100000, bottom: 0, width: '50%', height: undefined, aspectRatio: 4}]}/>
        <Image source={require('@/assets/images/horizonte.png')} style={[styles.absolute, {zIndex: 100000, top: 0, width: '20%', height: undefined, aspectRatio: 1}]}/>
      </View>
      <View style={[styles.div, {paddingBottom: 16}]}>
            <Text
              style={[
              styles.text,
              {
                fontSize: 24,
                minHeight: 60,
                textAlign: 'center',
                textAlignVertical: 'center',
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
              },
              ]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {fases[index]?.nome || 'Carregando...'}
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: 10, gap: 16 }}>
                <Pressable style={{ padding: 8 }} onPress={handlePrev} disabled={index === 0}>
                    <Image source={require('@/assets/images/seta_carrossel.png')} style={{ transform: [{ rotate: '180deg' }], opacity: index === 0 ? 0.3 : 1 }} />
                </Pressable>
                <Pressable
                  style={[styles.button, { opacity: !fases[index] || fasesDict[fases[index].id]?.status === 'trancada' ? 0.6 : 1 }]}
                  onPress={() => {
                    if (fases[index] && fasesDict[fases[index].id]?.status !== 'trancada') {
                      router.push(`/tabs/categoria/fase/${fases[index].id}`);
                    }
                  }}
                  disabled={
                    !fases[index] ||
                    fasesDict[fases[index].id]?.status === 'trancada'
                  }
                >
                    <Text style={[styles.text, {fontSize: 20}]}>{'Jogar'}</Text>
                </Pressable>
                <Pressable style={{ padding: 8 }} onPress={handleNext} disabled={index === fases.length - 1}>
                    <Image source={require('@/assets/images/seta_carrossel.png')} style={{ opacity: index === fases.length - 1 ? 0.3 : 1 }} />
                </Pressable>
            </View>
      </View>
    </View>
  );
}