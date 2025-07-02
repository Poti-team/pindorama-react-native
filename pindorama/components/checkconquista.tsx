import { supabase } from '@/services/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  id_usuario: number;
}

export const checkConquista = async (tipo: 'categoria' | 'fase' | 'item' | 'acerto') => {
  try {
    console.log(`🔍 Investigando conquistas do tipo "${tipo}"... Quem sabe encontramos tesouros? 💎`);
    
    // Carrega dados necessários
    const conquistasData = await AsyncStorage.getItem('Conquista');
    const usuarioConquistasData = await AsyncStorage.getItem('UsuarioConquista');
    
    if (!conquistasData) {
      console.log('😢 Ops! Nenhuma conquista encontrada no baú... Alguém esqueceu de carregá-las!');
      return [];
    }

    console.log('📚 Carregando o grande livro de conquistas... *páginas farfalhando*');
    const todasConquistas: Conquista[] = JSON.parse(conquistasData);
    const usuarioConquistas: UsuarioConquista[] = usuarioConquistasData 
      ? JSON.parse(usuarioConquistasData) 
      : [];

    // Filtra conquistas do tipo especificado
    const conquistasDoTipo = todasConquistas.filter(c => c.tipo === tipo);
    console.log(`🎯 Encontrei ${conquistasDoTipo.length} conquistas do tipo "${tipo}" na lista! Vamos verificar...`);
    
    // IDs das conquistas já obtidas
    const conquistasObtidas = usuarioConquistas.map(uc => uc.id_conquista);
    console.log(`🏆 Você já conquistou ${conquistasObtidas.length} medalhas! Impressionante!`);
    
    // Conquistas novas concluídas
    const novasConquistas: Conquista[] = [];

    for (const conquista of conquistasDoTipo) {
      // Se já foi obtida, pula
      if (conquistasObtidas.includes(conquista.id)) {
        console.log(`⭐ "${conquista.nome}" já está no seu hall da fama! Pulando...`);
        continue;
      }

      console.log(`🔎 Analisando "${conquista.nome}"... *ajustando óculos*`);
      
      // Verifica se a conquista foi concluída baseado no tipo
      const concluida = await verificarConquistaConcluida(conquista);
      
      if (concluida) {
        console.log(`🎉 EUREKA! Nova conquista desbloqueada: "${conquista.nome}"! 🚀`);
        novasConquistas.push(conquista);
        
        const usuario = await AsyncStorage.getItem('Usuario');
        const usuarioData = usuario ? JSON.parse(usuario) : null;
        
        // Adiciona ao AsyncStorage
        const novaUsuarioConquista: UsuarioConquista = {
          id_conquista: conquista.id,
          id_usuario: usuarioData ? usuarioData.id : null
        };
        usuarioConquistas.push(novaUsuarioConquista);
        
        if (usuarioData.id != 1) {
          console.log(usuarioData.id)
          console.log('☁️ Sincronizando com as nuvens... *enviando dados para Supabase*');
          // Se não for o usuário de teste, insere no banco de dados
          const { error } = await supabase.from('UsuarioConquista').insert([novaUsuarioConquista]);
          if (error) {
            console.error('💥 Oops! Erro ao enviar para as nuvens:', error.message);
          } else {
            console.log('✅ Dados salvos na nuvem com sucesso! *piscadinha*');
          }
        } else {
          console.log('🧪 Modo teste ativado! Dados salvos apenas localmente.');
        }
        break; // Para de verificar após a primeira conquista nova
      } else {
        console.log(`⏳ "${conquista.nome}" ainda não foi conquistada... Continue tentando, campeão!`);
        // break -- descomentar quando mudar lógica de verificação da conquista de categoria
      }
    }

    // Atualiza AsyncStorage se houver novas conquistas
    if (novasConquistas.length > 0) {
      console.log(`🎊 WOW! ${novasConquistas.length} nova(s) conquista(s) adicionada(s) ao seu arsenal!`);
      await AsyncStorage.setItem('UsuarioConquista', JSON.stringify(usuarioConquistas));
      console.log('💾 Tudo salvo no cofre local! Suas conquistas estão seguras!');
    } else {
      console.log('😊 Nenhuma conquista nova dessa vez, mas continue jogando! A próxima pode estar logo ali!');
    }

    return novasConquistas;
  } catch (error) {
    console.error('🚨 Houston, temos um problema! Erro ao verificar conquistas:', error);
    return [];
  }
};

const verificarConquistaConcluida = async (conquista: Conquista): Promise<boolean> => {
  try {
    console.log(`🕵️ Investigando conquista "${conquista.nome}" do tipo "${conquista.tipo}"...`);
    
    switch (conquista.tipo) {
      case 'categoria':
        console.log('📁 Verificando se completou todas as fases da categoria... *contando nos dedos*');
        return await verificarConquistaCategoria(conquista);
      
      case 'fase':
        console.log('🏃 Verificando quantas fases você já dominou... *cronômetro na mão*');
        return await verificarConquistaFase(conquista);
      
      case 'item':
        console.log('🎒 Contando os tesouros coletados na sua mochila... *fazendo inventário*');
        return await verificarConquistaItem(conquista);
      
      case 'acerto':
        console.log('🧠 Calculando seus acertos... *ativando modo calculadora*');
        return await verificarConquistaAcerto(conquista);
      
      default:
        console.log('❓ Tipo de conquista desconhecido... Isso é estranho! 🤔');
        return false;
    }
  } catch (error) {
    console.error('💥 Erro ao verificar conquista individual:', error);
    return false;
  }
};

const verificarConquistaCategoria = async (conquista: Conquista): Promise<boolean> => {
  console.log(`🏷️ Analisando categoria ${conquista.id_categoria}... *procurando pistas*`);
  
  // Verifica se completou todas as fases de uma categoria
  if (!conquista.id_categoria) {
    console.log('❌ Conquista sem categoria definida! Isso não faz sentido...');
    return false;
  }
  
  const fasesData = await AsyncStorage.getItem('Fase');
  const usuarioFasesData = await AsyncStorage.getItem('UsuarioFase');
  
  if (!fasesData || !usuarioFasesData) {
    console.log('📭 Dados de fases não encontrados... O baú está vazio!');
    return false;
  }
  
  const fases = JSON.parse(fasesData);
  const usuarioFases = JSON.parse(usuarioFasesData);
  
  const fasesCategoria = fases.filter((f: any) => f.id_categoria === conquista.id_categoria);
  const fasesConcluidas = usuarioFases.filter((uf: any) => uf.id_categoria === conquista.id_categoria);
  
  console.log(`📊 Categoria ${conquista.id_categoria}: ${fasesConcluidas.length}/${fasesCategoria.length} fases concluídas!`);
  
  const completa = fasesConcluidas.length === fasesCategoria.length;
  if (completa) {
    console.log('🎯 BINGO! Categoria completamente dominada! 👑');
  } else {
    console.log(`⏰ Ainda faltam ${fasesCategoria.length - fasesConcluidas.length} fases... Quase lá!`);
  }
  
  return completa;
};

const verificarConquistaFase = async (conquista: Conquista): Promise<boolean> => {
  console.log(`🎮 Meta: completar ${conquista.meta_numerica} fases... *preparando contador*`);
  
  // Verifica se completou X fases (meta_numerica)
  if (!conquista.meta_numerica) {
    console.log('❌ Meta numérica não definida! Como vou contar sem números? 🤷‍♂️');
    return false;
  }
  
  const usuarioFasesData = await AsyncStorage.getItem('UsuarioFase');
  if (!usuarioFasesData) {
    console.log('📭 Nenhuma fase completada ainda... Todo herói precisa começar de algum lugar!');
    return false;
  }
  
  const usuarioFases = JSON.parse(usuarioFasesData);
  return usuarioFases.length >= conquista.meta_numerica;
};

const verificarConquistaItem = async (conquista: Conquista): Promise<boolean> => {
  console.log(`💰 Meta: coletar ${conquista.meta_numerica} itens... *organizando inventário*`);
  
  // Verifica se coletou X itens (meta_numerica)
  if (!conquista.meta_numerica) {
    console.log('❌ Meta numérica não definida! Quantos itens preciso mesmo? 🤔');
    return false;
  }
  
  const usuarioItensData = await AsyncStorage.getItem('UsuarioItem');
  if (!usuarioItensData) {
    console.log('🎒 Mochila vazia! Hora de começar a aventura e coletar tesouros!');
    return false;
  }
  
  const usuarioItens = JSON.parse(usuarioItensData);
  return usuarioItens.length >= conquista.meta_numerica;
};

const verificarConquistaAcerto = async (conquista: Conquista): Promise<boolean> => {
  console.log(`🎯 Meta: acertar ${conquista.meta_numerica} perguntas... *ativando cérebro*`);
  
  // Verifica se acertou X perguntas (meta_numerica)
  if (!conquista.meta_numerica) {
    console.log('❌ Meta numérica não definida! Quantos acertos mesmo? 🧮');
    return false;
  }
  
  const usuario = await AsyncStorage.getItem('Usuario');
  if (!usuario) {
    console.log('👤 Usuário não encontrado! Quem é você mesmo? 👻');
    return false;
  }

  const usuarioData = JSON.parse(usuario);
  const respostasCertas = usuarioData.respostas_certas;

  return respostasCertas >= conquista.meta_numerica;
};