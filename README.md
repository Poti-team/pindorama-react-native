# 🌟 Pindorama - Jogo Educativo Interativo

**Bem-vindo ao Pindorama! Esperamos que tenha uma experiência educacional extraordinária! 🌟**

## 🎯 Sobre o Projeto

O **Pindorama** é um jogo educativo de perguntas e respostas focado na cultura indígena brasileira. Desenvolvido como ferramenta de resistência cultural, combate o apagamento histórico dos povos originários através de uma experiência interativa e envolvente.

### 📱 Missão e Propósito

- **Combater o Apagamento Cultural**: Dar visibilidade às tradições, línguas e saberes dos povos originários
- **Educar com Responsabilidade**: Apresentar conteúdo autêntico sobre a diversidade indígena
- **Despertar Consciência**: Sensibilizar sobre a importância da preservação cultural
- **Promover Inclusão**: Democratizar o acesso ao conhecimento das culturas originárias

### 🎮 Mecânicas do Jogo

#### **Conteúdo Educativo**
- **Formas de Expressão**: Práticas corporais que unem cultura, espiritualidade e resistência
- **Hábitos Ancestrais**: Costumes e modos de viver que demonstram a permanência indígena
- **Culinária Nativa**: Sabores e saberes da relação com a terra e o alimento
- **História Verdadeira**: Narrativas autênticas sobre resistência e contribuições dos povos indígenas

#### **Sistema de Progressão**
- **Categorias Temáticas**: Organização por áreas específicas do conhecimento
- **Fases Sequenciais**: Progressão linear com dificuldade crescente
- **Sistema de Conquistas**: Recompensas por categoria, fase e performance
- **Status Visuais**: Indicadores de progresso (disponível, trancada, concluída)

## 🛠️ Tecnologias Utilizadas

### **Frontend**
- **React Native** (0.79.4) - Framework multiplataforma
- **TypeScript** (5.8.3) - Tipagem estática 
- **Expo** (~53.0.13) - Plataforma de desenvolvimento
- **Expo Router** (~5.1.1) - Sistema de navegação

### **Backend**
- **Supabase** - Backend-as-a-Service com PostgreSQL
- **AsyncStorage** - Armazenamento local

### **Arquitetura**
```
app/
├── index.tsx          # Autenticação
├── home.tsx           # Tela inicial
└── tabs/
    ├── mapa.tsx       # Mapa de categorias
    ├── conquistas.tsx # Sistema de conquistas
    ├── creditos.tsx # Desenvolvedores
    └── categoria/
        └── fase/      # Páginas de fases e quizzes

components/            # Componentes reutilizáveis
services/             # Configuração Supabase
styles/               # Estilos centralizados
```

## 🔧 Como Executar o Projeto

### 📋 Pré-requisitos

- **Node.js** (versão 18 ou superior)
- **npm** como gerenciador de pacotes
- **Expo CLI** instalado globalmente
- **Expo Go** app no dispositivo móvel

### 🚀 Instalação

0. **Abra a pasta pindorama**

1. **Instale as dependências**
   ```bash
   npm install
   ```

2. **Inicie o servidor de desenvolvimento**
   ```bash
   npx expo start
   ```

### 📱 Testando no Dispositivo

1. **Instale o Expo Go**
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Escaneie o QR Code**
   - Abra o Expo Go e escaneie o QR code exibido no terminal
   - O app será carregado automaticamente no seu dispositivo
