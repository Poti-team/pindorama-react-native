import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Image, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '@/styles/styles';
import { supabase } from '@/services/supabase';

export default function QuizFasePage() {
  const { id_fase: id_fase_param } = useLocalSearchParams();
  const id_fase = parseInt(id_fase_param as string, 10);
  const [perguntas, setPerguntas] = useState<any[]>([]);
  const [perguntasDict, setPerguntasDict] = useState<{ [key: number]: any }>({});
  const [ordem, setOrdem] = useState(1);
  const [loading, setLoading] = useState(true);
  const [alternativaSelecionada, setAlternativaSelecionada] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPerguntas = async () => {
      setLoading(true);
      const data = await AsyncStorage.getItem('Pergunta');
      if (data) {
        const todasPerguntas = JSON.parse(data);
        const perguntasFase = todasPerguntas
          .filter((p: any) => String(p.id_fase) === String(id_fase))
          .sort((a: any, b: any) => a.ordem - b.ordem);
        setPerguntas(perguntasFase);
      }
      setLoading(false);
    };
    fetchPerguntas();
  }, [id_fase]);

  useEffect(() => {
    // Cria o dicionário de perguntas por ordem
    const dict: { [key: number]: any } = {};
    perguntas.forEach((pergunta: any) => {
      dict[pergunta.ordem] = pergunta;
    });
    setPerguntasDict(dict);
  }, [perguntas]);

  // Limpa seleção ao trocar de pergunta
  useEffect(() => {
    setAlternativaSelecionada(null);
  }, [ordem]);

  if (loading) {
    return (
      <View style={styles.conteudo}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.text}>Carregando quiz...</Text>
      </View>
    );
  }

  if (!perguntas.length) {
    return (
      <View style={styles.conteudo}>
        <Text style={styles.title}>Quiz não encontrado</Text>
      </View>
    );
  }

  const total = Object.keys(perguntasDict).length;

  return (
    <View style={[styles.conteudo, {paddingBottom: 40, justifyContent: 'space-between'}]}>
      <View style={styles.header}>
        <Pressable style={[styles.row, { width: 'auto' }]} onPress={() => router.back()}>
          <Image source={require('@/assets/images/icons/setinha.png')} />
          <Text style={[styles.text, { marginLeft: 10, fontSize: 20, color: '#B89B7F' }]}>Voltar</Text>
        </Pressable>
        <Text style={[styles.title, { fontSize: 32 }]}>{`Pergunta ${ordem}`}</Text>
      </View>
      <View style={[styles.div, { flex: 1, justifyContent: 'space-between', gap: 20 }]}>
        <Text style={[styles.text, styles.abz, {fontSize: 20}]}>{`${perguntasDict[ordem]?.enunciado}`}</Text>
        <View style={[styles.div, {gap: 16}]}>
          {perguntasDict[ordem]?.alternativas?.map((alt: any, index: number) => {
            // index + 1 pois a resposta certa geralmente é 1-based
            let icone = null;
            if (alternativaSelecionada !== null) {
              if (index + 1 === perguntasDict[ordem]?.correta && alternativaSelecionada === index + 1) {
                icone = require('@/assets/images/icons/certo.png');
              } else if (index + 1 === alternativaSelecionada) {
                icone = require('@/assets/images/icons/errado.png');
              }
            }
            return (
              <Pressable
                key={index + 1}
                style={[
                  styles.button,
                  styles.row,
                  { paddingVertical: 8, paddingHorizontal: 12, gap: 8, width: '100%', justifyContent: 'space-between', opacity: alternativaSelecionada !== null && alternativaSelecionada !== index + 1 ? 0.6 : 1 }
                ]}
                disabled={alternativaSelecionada !== null}
                onPress={() => setAlternativaSelecionada(index + 1)}
              >
                <Text style={[styles.text, styles.abz, {fontSize: 13, fontWeight: 'bold', flex: 9, textAlign: 'left'}]}>{alt}</Text>
                {icone ? (
                  <Image source={icone} style={{ width: 30, aspectRatio: 3/2 }} resizeMode='contain' />
                ) : (
                  <View style={{ width: 30, aspectRatio: 3/2 }} />
                )}
              </Pressable>
            );
          })}
        </View>
      </View>
      <View style={[styles.div, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
        <Text style={[styles.text]}>{`Pergunta ${ordem} de ${total}`}</Text>
        <Pressable
          style={[styles.button, { width: 80, paddingVertical: 4, paddingHorizontal: 0, opacity: alternativaSelecionada === null ? 0 : 1 }]}
          disabled={alternativaSelecionada === null}
          onPress={async () => {
            if (alternativaSelecionada !== perguntasDict[ordem]?.correta) {
                router.back();
            } else if (ordem < total) {
                setOrdem(ordem + 1);
            } else {
                router.back();
                router.back();
                const usuario = await AsyncStorage.getItem('Usuario');
                console.log('Usuário', usuario)
                const usuarioData = usuario ? JSON.parse(usuario) : null;
                const usuarioFaseData = await AsyncStorage.getItem('UsuarioFase');
                let usuarioFaseArray = [];
                if (usuarioFaseData) {
                  usuarioFaseArray = JSON.parse(usuarioFaseData);
                  if (!Array.isArray(usuarioFaseArray)) usuarioFaseArray = [];
                }
                if (!usuarioFaseArray.some((uf: any) => uf.id_fase === id_fase && uf.id_usuario === (usuarioData ? usuarioData.id : null))) {
                    // Adiciona o usuário e fase ao array
                    usuarioFaseArray.push({
                    id_fase: id_fase,
                    id_usuario: usuarioData ? usuarioData.id : null
                    });
                    await AsyncStorage.setItem('UsuarioFase', JSON.stringify(usuarioFaseArray));
                }
                console.log('Fase concluída e registrada no cache local.');
                console.log('Iniciando registro no banco de dados...');
                if (usuarioData.id !== 1) {
                  // Se for o usuário de teste, não insere no banco
                    try {
                        const { data: usuarioFaseDb, error: selectError } = await supabase
                            .from('UsuarioFase')
                            .select('*')
                            .eq('id_fase', id_fase)
                            .eq('id_usuario', usuarioData ? usuarioData.id : null);

                        if (selectError) {
                            console.error('Erro ao buscar fase no banco de dados:', selectError.message);
                        } else if (!usuarioFaseDb || usuarioFaseDb.length === 0) {
                            const { error: insertError } = await supabase.from('UsuarioFase').insert([{
                                id_fase: id_fase,
                                id_usuario: usuarioData ? usuarioData.id : null
                            }]);
                            if (insertError) {
                                console.error('Erro ao registrar fase no banco de dados:', insertError.message);
                            } else {
                                console.log('Fase concluída e registrada no banco de dados.');
                            }
                        } else {
                            console.log('Usuário já possui fase registrada:', usuarioFaseDb);
                        }
                    } catch (e) {
                        console.error('Erro inesperado ao acessar o banco de dados:', e);
                    }
                }
            }
          }}>
              <Text style={[styles.text]}>
                {alternativaSelecionada !== perguntasDict[ordem]?.correta ? 'Reiniciar' : ordem < total ? 'Próxima' : 'Finalizar'}
              </Text>
            </Pressable>
      </View>
    </View>
  );
}
