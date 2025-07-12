import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Image, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '@/styles/styles';
import { supabase } from '@/services/supabase';
import { checkConquista } from '@/components/checkconquista';
import { useEfeitoSonoro } from '@/components/efeitosonoro';

export default function QuizFasePage() {
  const { id_fase: id_fase_param } = useLocalSearchParams();
  const id_fase = parseInt(id_fase_param as string, 10);
  const [perguntas, setPerguntas] = useState<any[]>([]);
  const [perguntasDict, setPerguntasDict] = useState<{ [key: number]: any }>({});
  const [ordem, setOrdem] = useState(1);
  const [loading, setLoading] = useState(true);
  const [alternativaSelecionada, setAlternativaSelecionada] = useState<number | null>(null);
  const router = useRouter();
  const [fase, setFase] = useState<any | null>(null);
  const { tocarEfeito } = useEfeitoSonoro();

  useEffect(() => {
    const fetchFase = async () => {
      const data = await AsyncStorage.getItem('Fase');
      if (data) {
        const todasFases = JSON.parse(data);
        const faseAtual = todasFases.find((f: any) => f.id === id_fase);
        setFase(faseAtual);
      }
    };
    fetchFase();
  }, [id_fase]);

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
        <Pressable style={[styles.row, { width: 'auto' }]} onPress={() => {
          tocarEfeito('clique');
          router.back();
        }}>
          <Image source={require('@/assets/images/icons/setinha.png')} />
          <Text style={[styles.text, { marginLeft: 10, fontSize: 20, color: '#B89B7F' }]}>Voltar</Text>
        </Pressable>
        <View style={styles.row}>
          <Text style={[styles.title, { fontSize: 32 }]}>{`Pergunta ${ordem}`}</Text>
          <Image
            source={
              alternativaSelecionada === null || alternativaSelecionada === perguntasDict[ordem]?.correta
          ? require('@/assets/images/icons/coracao.png')
          : require('@/assets/images/icons/coracao_partido.png')
            }
            style={{ width: 32, height: 32 }}
            resizeMode="contain"
          />
        </View>
      </View>
      <View style={[styles.div, { flex: 1, justifyContent: 'space-between', gap: 20 }]}>
        <Text style={[styles.text, styles.abz, {fontSize: 18}]}>{`${perguntasDict[ordem]?.enunciado}`}</Text>
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
                  { paddingVertical: 8, paddingHorizontal: 12, gap: 8, width: '100%', justifyContent: 'space-between',
                    opacity: alternativaSelecionada !== null && alternativaSelecionada !== index + 1 ? 0.6 : 1, 
                    backgroundColor: alternativaSelecionada !== index + 1 ? '#EACA92' : alternativaSelecionada === perguntasDict[ordem]?.correta ? '#FFE192' : '#956046',
                    borderColor: '#642C08', borderWidth: 2, borderRadius: 2}
                ]}
                disabled={alternativaSelecionada !== null}
                onPress={async () => {
                  setAlternativaSelecionada(index + 1);
                  if (index + 1 === perguntasDict[ordem]?.correta) {
                    console.log('Resposta correta!');
                    tocarEfeito('acerto');
                    const usuario = await AsyncStorage.getItem('Usuario');
                    if (usuario) {
                      const usuarioData = JSON.parse(usuario);
                      usuarioData.respostas_certas = (usuarioData.respostas_certas || 0) + 1;
                      await AsyncStorage.setItem('Usuario', JSON.stringify(usuarioData));
                      if (usuarioData.id !== 1) {
                        await supabase
                        .from('Usuario')
                        .update({ respostas_certas: usuarioData.respostas_certas })
                        .eq('id', usuarioData.id);
                      }
                    }
                    checkConquista('acerto');
                  } else {
                    tocarEfeito('erro');
                  }
                }}
              >
                <Text style={[styles.text, styles.abz, {fontSize: 13, fontWeight: 'bold', flex: 9, textAlign: 'left',
                   color: alternativaSelecionada === index + 1 && alternativaSelecionada !== perguntasDict[ordem]?.correta ? '#421D05' : '#642C08'}]}>{alt}</Text>
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
      <View style={[styles.div, { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }]}>
        {/* Botão Reiniciar ou Finalizar */}
        {(alternativaSelecionada !== perguntasDict[ordem]?.correta || ordem === total) && (
          <Pressable
            style={[
              styles.button,
              { width: 80, height: 34, paddingVertical: 4, paddingHorizontal: 0, opacity: alternativaSelecionada === null ? 0 : 1 }
            ]}
            disabled={alternativaSelecionada === null}
            onPress={async () => {
              tocarEfeito('clique');
              if (alternativaSelecionada !== perguntasDict[ordem]?.correta) {
          router.back();
              } else if (ordem === total) {
          router.back();
          router.back();
          const usuario = await AsyncStorage.getItem('Usuario');
          const usuarioData = usuario ? JSON.parse(usuario) : null;
          const usuarioFaseData = await AsyncStorage.getItem('UsuarioFase');
          let usuarioFaseArray = [];
          if (usuarioFaseData) {
            usuarioFaseArray = JSON.parse(usuarioFaseData);
            if (!Array.isArray(usuarioFaseArray)) usuarioFaseArray = [];
          }
          if (!usuarioFaseArray.some((uf: any) => uf.id_fase === id_fase && uf.id_usuario === (usuarioData ? usuarioData.id : null))) {
            usuarioFaseArray.push({
              id_fase: id_fase,
              id_usuario: usuarioData ? usuarioData.id : null
            });
            await AsyncStorage.setItem('UsuarioFase', JSON.stringify(usuarioFaseArray));
          }
          await checkConquista('fase');
          await checkConquista('categoria', fase.id_categoria);
          if (usuarioData.id != 1) {
            try {
              const { data: usuarioFaseDb, error: selectError } = await supabase
                .from('UsuarioFase')
                .select('*')
                .eq('id_fase', id_fase)
                .eq('id_usuario', usuarioData ? usuarioData.id : null);

              if (!usuarioFaseDb || usuarioFaseDb.length === 0) {
                await supabase.from('UsuarioFase').insert([{
            id_fase: id_fase,
            id_usuario: usuarioData ? usuarioData.id : null
                }]);
              }
            } catch (e) {
              console.error('Erro inesperado ao acessar o banco de dados:', e);
            }
          }
              }
            }}
          >
            <Text style={[styles.text]}>
              {alternativaSelecionada !== perguntasDict[ordem]?.correta ? 'Reiniciar' : 'Finalizar'}
            </Text>
          </Pressable>
        )}

        {/* Botão Próxima */}
        {alternativaSelecionada === perguntasDict[ordem]?.correta && ordem < total && (
          <Pressable
            style={[{
              width: 80, height: 34, opacity: alternativaSelecionada === null ? 0 : 1, alignItems: 'center', justifyContent: 'center'
            }]}
            disabled={alternativaSelecionada === null}
            onPress={() => { 
              tocarEfeito('clique');
              setOrdem(ordem + 1); 
              setAlternativaSelecionada(null); 
            }}
          >
            <Image source={require('@/assets/images/icons/proxima.png')} style={{ height: '100%', aspectRatio: 2 }} resizeMode="contain" />
          </Pressable>
        )}
      </View>
    </View>
  );
}
