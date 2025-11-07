import React, { useState } from 'react';
import { View, Text, Image, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView as SafeViewFromContext } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, MotiText } from 'moti';
import { MotiPressable } from 'moti/interactions';
import { AnimatedGradientBackground } from '../components/AnimatedGradientBackground';
import { LoadingScreen } from '../components/LoadingScreen';
import { LabeledInput } from '../components/LabeledInput';
import { supabase } from '../api/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

// Regras de senha
const PASSWORD_RULES = [
  { label: 'Mínimo de 8 caracteres', test: (s: string) => s.length >= 8 },
  { label: 'Pelo menos 1 letra maiúscula', test: (s: string) => /[A-Z]/.test(s) },
  { label: 'Pelo menos 1 letra minúscula', test: (s: string) => /[a-z]/.test(s) },
  { label: 'Pelo menos 1 número', test: (s: string) => /\d/.test(s) },
  { label: 'Pelo menos 1 caractere especial (!@#$%^&*)', test: (s: string) => /[!@#$%^&*]/.test(s) },
];

function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors = PASSWORD_RULES.filter(rule => !rule.test(password)).map(rule => rule.label);
  return { valid: errors.length === 0, errors };
}

export function ForceChangePasswordScreen() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  // Extrai o nome do usuário do campo user.user_metadata.name, se existir, senão do email antes do @
  let userName = '';
  if (user?.user_metadata?.name) {
    userName = user.user_metadata.name;
  } else if (user?.email) {
    userName = user.email.split('@')[0];
  }

  async function handlePasswordUpdate() {
    const { valid, errors } = validatePassword(newPassword);

    if (!valid) {
      Alert.alert(
        'Senha fraca',
        `Sua senha precisa atender aos seguintes requisitos:\n- ${errors.join('\n- ')}`
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Senhas não conferem', 'Os campos de nova senha e confirmação precisam ser idênticos.');
      return;
    }

    setLoading(true);
    const { error: updateUserError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateUserError) {
      Alert.alert('Erro', 'Não foi possível atualizar sua senha. Tente novamente.');
      console.error(updateUserError);
      setLoading(false);
      return;
    }

    if (!user || !user.id) {
      setLoading(false);
      Alert.alert('Erro', 'Usuário não encontrado. Por favor, faça login novamente.');
      return;
    }

    const { error: updateProfileError } = await supabase
      .from('profiles')
      .update({ requires_password_change: false })
      .eq('id', user.id);

    setLoading(false);

    if (updateProfileError) {
      Alert.alert('Erro', 'Sua senha foi atualizada, mas houve um problema ao salvar seu perfil. Por favor, contate o suporte.');
      console.error(updateProfileError);
    } else {
      Alert.alert('Sucesso!', 'Sua senha foi atualizada. Por favor, faça o login novamente.');
      await supabase.auth.signOut();
    }
  }

  if (loading) {
    return <LoadingScreen message="Atualizando senha..." />;
  }

  // Para feedback visual das regras
  const passwordChecks = PASSWORD_RULES.map(rule => ({
    label: rule.label,
    passed: rule.test(newPassword),
  }));

  // Só mostrar as regras se alguma não for cumprida
  const showPasswordRules = newPassword.length > 0 && passwordChecks.some(rule => !rule.passed);

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
                <Text className="text-3xl font-bold text-ecodigital-green">
                  Boas vindas,{userName ? ` ${userName}` : ''}!
                </Text>
                <Text className="text-gray-500 text-base mt-2 text-center">Por segurança, crie uma nova senha pessoal para o seu primeiro acesso.</Text>
              </MotiView>
              
              <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: 'timing', delay: 900 }}>
                <LabeledInput
                  iconName="lock-closed-outline"
                  label="Nova Senha"
                  placeholder="Digite sua nova senha"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                />
                {/* Descritivo das regras de senha - só aparece se alguma não for cumprida */}
                {showPasswordRules && (
                  <View style={{ marginTop: 4, marginBottom: 4 }}>
                    {passwordChecks.map((rule, idx) =>
                      !rule.passed ? (
                        <Text
                          key={idx}
                          className="text-xs"
                          style={{
                            color: '#EF4444', // vermelho
                            marginLeft: 8,
                            marginBottom: 1,
                          }}
                        >
                          - {rule.label}
                        </Text>
                      ) : (
                        <Text
                          key={idx}
                          className="text-xs"
                          style={{
                            color: '#9CA3AF', // cinza claro
                            marginLeft: 8,
                            marginBottom: 1,
                          }}
                        >
                          - {rule.label}
                        </Text>
                      )
                    )}
                  </View>
                )}
              </MotiView>
              <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: 'timing', delay: 1000 }}>
                <LabeledInput
                  iconName="lock-closed-outline"
                  label="Confirmar Nova Senha"
                  placeholder="Confirme sua nova senha"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </MotiView>
              <MotiPressable
                onPress={handlePasswordUpdate}
                disabled={loading}
                animate={({ pressed }) => ({ scale: pressed ? 0.98 : 1 })}
                style={{ marginTop: 32 }}
              >
                <LinearGradient 
                  colors={['#10B981', '#059669']} 
                  start={{ x: 0, y: 0 }} 
                  end={{ x: 1, y: 1 }} 
                  className={`w-full py-6 rounded-[48px] items-center justify-center ${loading ? 'opacity-70' : ''}`}
                  style={{ minWidth: 220, minHeight: 56, borderRadius: 48, alignItems: 'center', justifyContent: 'center' }}
                >
                  <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <Text className="text-white font-bold text-2xl" style={{ textAlign: 'center', width: '100%' }}>
                      Salvar e Continuar
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