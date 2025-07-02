import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, Pressable, ImageBackground } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '@/styles/styles';

interface Conquista {
  id: number;
  nome: string;
  descricao: string;
  tipo: 'categoria' | 'fase' | 'item' | 'acerto';
  id_categoria?: number;
  meta_numerica?: number;
}

interface UsuarioConquista {
  id_conquista: number;
}

export default function ConquistasPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [conquistas, setConquistas] = useState<Conquista[]>([]);
  const [conquistasDict, setConquistasDict] = useState<{ [key: string]: Conquista[] }>({});
  const [conquistasConcluidas, setConquistasConcluidas] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const irPara = (rota: Parameters<typeof router.push>[0]) => {
    if (rota !== pathname) {
      router.push(rota);
    }
  };

  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      try {
        // Carrega conquistas
        const conquistasData = await AsyncStorage.getItem('Conquista');
        // Carrega conquistas do usuário
        const usuarioConquistasData = await AsyncStorage.getItem('UsuarioConquista');
        
        if (conquistasData) {
          const conquistas = JSON.parse(conquistasData);
          setConquistas(conquistas);
          
          // Agrupa conquistas por tipo
          const grouped: { [key: string]: Conquista[] } = {};
          conquistas.forEach((conquista: Conquista) => {
            if (!grouped[conquista.tipo]) {
              grouped[conquista.tipo] = [];
            }
            grouped[conquista.tipo].push(conquista);
          });
          setConquistasDict(grouped);
        }

        if (usuarioConquistasData) {
          const usuarioConquistas: UsuarioConquista[] = JSON.parse(usuarioConquistasData);
          const idsConcluidas = usuarioConquistas.map(uc => uc.id_conquista);
          setConquistasConcluidas(idsConcluidas);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  const tipoLabels = {
    categoria: 'Categorias',
    fase: 'Fases',
    item: 'Itens',
    acerto: 'Acertos'
  };

  const getConquistaAssets = (conquista: Conquista, concluida: boolean) => {
    if (!concluida) {
      return {
        fundo: require('@/assets/images/conquista_secreta.png'),
        icone: require('@/assets/images/icons/segredo.png')
      };
    }

    const fundos = {
      categoria: require('@/assets/images/conquista_categoria.png'),
      fase: require('@/assets/images/conquista_fase.png'),
      item: require('@/assets/images/conquista_item.png'),
      acerto: require('@/assets/images/conquista_acerto.png')
    };

    const icones = {
      categoria: require('@/assets/images/icons/bandeira.png'),
      fase: require('@/assets/images/icons/fases_grupo.png'),
      item: require('@/assets/images/icons/cabide.png'),
      acerto: require('@/assets/images/icons/cerebro.png')
    };

    return {
      fundo: fundos[conquista.tipo],
      icone: icones[conquista.tipo]
    };
  };

  if (loading) {
    return (
      <View style={styles.conteudo}>
        <Text style={styles.text}>Carregando conquistas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.conteudo}>
      <View style={[styles.header]}>
        <Pressable
          style={[styles.row, { width: 'auto' }]}
          onPress={() => irPara('/home')}>
          <Image source={require('@/assets/images/icons/inicio.png')} />
          <Text style={[styles.text, { marginLeft: 10, fontSize: 20, color: '#B89B7F' }]}>Início</Text>
        </Pressable>
        <Text style={[styles.title, { width: '100%' }]}>Conquistas</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        {conquistas.map((conquista) => {
          const concluida = conquistasConcluidas.includes(conquista.id);
          const assets = getConquistaAssets(conquista, concluida);

          return (
            <ImageBackground
              key={conquista.id}
              source={assets.fundo}
              style={[styles.div, { marginBottom: 16, aspectRatio: 4.2 }]}
              resizeMode="contain"
            >
                <View style={[styles.row, { padding: 16, gap: 16, flex: 1 }]}>
                    <Image
                        source={assets.icone}
                        style={{ height: '100%', flex: 2}}
                        resizeMode="contain"
                    />
                    <View style={{ flex: 7 }}>
                        <Text style={[styles.text, { fontSize: 18, marginBottom: 4 }]}>
                            {concluida ? conquista.nome : ''}
                        </Text> 
                        <Text style={[styles.text, { fontSize: 12 }]}>
                            {concluida ? conquista.descricao : ''}
                        </Text>
                    </View>
                </View>
            </ImageBackground>
          );
        })}
        
        {conquistas.length === 0 && (
          <View style={[styles.div, { alignItems: 'center', marginTop: 50 }]}>
            <Text style={[styles.text, { fontSize: 18, textAlign: 'center' }]}>
              Nenhuma conquista encontrada
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}