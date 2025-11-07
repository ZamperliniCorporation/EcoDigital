// src/screens/LoginScreen.tsx (Versão Final com Loading Universal)
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ActivityIndicator, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView as SafeViewFromContext } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { LabeledInput } from '../components/LabeledInput';
import { MotiView, MotiText } from 'moti';
import { MotiPressable } from 'moti/interactions';
import { AnimatedGradientBackground } from '../components/AnimatedGradientBackground';
import { LoadingScreen } from '../components/LoadingScreen'; // 1. Importamos nosso componente de carregamento universal

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  async function handleLogin() {
    if (email.trim() === '' || password.trim() === '') return;
    setLoading(true);
    await signIn(email, password);
    // Não precisamos mais do setLoading(false), pois a navegação cuidará de desmontar esta tela.
  }

  // 2. Lógica de renderização condicional: se estiver carregando, mostra a tela de loading.
  if (loading) {
    return <LoadingScreen message="Validando credenciais..." />;
  }

  return (
    <SafeViewFromContext className="flex-1 bg-gray-50">
      <AnimatedGradientBackground />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} showsVerticalScrollIndicator={false}>
          <View className="items-center p-8">
            <MotiView from={{ opacity: 0, translateY: -50 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 700 }} className="items-center mb-6 text-center">
              <Image source={require('../../assets/EcoDigital-Logo.png')} className="w-32 h-32" resizeMode="contain" />
              <MotiText from={{ opacity: 0, translateY: -20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 700, delay: 200 }} className="text-gray-700 font-semibold text-xl mt-4 text-center max-w-xs">
                O futuro sustentável começa aqui.
              </MotiText>
            </MotiView>

            <MotiView from={{ opacity: 0, translateY: 100 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 800, delay: 400 }} className="w-full bg-white p-8 rounded-2xl shadow-2xl shadow-gray-200">
              <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: 'timing', delay: 800 }} className="items-center mb-8">
                <Text className="text-gray-800 text-3xl font-bold">Bem-vindo(a)!</Text>
                <Text className="text-gray-500 text-base mt-2">Faça login para continuar.</Text>
              </MotiView>
              
              <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: 'timing', delay: 900 }}>
                <LabeledInput iconName="mail-outline" label="E-mail" placeholder="email@exemplo.com" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
              </MotiView>
              <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: 'timing', delay: 1000 }}>
                <LabeledInput iconName="lock-closed-outline" label="Senha" placeholder="Sua senha" value={password} onChangeText={setPassword} secureTextEntry />
              </MotiView>
              <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: 'timing', delay: 1100 }} className="self-start mb-8 -mt-2">
                <TouchableOpacity>
                  <Text className="text-ecodigital-green font-semibold">Esqueci minha senha</Text>
                </TouchableOpacity>
              </MotiView>
              <MotiPressable onPress={handleLogin} disabled={loading} animate={({ pressed }) => { return { scale: pressed ? 0.98 : 1 } }}>
                <LinearGradient 
                  colors={['#10B981', '#059669']} 
                  start={{ x: 0, y: 0 }} 
                  end={{ x: 1, y: 1 }} 
                  className={`w-full py-6 rounded-[48px] items-center justify-center ${loading ? 'opacity-70' : ''}`}
                  style={{ minWidth: 220, minHeight: 56, borderRadius: 48, alignItems: 'center', justifyContent: 'center' }}
                >
                  {/* 3. Simplificamos o botão: a lógica de loading agora é de tela cheia, não precisamos mais do ActivityIndicator aqui. */}
                  <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <Text className="text-white font-bold text-2xl" style={{ textAlign: 'center', width: '100%' }}>
                      Entrar
                    </Text>
                  </View>
                </LinearGradient>
              </MotiPressable>
            </MotiView>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeViewFromContext>
  );
}