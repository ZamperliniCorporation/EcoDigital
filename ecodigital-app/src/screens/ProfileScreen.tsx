import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '../components/AppHeader';
import { useAuth } from '../contexts/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../api/supabaseClient';

// Ajuste de tipos para evitar erros de tipagem
type Profile = {
  id: string;
  avatar_url?: string | null;
  full_name?: string | null;
  // Adicione outros campos se necessário
};

export function ProfileScreen() {
  const { user, profile, refreshUserProfile } = useAuth() as {
    user: { id: string; email: string } | null;
    profile: Profile | null;
    refreshUserProfile?: () => Promise<void>;
  };

  // Garantir valores default para evitar erros de undefined/null
  const userId = user?.id ?? '';
  const userEmail = user?.email ?? '';
  const userName = profile?.full_name ?? '';

  const [name, setName] = useState(userName);
  const [saving, setSaving] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(
    profile?.avatar_url ? getAvatarUrl(profile.avatar_url) : null
  );

  // Helper para obter a URL pública do avatar
  function getAvatarUrl(path: string | null | undefined) {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
    return data?.publicUrl || null;
  }

  // Atualiza a foto de perfil
  async function handleChangePhoto() {
    if (!userId) return;
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permissão necessária', 'Permita o acesso à galeria para alterar a foto.');
        return;
      }
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      if (pickerResult.canceled) return;

      setPhotoUploading(true);

      const asset = pickerResult.assets[0];
      const fileExt = asset.uri.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${userId}_${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      // Read file as blob
      const response = await fetch(asset.uri);
      const blob = await response.blob();

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, blob, {
          contentType: blob.type,
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Update user profile with new avatar path
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: filePath })
        .eq('id', userId);

      if (updateError) {
        throw updateError;
      }

      const publicUrl = getAvatarUrl(filePath);
      setPhotoUrl(publicUrl);

      if (typeof refreshUserProfile === 'function') {
        await refreshUserProfile();
      }

      Alert.alert('Sucesso', 'Foto de perfil atualizada!');
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível atualizar a foto de perfil.');
      console.error(err);
    } finally {
      setPhotoUploading(false);
    }
  }

  async function handleSave() {
    if (!userId) return;
    if (!name.trim()) {
      Alert.alert('Nome obrigatório', 'Por favor, preencha seu nome.');
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: name.trim() })
        .eq('id', userId);

      if (error) throw error;

      if (typeof refreshUserProfile === 'function') {
        await refreshUserProfile();
      }

      Alert.alert('Sucesso', 'Perfil atualizado!');
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível atualizar o perfil.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  // Avatar fallback
  const initials = (name || userEmail || 'U')
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Removido edges={['top']} da SafeAreaView principal, deixando apenas left, right e bottom.
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} edges={['left', 'right', 'bottom']}>
      <AppHeader title="Meu Perfil" />
      <View style={styles.container}>
        <View style={styles.avatarSection}>
          <TouchableOpacity
            style={styles.avatarButton}
            onPress={handleChangePhoto}
            activeOpacity={0.8}
            disabled={photoUploading}
          >
            <View style={styles.avatarCircle}>
              {photoUploading ? (
                <ActivityIndicator color="#fff" size="large" />
              ) : photoUrl ? (
                <Image
                  source={{ uri: photoUrl }}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.initialsContainer}>
                  <Text style={styles.initialsText}>{initials}</Text>
                </View>
              )}
            </View>
            <View style={styles.editPhotoBadge}>
              <Text style={styles.editPhotoText}>Editar</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Seu nome"
            autoCapitalize="words"
            editable={!saving}
            returnKeyType="done"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, { backgroundColor: '#F3F4F6', color: '#9CA3AF' }]}
            value={userEmail}
            editable={false}
            selectTextOnFocus={false}
            placeholder="Seu email"
          />

          <TouchableOpacity
            style={[
              styles.saveButton,
              (saving || !name.trim()) && { backgroundColor: '#A7F3D0' },
            ]}
            onPress={handleSave}
            disabled={saving || !name.trim()}
            activeOpacity={0.8}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Salvar</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const AVATAR_SIZE = 120;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  avatarSection: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 32,
  },
  avatarButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCircle: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: '#10B981',
    borderWidth: 4,
    borderColor: '#34D399',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#10B981',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
  },
  avatarImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  },
  initialsContainer: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  editPhotoBadge: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: -12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  editPhotoText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  formSection: {
    marginTop: 8,
    flex: 1,
  },
  label: {
    fontSize: 16,
    color: '#22223B',
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 18,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D1FAE5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontSize: 17,
    color: '#22223B',
    marginBottom: 2,
  },
  saveButton: {
    marginTop: 32,
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.5,
  },
});