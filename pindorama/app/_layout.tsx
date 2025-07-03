import { View, Image, } from 'react-native';
import { Slot } from 'expo-router';
import { styles } from '@/styles/styles';
import * as NavigationBar from 'expo-navigation-bar';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Dimensions } from 'react-native';

const screenHeight = Dimensions.get('window').height;

export default function Mosaico_top() {
    useEffect(() => {
      const hideNavigationBar = async () => {
        try {
          await NavigationBar.setVisibilityAsync("hidden");
        } catch (error) {
          console.warn("Failed to hide navigation bar:", error);
        } 
      };
      hideNavigationBar();
    }, []); // Executa apenas uma vez ao montar o componente

    const [fontsLoaded] = useFonts({
        'IrishGrover-Regular': require('@/assets/fonts/Irish_Grover/IrishGrover-Regular.ttf')
    });
    
    if (!fontsLoaded) {
        return null; // Ou um componente de carregamento
    }
    
    return (
        <View style={[styles.container, { height: screenHeight }]}>
            <StatusBar hidden /> 
            <View style={{ zIndex: 10, width: '100%', height: 50 }}>
              <Image
                source={require('@/assets/images/mosaico_top.png')}
                resizeMode="repeat"
                style={{ 
                  width: '100%', 
                  height: '100%',
                  resizeMode: 'contain',
                }}
              />
            </View>
            <View style={[styles.absolute, {bottom: 0, left: 0}]}>
                <Image source={require('@/assets/images/sol.png')}/>
            </View>
            <View style={[styles.absolute, { top: 50, right: -25 }]}>
              <Image
                source={require('@/assets/images/sol.png')}
                style={{ transform: [{ rotate: '180deg' }] }}
              />
            </View>
            <Slot />
        </View>
    );
}
