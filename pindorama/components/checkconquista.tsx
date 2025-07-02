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
    // Carrega dados necessários
    const conquistasData = await AsyncStorage.getItem('Conquista');
    const usuarioConquistasData = await AsyncStorage.getItem('UsuarioConquista');
    
    if (!conquistasData) {
      return [];
    }

    const todasConquistas: Conquista[] = JSON.parse(conquistasData);
    const usuarioConquistas: UsuarioConquista[] = usuarioConquistasData 
      ? JSON.parse(usuarioConquistasData) 
      : [];

    // Filtra conquistas do tipo especificado
    const conquistasDoTipo = todasConquistas.filter(c => c.tipo === tipo);
    
    // IDs das conquistas já obtidas
    const conquistasObtidas = usuarioConquistas.map(uc => uc.id_conquista);
    
    // Conquistas novas concluídas
    const novasConquistas: Conquista[] = [];

    for (const conquista of conquistasDoTipo) {
      // Se já foi obtida, pula
      if (conquistasObtidas.includes(conquista.id)) {
        continue;
      }

      // Verifica se a conquista foi concluída baseado no tipo
      const concluida = await verificarConquistaConcluida(conquista);
      
      if (concluida) {
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
          // Se não for o usuário de teste, insere no banco de dados
          const { error } = await supabase.from('UsuarioConquista').insert([novaUsuarioConquista]);
          if (error) {
            console.error('Erro ao enviar conquista para Supabase:', error.message);
          }
        }
        break; // Para de verificar após a primeira conquista nova
      } else {
        break
      }
    }

    // Atualiza AsyncStorage se houver novas conquistas
    if (novasConquistas.length > 0) {
      await AsyncStorage.setItem('UsuarioConquista', JSON.stringify(usuarioConquistas));
    }

    return novasConquistas;
  } catch (error) {
    console.error('Erro ao verificar conquistas:', error);
    return [];
  }
};

const verificarConquistaConcluida = async (conquista: Conquista): Promise<boolean> => {
  try {
    switch (conquista.tipo) {
      case 'categoria':
        return await verificarConquistaCategoria(conquista);
      
      case 'fase':
        return await verificarConquistaFase(conquista);
      
      case 'item':
        return await verificarConquistaItem(conquista);
      
      case 'acerto':
        return await verificarConquistaAcerto(conquista);
      
      default:
        return false;
    }
  } catch (error) {
    console.error('Erro ao verificar conquista individual:', error);
    return false;
  }
};

const verificarConquistaCategoria = async (conquista: Conquista): Promise<boolean> => {
  // Verifica se completou todas as fases de uma categoria
  if (!conquista.id_categoria) {
    return false;
  }
  
  const fasesData = await AsyncStorage.getItem('Fase');
  const usuarioFasesData = await AsyncStorage.getItem('UsuarioFase');
  
  if (!fasesData || !usuarioFasesData) {
    return false;
  }
  
  const fases = JSON.parse(fasesData);
  const usuarioFases = JSON.parse(usuarioFasesData);
  
  const fasesCategoria = fases.filter((f: any) => f.id_categoria === conquista.id_categoria);
  const fasesConcluidas = usuarioFases.filter((uf: any) => uf.id_categoria === conquista.id_categoria);
  
  const completa = fasesConcluidas.length === fasesCategoria.length;
  
  return completa;
};

const verificarConquistaFase = async (conquista: Conquista): Promise<boolean> => {
  // Verifica se completou X fases (meta_numerica)
  if (!conquista.meta_numerica) {
    return false;
  }
  
  const usuarioFasesData = await AsyncStorage.getItem('UsuarioFase');
  if (!usuarioFasesData) {
    return false;
  }
  
  const usuarioFases = JSON.parse(usuarioFasesData);
  return usuarioFases.length >= conquista.meta_numerica;
};

const verificarConquistaItem = async (conquista: Conquista): Promise<boolean> => {
  // Verifica se coletou X itens (meta_numerica)
  if (!conquista.meta_numerica) {
    return false;
  }
  
  const usuarioItensData = await AsyncStorage.getItem('UsuarioItem');
  if (!usuarioItensData) {
    return false;
  }
  
  const usuarioItens = JSON.parse(usuarioItensData);
  return usuarioItens.length >= conquista.meta_numerica;
};

const verificarConquistaAcerto = async (conquista: Conquista): Promise<boolean> => {
  // Verifica se acertou X perguntas (meta_numerica)
  if (!conquista.meta_numerica) {
    return false;
  }
  
  const usuario = await AsyncStorage.getItem('Usuario');
  if (!usuario) {
    return false;
  }

  const usuarioData = JSON.parse(usuario);
  const respostasCertas = usuarioData.respostas_certas;

  return respostasCertas >= conquista.meta_numerica;
};