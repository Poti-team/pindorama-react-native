import React, { use, useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Session } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';

import { supabase } from '@/services/supabase';
import { styles } from '@/styles/styles';

export default function Auth() {
  const [userSession, setUserSession] = useState<Session | null>(null);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [username, setUsername] = useState('');
  const [loadingData, setLoadingData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [login, setLogin] = useState(true);
  const [ready, setReady] = useState(false);

  const router = useRouter();

  useEffect(() => {
    checkUsuarioExistente();
  }, [userSession, ready]);

  useEffect(() => {
    carregarDados();

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
    if (userSession) {
        carregarDadosUsuario();
    }
  }, [userSession]);

  const home = () => {
    router.replace('/home');
  };


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
    } else {
        Alert.alert('Sucesso', 'Conta criada com sucesso! Verifique seu email para confirmação.');
        setLogin(true);
        setEmail('');
        setSenha('');
        setUsername('');
    }
  }};

  const carregarDados = async () => {
    try {
      setLoadingData(true);

      const dadosFixosJaBaixados = await AsyncStorage.getItem('dados_carregados');

      if (dadosFixosJaBaixados !== 'true') {
        const [Fase, Conquista, Categoria, Pergunta, Item, Pagina] = await Promise.all([
          supabase.from('Fase').select('*'),
          supabase.from('Conquista').select('*'),
          supabase.from('Categoria').select('*'),
          supabase.from('Pergunta').select('*'),
          supabase.from('Item').select('*'),
          supabase.from('Pagina').select('*'),
        ]);

        await AsyncStorage.setItem('Fase', JSON.stringify(Fase.data));
        await AsyncStorage.setItem('Conquista', JSON.stringify(Conquista.data));
        await AsyncStorage.setItem('Categoria', JSON.stringify(Categoria.data));
        await AsyncStorage.setItem('Pergunta', JSON.stringify(Pergunta.data));
        await AsyncStorage.setItem('Item', JSON.stringify(Item.data));
        await AsyncStorage.setItem('Pagina', JSON.stringify(Pagina.data));
        await AsyncStorage.setItem('dados_carregados', 'true');
      }

    } catch (error) {
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
        const id_usuario = user.id;

        const [UsuarioFase, UsuarioItem, UsuarioConquista] = await Promise.all([
          supabase.from('UsuarioFase').select('*').eq('id_usuario', id_usuario),
          supabase.from('UsuarioItem').select('*').eq('id_usuario', id_usuario),
          supabase.from('UsuarioConquista').select('*').eq('id_usuario', id_usuario),
        ]);

        await AsyncStorage.setItem('UsuarioFase', JSON.stringify(UsuarioFase.data));
        await AsyncStorage.setItem('UsuarioItem', JSON.stringify(UsuarioItem.data));
        await AsyncStorage.setItem('UsuarioConquista', JSON.stringify(UsuarioConquista.data));
        
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
              username: userSession.user.user_metadata.username || 'convidado',
              email: userSession.user.email || '',
            }).then(({ error }) => {
              if (error) {
                Alert.alert('Erro ao criar usuário', error.message);
              }
            });
            await AsyncStorage.setItem('Usuario', JSON.stringify({ id: userSession.user.id, username: userSession.user.user_metadata.username || 'convidado' }));
        }
        setReady(true);
      }
    };

  if (!userSession && login) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
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
          placeholder="Digite sua senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />
        <Pressable style={styles.button} onPress={signInWithEmail} disabled={loading || !email || !senha}>
          <Text style={styles.buttonText}>{loading ? 'Enviando...' : 'Entrar'}</Text>
        </Pressable>
        <Pressable
          style={[styles.button]}
          onPress={() => setLogin(false)}>
          <Text style={styles.buttonText}>Ainda não tem uma conta? Crie uma!</Text>
        </Pressable>
        <Pressable
          style={[styles.button]}
          onPress={async () => {
            setLoading(true)
            await carregarDados();
            await carregarDadosUsuario();
            Alert.alert('Aviso', 'Você está jogando como convidado. Seus dados não serão salvos.');
            setUserSession(null);
            await AsyncStorage.setItem('Usuario', JSON.stringify({ id: '0', username: 'convidado'}));
            setLoading(false);
            router.replace('/home');
          }}>
          <Text style={styles.buttonText}>Continuar como convidado</Text>
        </Pressable>
      </View>
    );
  }

  if (!userSession && !login) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Criação de Conta</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu username"
          value={username}
          onChangeText={setUsername}>
        </TextInput>
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
          placeholder="Digite sua senha (mínimo 8 caracteres)"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />
        <Pressable
          style={styles.button}
          onPress={signUpWithEmail}
          disabled={loading || senha.length < 8 || !username || !email || !senha}
        >
          <Text style={styles.buttonText}>{loading ? 'Enviando...' : 'Criar'}</Text>
        </Pressable>
        <Pressable
          style={[styles.button]}
          onPress={() => setLogin(true)}>
          <Text style={styles.buttonText}>Já tem uma conta? Faça login!</Text>
        </Pressable>
        <Pressable
          style={[styles.button]}
          onPress={async () => {
            setLoadingData(true);
            await carregarDados();
            await carregarDadosUsuario();
            setLoadingData(false);
            router.replace('/home');
          }}>
          <Text style={styles.buttonText}>Continuar como convidado</Text>
        </Pressable>
      </View>
    );
  }

  if (loadingData) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.text}>Carregando conteúdo do jogo...</Text>
      </View>
    );
  }
  if (ready) { home() }
  return null; // Redireciona para a home, não renderiza nada aqui
}
