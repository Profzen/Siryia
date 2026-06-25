import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import client from '../api/client';
import { theme } from '../theme/colors';
import { ShieldCheck, UploadCloud, Clock } from 'lucide-react-native';

export default function KycScreen() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      const res = await client.get('/kyc/status');
      setStatus(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadImage = async (documentType: string) => {
    if (!imageUri) return;
    setUploading(true);
    
    // Preparation du FormData pour React Native
    const localUri = imageUri;
    const filename = localUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename || '');
    const type = match ? `image/${match[1]}` : `image`;

    const formData = new FormData();
    formData.append('documentType', documentType);
    // @ts-ignore
    formData.append('file', { uri: localUri, name: filename, type });

    try {
      await client.post('/kyc/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      Alert.alert('Succès', 'Document envoyé avec succès');
      setImageUri(null);
      fetchStatus();
    } catch (error) {
      Alert.alert('Erreur', 'L\'envoi a échoué');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} color={theme.colors.primary} />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 24 }}>
      <Text style={styles.title}>Vérification d'identité</Text>
      
      {status?.kycStatus === 'VERIFIED' && (
        <View style={styles.statusBox}>
          <ShieldCheck color="green" size={32} />
          <Text style={styles.statusTitle}>Identité vérifiée</Text>
          <Text style={styles.statusDesc}>Votre compte est validé.</Text>
        </View>
      )}

      {status?.kycStatus === 'PENDING' && status?.documents?.length > 0 && (
        <View style={[styles.statusBox, { backgroundColor: '#eef2ff', borderColor: '#c7d2fe' }]}>
          <Clock color={theme.colors.primary} size={32} />
          <Text style={styles.statusTitle}>Vérification en cours</Text>
          <Text style={styles.statusDesc}>Vos documents sont en cours d'analyse.</Text>
        </View>
      )}

      {status?.kycStatus !== 'VERIFIED' && (
        <View style={styles.uploadCard}>
          <Text style={styles.cardTitle}>1. Pièce d'identité</Text>
          
          {imageUri ? (
            <View>
              <Image source={{ uri: imageUri }} style={styles.preview} />
              <TouchableOpacity style={styles.button} onPress={() => uploadImage('ID_CARD')} disabled={uploading}>
                {uploading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Soumettre</Text>}
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={() => setImageUri(null)}>
                <Text style={styles.secondaryButtonText}>Annuler</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.dropzone} onPress={pickImage}>
              <UploadCloud color={theme.colors.primary} size={32} />
              <Text style={styles.dropzoneText}>Choisir une photo depuis la galerie</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  title: { fontSize: 24, fontWeight: 'bold', color: theme.colors.text, marginBottom: 24 },
  statusBox: {
    padding: 20,
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  statusTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 12 },
  statusDesc: { color: theme.colors.textSecondary, marginTop: 4 },
  uploadCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 16 },
  dropzone: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: theme.colors.primary,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
  },
  dropzoneText: { marginTop: 12, color: theme.colors.textSecondary, textAlign: 'center' },
  preview: { width: '100%', height: 200, borderRadius: 8, marginBottom: 16 },
  button: { backgroundColor: theme.colors.primary, padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  secondaryButton: { padding: 16, alignItems: 'center', marginTop: 8 },
  secondaryButtonText: { color: theme.colors.textSecondary },
});
