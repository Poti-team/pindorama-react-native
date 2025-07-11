import React, { use, useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Session } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';

import { supabase } from '@/services/supabase';
import { styles } from '@/styles/styles';
import { useEfeitoSonoro } from '@/components/efeitosonoro';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [username, setUsername] = useState('');
  const [loadingData, setLoadingData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [login, setLogin] = useState(true);
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const { tocarEfeito } = useEfeitoSonoro();
  
  const [userSession, setUserSession] = useState<Session | null>(null);
  
  useEffect(() => {
    setReady(false);
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserSession(session);
    });
    
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUserSession(session);
    });
    
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    checkUsuarioExistente();
  }, [userSession, ready]);
  
  useEffect(() => {
    const fetchData = async () => {
      if (userSession) {
        await carregarDadosUsuario();
        await carregarDados();
      }
    };
    fetchData();
  }, [userSession]);

  useEffect(() => {
    if (ready) {
      router.replace('/home');
    }
  }, [ready]);


  const emailJaExiste = async (email: string): Promise<boolean> => {
    const { data, error } = await supabase.rpc('email_ja_cadastrado', {
        email_check: email,
    });

    if (error) {
        console.error('Erro ao verificar e-mail:', error.message);
        return false;
    }

    if (typeof data !== 'boolean') {
        console.warn('Resposta inválida de email_ja_cadastrado:', data);
        return false;
    }

    return data; // true se já existe
};


  const signInWithEmail = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });
    setLoading(false);

    if (error) {
      Alert.alert('Erro no login', error.message);
    }
  };

  const signUpWithEmail = async () => {
    setLoading(true);
    // Verifica se já existe algum usuário com o mesmo username na tabela Usuario (perfil público)
    const { data: userComUsername } = await supabase
      .from('Usuario')
      .select('username')
      .eq('username', username)
      .maybeSingle();
    if (userComUsername?.username === username) {
      Alert.alert('Erro', 'Username já em uso. Por favor, escolha outro.');
      setLoading(false);
      return;
    } else if (await emailJaExiste(email)) {
      Alert.alert('Erro', 'E-mail já cadastrado. Por favor, faça login ou recupere sua senha.');
      setLoading(false);
      return;
    } else {
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        data: {
          username: username,
        },
      },
    });
    setLoading(false);

    if (signUpError) {
      Alert.alert('Erro no cadastro', 'Algo deu errado ao criar sua conta. Por favor, tente novamente.');
      return;
    }
  }};

 const carregarDados = async () => {
  try {
    setLoadingData(true);

    console.log('Iniciando verificação do cache local...');
    await AsyncStorage.setItem('dados_carregados', 'false'); // Reseta o estado de carregamento
    const dadosFixosJaBaixados = await AsyncStorage.getItem('dados_carregados');

    if (dadosFixosJaBaixados === 'true') {
      console.log('Dados já estavam armazenados. Pulando download.');
      return;
    }

    console.log('Baixando dados do Supabase...');
    const [Fase, Conquista, Categoria, Pergunta, Item, Pagina] = await Promise.all([
      supabase.from('Fase').select('*'),
      supabase.from('Conquista').select('*'),
      supabase.from('Categoria').select('*'),
      supabase.from('Pergunta').select('*'),
      supabase.from('Item').select('*'),
      supabase.from('Pagina').select('*'),
    ]);

    // Verifica se todos os dados vieram corretamente
    if (
      Fase.error || Conquista.error || Categoria.error ||
      Pergunta.error || Item.error || Pagina.error
    ) {
      throw new Error('Erro ao buscar dados fixos do Supabase');
    }

    console.log('Salvando dados localmente...');
    await AsyncStorage.multiSet([
      ['Fase', JSON.stringify(Fase.data)],
      ['Conquista', JSON.stringify(Conquista.data)],
      ['Categoria', JSON.stringify(Categoria.data)],
      ['Pergunta', JSON.stringify(Pergunta.data)],
      ['Item', JSON.stringify(Item.data)],
      ['Pagina', JSON.stringify(Pagina.data)],
      ['dados_carregados', 'true'],
    ]);

    console.log('Dados salvos com sucesso!');
  } catch (error) {
    console.error('Erro ao carregar dados fixos:', error);
    Alert.alert('Erro ao carregar dados', (error as Error).message);
  } finally {
    setLoadingData(false);
  }
};


  const carregarDadosUsuario = async () => {
    try {
      setLoadingData(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        console.log('Usuário logado:', user.id);
        console.log('Carregando dados do usuário...');

        const id_usuario = user.id;

        const [UsuarioFase, UsuarioItem, UsuarioConquista] = await Promise.all([
          supabase.from('UsuarioFase').select('*').eq('id_usuario', id_usuario),
          supabase.from('UsuarioItem').select('*').eq('id_usuario', id_usuario),
          supabase.from('UsuarioConquista').select('*').eq('id_usuario', id_usuario),
        ]);

        await AsyncStorage.setItem('UsuarioFase', JSON.stringify(UsuarioFase.data));
        await AsyncStorage.setItem('UsuarioItem', JSON.stringify(UsuarioItem.data));
        await AsyncStorage.setItem('UsuarioConquista', JSON.stringify(UsuarioConquista.data));

        console.log('Dados do usuário carregados e armazenados no cache local.');
      } else {
        const usuarioFaseStr = await AsyncStorage.getItem('UsuarioFase');
        const usuarioFaseArr = usuarioFaseStr ? JSON.parse(usuarioFaseStr) : [];
        if (!usuarioFaseArr.find((uf: any) => uf.id_usuario === 1)) {
          // Se não houver usuário logado e nenhum cache de usuário convidado, inicializa os dados vazios
          console.log('Nenhum cache de usuario encontrado, iniciando carregamento...');
          await AsyncStorage.setItem('UsuarioFase', JSON.stringify([]));
          await AsyncStorage.setItem('UsuarioItem', JSON.stringify([]));
          await AsyncStorage.setItem('UsuarioConquista', JSON.stringify([]));
          await AsyncStorage.setItem('Usuario', JSON.stringify({ id: 1, username: 'convidado', respostas_certas: 0 }));
          console.log('Dados de usuário inicializados no cache local.');
        }
        console.log('Usuário convidado encontrado ou criado.');
      }
    } catch (error) {
      Alert.alert('Erro ao carregar dados', (error as Error).message);
    } finally {
      setLoadingData(false);
    }}

  const checkUsuarioExistente = async () => {
      if (userSession && !ready) {
        const { data: usuarioExistente } = await supabase.from('Usuario').select('*').eq('id', userSession.user.id).single();
        if (!usuarioExistente) {
            await supabase.from('Usuario').insert({
              id: userSession.user.id,
              username: userSession.user.user_metadata.username
            }).then(({ error }) => {
              if (error) {
                Alert.alert('Erro ao criar usuário', error.message);
              }
            });
          }
        await supabase.from('Usuario').select('*').eq('id', userSession.user.id).single().then(async ({ data }) => {
          if (data) {
            await AsyncStorage.setItem('Usuario', JSON.stringify({ id: data.id, username: data.username || 'convidado', respostas_certas: data.respostas_certas || 0 }));
            setReady(true);
          }
        });
      }
    };

  const renderFormulario = () => {
    if (loadingData) {
      return (
        <View style={styles.conteudo}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.text}>Carregando conteúdo do jogo...</Text>
        </View>
      );
    }

    if (userSession) {
      return null; // Redireciona para a home
    }

    const isLogin = login;
    const isSignup = !login;

    return (
      <View style={[styles.conteudo, { justifyContent: 'flex-end' }]}>
        {/* Logo no topo */}
        <View style={{ width: '100%', flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
          <Image
            source={require('@/assets/images/pindorama.png')}
            style={{ aspectRatio: 2, maxWidth: '100%' }}
            resizeMode="contain"
          />
        </View>

        {/* Formulário */}
        <View style={[styles.div, { flex: 2, justifyContent: 'space-between', gap: 24, marginTop: -30, paddingBottom: 60 }]}>
          <View style={{ width: '100%',  justifyContent: 'flex-start', alignItems: 'center', gap: 20 }}>
            {/* Título */}
            <Text style={styles.title}>
              {isLogin ? 'Login' : 'Criação de Conta'}
            </Text>

            {/* Campos do formulário */}
            {isSignup && (
              <TextInput
                style={styles.input}
                placeholder="Digite seu username"
                value={username}
                onChangeText={setUsername}
              />
            )}
            
            <TextInput
              style={styles.input}
              placeholder="Digite seu e-mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <TextInput
              style={styles.input}
              placeholder={isLogin ? "Digite sua senha" : "Digite sua senha (mínimo 8 caracteres)"}
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
            />

            {/* Botão principal */}
            <Pressable
              style={styles.buttonAuth}
              onPress={() => {
                tocarEfeito('clique');
                isLogin ? signInWithEmail() : signUpWithEmail();
              }}
              disabled={loading || 
                !email || !senha || 
                (isSignup && (senha.length < 8 || !username))
              }
            >
              <Text style={[styles.buttonText, { fontSize: 20}]}>
                {loading ? 'Enviando...' : (isLogin ? 'Entrar' : 'Criar')}
              </Text>
            </Pressable>
          </View>
          <View style={{ width: '100%', alignItems: 'center', gap: 16 }}>
          {/* Botão alternar modo */}
          <Pressable 
            style={{ width: '100%' }} 
            onPress={() => {
              tocarEfeito('clique');
              setLogin(!login);
            }}
          >
            <Text style={[styles.buttonText, { textAlign: 'center', fontSize: 16, textDecorationColor: '#642C08', textDecorationLine: 'underline' }]}>
              {isLogin ? 'Ainda não tem uma conta? Crie uma!' : 'Já tem uma conta? Faça login!'}
            </Text>
          </Pressable>

          {/* Botão convidado (apenas no modo login) */}
          {isLogin && (
            <Text style={[styles.text, { textAlign: 'center', fontSize: 16 }]}>
              Ou
            </Text>
          )}
          {isLogin && (
            <Pressable
              style={{ width: '100%' }}
              onPress={async () => {
                tocarEfeito('clique');
                setLoading(true);
                await carregarDados();
                await carregarDadosUsuario();
                setUserSession(null);
                setLoading(false);
                router.replace('/home');
              }}
            >
              <Text style={[styles.buttonText, { textAlign: 'center', fontSize: 16, textDecorationColor: '#642C08', textDecorationLine: 'underline' }]}>Continuar como convidado</Text>
            </Pressable>
          )}
          </View>
        </View>
      </View>
    );
  };

  // No final do componente, substitua todos os returns por:
  return renderFormulario();
}
