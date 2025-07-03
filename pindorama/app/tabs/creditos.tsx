import React from "react";
import { View, Text, Image, Pressable, ScrollView } from "react-native";
import {styles} from "@/styles/styles";
import { useRouter, usePathname } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';

export default function CreditosPage() {
    const router = useRouter();
    const pathname = usePathname();
    const irPara = (rota: Parameters<typeof router.push>[0]) => {
        if (rota !== pathname) {
            router.push(rota);
        }
    };
    return (
        <View style={styles.conteudo}>
            <View style={[styles.header]}>
                        <Pressable
                            style={[styles.row, {width: 'auto'}]} 
                            onPress={() => irPara('/home')}>
            
                            <Image source={require('@/assets/images/icons/inicio.png')} />
                            <Text style={[styles.text, {marginLeft: 10, fontSize: 20, color: '#B89B7F'}]}>Início</Text>
                        </Pressable>
                        <Text style={[styles.title, {width: '100%'}]}>Créditos</Text>
            </View>
                <ScrollView 
                    contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', paddingBottom: 30, justifyContent: 'space-between'}}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    <View style={[{width: '45%', justifyContent: 'center', alignItems: 'center', position: 'relative', marginBottom: 20}]}>
                        <Image source={require('@/assets/images/creditos/cecilia.png')} style={{width: '100%', height: undefined, resizeMode: 'contain', aspectRatio: 3/4}} />
                        <Text style={[styles.text, styles.absolute, {fontSize: 24, textAlign: 'center', color: '#642C08', bottom: '9%', zIndex: 100}]}>
                            Cecília
                        </Text>
                    </View>
                    <View style={[{width: '45%', justifyContent: 'center', alignItems: 'center', position: 'relative', marginBottom: 20}]}>
                        <Image source={require('@/assets/images/creditos/lucas.png')} style={{width: '100%', height: undefined, resizeMode: 'contain', aspectRatio: 3/4}} />
                        <Text style={[styles.text, styles.absolute, {fontSize: 24, textAlign: 'center', color: '#642C08', bottom: '9%', zIndex: 100}]}>
                            Lucas
                        </Text>
                    </View>
                    <View style={[{width: '45%', justifyContent: 'center', alignItems: 'center', position: 'relative', marginBottom: 20}]}>
                        <Image source={require('@/assets/images/creditos/matheus.png')} style={{width: '100%', height: undefined, resizeMode: 'contain', aspectRatio: 3/4}} />
                        <Text style={[styles.text, styles.absolute, {fontSize: 24, textAlign: 'center', color: '#642C08', bottom: '9%', zIndex: 100}]}>
                            Matheus
                        </Text>
                    </View>
                    <View style={[{width: '45%', justifyContent: 'center', alignItems: 'center', position: 'relative', marginBottom: 20}]}>
                        <Image source={require('@/assets/images/creditos/minora.png')} style={{width: '100%', height: undefined, resizeMode: 'contain', aspectRatio: 3/4}} />
                        <Text style={[styles.text, styles.absolute, {fontSize: 24, textAlign: 'center', color: '#642C08', bottom: '9%', zIndex: 100}]}>
                            Minora
                        </Text>
                    </View>
                    <View style={[{width: '45%', justifyContent: 'center', alignItems: 'center', position: 'relative', marginBottom: 20}]}>
                        <Image source={require('@/assets/images/creditos/olga.png')} style={{width: '100%', height: undefined, resizeMode: 'contain', aspectRatio: 3/4}} />
                        <Text style={[styles.text, styles.absolute, {fontSize: 24, textAlign: 'center', color: '#642C08', bottom: '9%', zIndex: 100}]}>
                            Olga
                        </Text>
                    </View>
                    <View style={[{width: '45%', justifyContent: 'center', alignItems: 'center', position: 'relative', marginBottom: 20}]}>
                        <Image source={require('@/assets/images/creditos/samia.png')} style={{width: '100%', height: undefined, resizeMode: 'contain', aspectRatio: 3/4}} />
                        <Text style={[styles.text, styles.absolute, {fontSize: 24, textAlign: 'center', color: '#642C08', bottom: '9%', zIndex: 100}]}>
                            Sâmia
                        </Text>
                    </View>
                    <View style={[{width: '45%', justifyContent: 'center', alignItems: 'center', position: 'relative', marginBottom: 20}]}>
                        <Image source={require('@/assets/images/creditos/vinicius.png')} style={{width: '100%', height: undefined, resizeMode: 'contain', aspectRatio: 3/4}} />
                        <Text style={[styles.text, styles.absolute, {fontSize: 24, textAlign: 'center', color: '#642C08', bottom: '9%', zIndex: 100}]}>
                            Vinícius
                        </Text>
                    </View>
                    <View style={[{width: '45%', justifyContent: 'center', alignItems: 'center', position: 'relative', marginBottom: 20}]}>
                        <Image source={require('@/assets/images/creditos/neabi.png')} style={{width: '100%', height: undefined, resizeMode: 'contain', aspectRatio: 3/4}} />
                        <Text style={[styles.text, styles.absolute, {fontSize: 24, textAlign: 'center', color: '#642C08', bottom: '9%', zIndex: 100}]}>
                            NEABI
                        </Text>
                    </View>
                </ScrollView>
        </View>
    )
}