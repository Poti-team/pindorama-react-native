import { View, Pressable, Text, Image, ImageSourcePropType } from 'react-native';
import { Slot, useRouter, usePathname } from 'expo-router';
import { styles } from '@/styles/styles';

export default function LayoutComMenu() {
  const router = useRouter();
  const pathname = usePathname();

  const irPara = (rota: Parameters<typeof router.push>[0]) => {
    if (pathname !== rota) router.push(rota);
  };

  return (
    <View style={styles.container}>
      {/* Conteúdo da tela */}
      <View style={styles.conteudo}>
        <Slot />
      </View>

      {/* Menu inferior */}
      <View style={styles.menu}>
        <BotaoMenu
          icone={require('@/assets/images/mapa.png')}
          texto="Mapa"
          ativo={pathname === '/tabs/mapa'}
          onPress={() => irPara('/tabs/mapa')}
        />
        <BotaoMenu
          icone={require('@/assets/images/conquistas.png')}
          texto="Conquistas"
          ativo={pathname === '/tabs/conquistas'}
          onPress={() => irPara('/tabs/conquistas')}
        />
        <BotaoMenu
          icone={require('@/assets/images/perfil.png')}
          texto="Perfil"
          ativo={pathname.startsWith('/tabs/perfil')}
          onPress={() => irPara('/tabs/perfil')}
        />
      </View>
    </View>
  );
}

type BotaoMenuProps = {
  icone: ImageSourcePropType; // You can replace 'any' with ImageSourcePropType from 'react-native' for better typing
  texto: string;
  ativo: boolean;
  onPress: () => void;
};

function BotaoMenu({ icone, texto, ativo, onPress }: BotaoMenuProps) {
  return (
    <Pressable onPress={onPress}>
      <Image
        source={icone}
        style={[
          { height: 30, marginBottom: 5 },
        ]}
      />
      <Text style={[styles.text, { color: '#642C08'}]}>
        {texto}
      </Text>
    </Pressable>
  );
}