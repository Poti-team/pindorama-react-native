import { View, Pressable, Text, Image, ImageSourcePropType, Dimensions } from 'react-native';
import { Slot, useRouter, usePathname } from 'expo-router';
import { styles } from '@/styles/styles';
import { useEfeitoSonoro } from '@/components/efeitosonoro';

const screenWidth = Dimensions.get('window').width;

export default function LayoutComMenu() {
    const { tocarEfeito } = useEfeitoSonoro();
    const router = useRouter();
    const pathname = usePathname();
  
      const irPara = (rota: Parameters<typeof router.push>[0]) => {
          if (rota !== pathname) {
              tocarEfeito('clique');
              router.push(rota);
          }
      }

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <View style={[styles.absolute,{bottom: 0, left: 0}]}>
          <Image source={require('@/assets/images/sol.png')}/>
        </View>
        <View style={[styles.absolute, { top: 0, right: -25 }]}>
          <Image
            source={require('@/assets/images/sol.png')}
            style={{ transform: [{ rotate: '180deg' }] }}
          />
        </View>
        {/* Conteúdo da tela */}
        <Slot />
      </View>



      {/* Menu inferior */}
      <View style={styles.menu}>


          <Image source={require('@/assets/images/detalhe_menu.png')} resizeMode="repeat"
                style={[styles.absolute, {
                  top: -5,
                  width: screenWidth,
                  height: 20,
                  resizeMode: 'contain',
                }]}/>
 

        <BotaoMenu
          icone={require('@/assets/images/icons/mapa.png')}
          texto="Mapa"
          ativo={pathname === '/tabs/mapa'}
          onPress={() => irPara('/tabs/mapa')}
        />
        <BotaoMenu
          icone={require('@/assets/images/icons/conquistas.png')}
          texto="Conquistas"
          ativo={pathname === '/tabs/conquistas'}
          onPress={() => irPara('/tabs/conquistas')}
        />
        <BotaoMenu
          icone={require('@/assets/images/icons/creditos.png')}
          texto="Créditos"
          ativo={pathname === '/tabs/creditos'}
          onPress={() => irPara('/tabs/creditos')}
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
    <Pressable onPress={onPress} style={{flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 10}}>
      <Image
        source={icone}
        style={[
          {height: 54, resizeMode: 'contain'},
        ]}
      />
      <Text style={[styles.text, { color: '#642C08'}]}>
        {texto}
      </Text>
    </Pressable>
  );
}