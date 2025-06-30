import { View, Image, } from 'react-native';
import { Slot } from 'expo-router';
import { styles } from '@/styles/styles';
import * as NavigationBar from 'expo-navigation-bar';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';

export default function Mosaico_top() {
    useEffect(() => {
      (async () => {
        try {
          await NavigationBar.setVisibilityAsync("hidden");
        } catch (error) {
          console.warn("Failed to hide navigation bar:", error);
        }
      })();
    }, [])

    const [fontsLoaded] = useFonts({
        'IrishGrover-Regular': require('@/assets/fonts/Irish_Grover/IrishGrover-Regular.ttf')
    });
    
    if (!fontsLoaded) {
        return null; // Ou um componente de carregamento
    }
    
    return (
        <View style={styles.container}>
            <StatusBar hidden /> 
            <View style={{zIndex: 10}}>
                <Image
                    source={require('@/assets/images/mosaico_top.png')}
                    resizeMode="contain"
                />
            </View>
            <View style={[styles.absolute, {bottom: 0, left: 0}]}>
                <Image source={require('@/assets/images/sol.png')}/>
            </View>
            <Slot />
        </View>
    );
}
