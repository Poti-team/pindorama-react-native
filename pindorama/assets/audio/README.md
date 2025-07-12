# 🔊 Sistema de Efeitos Sonoros

## Como usar o sistema de efeitos sonoros

### 1. **Usando o Hook (Recomendado)**

```tsx
import React from 'react';
import { Pressable, Text } from 'react-native';
import { useEfeitoSonoro } from '@/components/efeitosonoro';

export default function MeuComponente() {
  const { tocarEfeito, definirVolume, habilitarEfeitos } = useEfeitoSonoro();

  const handleClique = () => {
    tocarEfeito('clique');
  };

  const handleAcerto = () => {
    tocarEfeito('acerto', 0.8); // Volume específico
  };

  return (
    <View>
      <Pressable onPress={handleClique}>
        <Text>Botão com som de clique</Text>
      </Pressable>
      
      <Pressable onPress={handleAcerto}>
        <Text>Resposta correta</Text>
      </Pressable>
    </View>
  );
}
```

### 2. **Usando a Função Global**

```tsx
import { tocarEfeitoSonoro } from '@/components/efeitosonoro';

// Em qualquer lugar do código
const responderPergunta = (respostaCorreta: boolean) => {
  if (respostaCorreta) {
    tocarEfeitoSonoro('acerto');
  } else {
    tocarEfeitoSonoro('erro');
  }
};
```

### 3. **Controles Avançados**

```tsx
import { useEfeitoSonoro } from '@/components/efeitosonoro';

export default function ConfiguracoesAudio() {
  const { 
    definirVolume, 
    habilitarEfeitos, 
    pararTodos, 
    obterEstatisticas 
  } = useEfeitoSonoro();

  const toggleAudio = () => {
    const stats = obterEstatisticas();
    habilitarEfeitos(!stats.efeitosHabilitados);
  };

  const ajustarVolume = (novoVolume: number) => {
    definirVolume(novoVolume); // 0.0 a 1.0
  };

  return (
    // Seus controles de interface aqui
  );
}
```

## 🎵 Efeitos Disponíveis

- **`clique`** - Som de clique em botões
- **`acerto`** - Som de resposta correta
- **`erro`** - Som de resposta incorreta
- **`inicio`** - Som de boas-vindas/início de sessão

## 🎼 Música de Fundo

- **`trilha.mp3`** - Música de fundo do jogo (loop infinito)

## 📁 Arquivos de Áudio Incluídos

Os seguintes arquivos estão disponíveis na pasta `assets/audio/`:

- ✅ `clique.mp3` - Som de clique
- ✅ `acerto.mp3` - Som de acerto
- ✅ `erro.mp3` - Som de erro
- ✅ `inicio.mp3` - Som de início
- ✅ `trilha.mp3` - Música de fundo

## 🎮 Implementação nos Componentes

### **Efeitos Sonoros Implementados:**

#### **Home (app/home.tsx)**
- 🔊 **Som de início** ao carregar a página
- 🔊 **Som de clique** ao navegar para outras telas
- 🔊 **Som de clique** no botão de configurações
- 🔊 **Som de clique** no botão de sair

#### **Mapa (app/tabs/mapa.tsx)**
- 🔊 **Som de clique** no botão "Início"
- 🔊 **Som de clique** em todas as bolinhas do mapa
- � **Som de clique** no botão de configurações

#### **Navegação (app/tabs/_layout.tsx)**
- 🔊 **Som de clique** em todos os botões do menu inferior

### **Para Implementar em Fases/Quiz:**
```tsx
// Som de acerto em respostas corretas
tocarEfeito('acerto');

// Som de erro em respostas incorretas  
tocarEfeito('erro');

// Som de clique em botões "próxima" e setas
tocarEfeito('clique');
```

## ⚙️ Características do Sistema

- ✅ **Múltiplos efeitos simultâneos**
- ✅ **Controle de volume individual e global**
- ✅ **Liga/desliga global**
- ✅ **Carregamento otimizado (lazy loading)**
- ✅ **Gestão automática de memória**
- ✅ **Tratamento de erros robusto**
- ✅ **TypeScript com tipos seguros**
