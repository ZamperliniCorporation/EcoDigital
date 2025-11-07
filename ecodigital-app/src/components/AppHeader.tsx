import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Modal, TouchableOpacity, Pressable, Alert, Animated } from 'react-native';
import { Svg, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { supabase } from '../api/supabaseClient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';

interface AppHeaderProps {
  title: string;
  noTopInset?: boolean;
}

export function AppHeader({ title, noTopInset }: AppHeaderProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation<any>();
  const route = useRoute();
  const [logoScale] = useState(new Animated.Value(1));
  const { profile, user } = useAuth();

  // Helper para obter a URL pública do avatar
  function getAvatarUrl(path: string | null | undefined) {
    if (!path) return null;
    // Se a URL já for completa, adicionamos um timestamp para evitar problemas de cache.
    if (path.startsWith('http')) {
      return `${path}?t=${new Date().getTime()}`;
    }
    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
    // Adicionamos um timestamp à URL pública gerada para evitar cache.
    return data?.publicUrl ? `${data.publicUrl}?t=${new Date().getTime()}` : null;
  }

  // Função para obter as iniciais do nome
  function getInitials(name: string | null | undefined): string {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  async function handleSignOut() {
    setModalVisible(false);
    try {
      await supabase.auth.signOut();
    } catch (e) {
      Alert.alert('Erro ao sair', 'Não foi possível sair da conta.');
    }
  }

  function handleNavigateToProfile() {
    setModalVisible(false);
    navigation.navigate('Profile');
  }

  const handleLogoPress = () => {
    Animated.sequence([
      Animated.timing(logoScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    setModalVisible(true);
  };

  // Detecta se está na tela de perfil para remover o top inset
  const isProfileScreen =
    route.name === 'Profile' ||
    title === 'Meu Perfil';

  const safeAreaEdges: readonly Edge[] = isProfileScreen
    ? ([] as const)
    : (['top'] as const);

  return (
    <SafeAreaView style={{ backgroundColor: '#0F172A' }} edges={safeAreaEdges}>
      <View style={styles.container}>
        {/* Background Gradient */}
        <View style={styles.gradientBackground}>
          <Svg width="100%" height="100%" viewBox="0 0 375 140" preserveAspectRatio="none">
            <Defs>
              <LinearGradient id="headerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#0F172A" stopOpacity="1" />
                <Stop offset="30%" stopColor="#1E293B" stopOpacity="1" />
                <Stop offset="70%" stopColor="#334155" stopOpacity="0.9" />
                <Stop offset="100%" stopColor="#475569" stopOpacity="0.8" />
              </LinearGradient>
              <LinearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                <Stop offset="50%" stopColor="#059669" stopOpacity="0.2" />
                <Stop offset="100%" stopColor="#047857" stopOpacity="0.1" />
              </LinearGradient>
            </Defs>
            <Path d="M0,0 H375 V80 Q320,140 200,110 Q80,80 0,140 Z" fill="url(#headerGradient)" />
            <Path d="M0,0 H375 V60 Q300,100 200,80 Q100,60 0,100 Z" fill="url(#accentGradient)" />
          </Svg>
        </View>

        {/* Header Content */}
        <View style={styles.headerContent}>
          {/* User Photo and Menu Button */}
          <View style={styles.topRow}>
            {/* User Photo and Name - Canto Superior Esquerdo */}
            <TouchableOpacity 
              style={styles.userSection}
              onPress={handleNavigateToProfile}
              activeOpacity={0.8}
            >
              <View style={styles.userPhotoContainer}>
                {profile?.avatar_url ? (
                  <Image
                    source={{ uri: getAvatarUrl(profile.avatar_url) }}
                    style={styles.userPhoto}
                  />
                ) : (
                  <View style={styles.userPhotoPlaceholder}>
                    <Text style={styles.userPhotoInitials}>
                      {getInitials(profile?.full_name)}
                    </Text>
                  </View>
                )}
                <View style={styles.userPhotoBorder} />
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>
                  {profile?.full_name || 'Usuário'}
                </Text>
                <Text style={styles.userStatus}>Online</Text>
              </View>
            </TouchableOpacity>
            
            {/* Menu Button - Canto Superior Direito */}
            <Animated.View style={{ transform: [{ scale: logoScale }] }}>
              <TouchableOpacity 
                style={styles.menuButton} 
                onPress={handleLogoPress} 
                activeOpacity={0.8}
              >
                <View style={styles.menuButtonInner}>
                  <View style={styles.menuIndicator}>
                    <View style={styles.menuDot} />
                    <View style={styles.menuDot} />
                    <View style={styles.menuDot} />
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <View style={styles.titleWrapper}>
              <Text style={styles.titleText}>{title}</Text>
              <View style={styles.titleUnderline} />
            </View>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Online</Text>
            </View>
          </View>
        </View>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <Pressable style={styles.modalContent} onPress={() => {}}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Menu</Text>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <Feather name="x" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>
            
            {/* User Info Section */}
            <View style={styles.userInfoSection}>
              <View style={styles.userInfoAvatar}>
                {profile?.avatar_url ? (
                  <Image // Correção 1: Usar getAvatarUrl para aplicar o cache-busting
                    source={{ uri: getAvatarUrl(profile.avatar_url) }} 
                    style={styles.userInfoPhoto} 
                  /> 
                ) : (
                  <View style={styles.userInfoPhotoPlaceholder}>
                    <Text style={styles.userInfoInitials}> 
                      {getInitials(profile?.full_name)} {/* Correção 2: Remover o 'e' extra de full_namee */}
                    </Text> 
                  </View>
                )}
              </View>
              <View style={styles.userInfoText}>
                <Text style={styles.userInfoName}>
                  {profile?.full_name || 'Usuário'}
                </Text>
                <Text style={styles.userInfoEmail}>
                  {user?.email}
                </Text>
                {profile?.xp_points && (
                  <Text style={styles.userInfoXp}>
                    {profile.xp_points} XP
                  </Text>
                )}
              </View>
            </View>
            
            <View style={styles.modalDivider} />
            
            <TouchableOpacity
              style={styles.modalItem}
              onPress={handleNavigateToProfile}
              activeOpacity={0.7}
            >
              <View style={styles.modalItemIcon}>
                <Ionicons name="person-circle-outline" size={24} color="#10B981" />
              </View>
              <Text style={styles.modalItemText}>Meu Perfil</Text>
              <Feather name="chevron-right" size={16} color="#94A3B8" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.modalItem}
              onPress={() => {
                setModalVisible(false);
                // Adicionar navegação para configurações se necessário
              }}
              activeOpacity={0.7}
            >
              <View style={styles.modalItemIcon}>
                <Ionicons name="settings-outline" size={24} color="#6366F1" />
              </View>
              <Text style={styles.modalItemText}>Configurações</Text>
              <Feather name="chevron-right" size={16} color="#94A3B8" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.modalItem}
              onPress={() => {
                setModalVisible(false);
                // Adicionar navegação para ajuda se necessário
              }}
              activeOpacity={0.7}
            >
              <View style={styles.modalItemIcon}>
                <Ionicons name="help-circle-outline" size={24} color="#F59E0B" />
              </View>
              <Text style={styles.modalItemText}>Ajuda</Text>
              <Feather name="chevron-right" size={16} color="#94A3B8" />
            </TouchableOpacity>
            
            <View style={styles.modalDivider} />
            
            <TouchableOpacity
              style={styles.modalItem}
              onPress={handleSignOut}
              activeOpacity={0.7}
            >
              <View style={styles.modalItemIcon}>
                <MaterialIcons name="logout" size={24} color="#EF4444" />
              </View>
              <Text style={[styles.modalItemText, { color: '#EF4444' }]}>Sair da Conta</Text>
              <Feather name="chevron-right" size={16} color="#94A3B8" />
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 140,
    backgroundColor: '#0F172A',
    position: 'relative',
    overflow: 'hidden',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  headerContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    zIndex: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userPhotoContainer: {
    position: 'relative',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 2,
  },
  userStatus: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  userPhoto: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#10B981',
  },
  userPhotoPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#10B981',
  },
  userPhotoInitials: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  userPhotoBorder: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  menuButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  menuButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginRight: 8,
  },
  menuIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#10B981',
    marginHorizontal: 1,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  titleWrapper: {
    flex: 1,
  },
  titleText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: 0.3,
    lineHeight: 34,
  },
  titleUnderline: {
    width: 60,
    height: 3,
    backgroundColor: '#10B981',
    borderRadius: 2,
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  modalContent: {
    marginTop: 60,
    marginRight: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 0,
    minWidth: 280,
    maxWidth: 320,
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  modalItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  modalItemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginHorizontal: 20,
  },
  userInfoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F8FAFC',
  },
  userInfoAvatar: {
    marginRight: 16,
  },
  userInfoPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#10B981',
  },
  userInfoPhotoPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#10B981',
  },
  userInfoInitials: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  userInfoText: {
    flex: 1,
  },
  userInfoName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  userInfoEmail: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  userInfoXp: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
});