import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { useAuthStore } from '../../store/useAuthStore';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import api from '../../api/client';

export const EditProfileScreen = () => {
  const { user, fetchProfile } = useAuthStore();
  const navigation = useNavigation();
  
  const [firstName, setFirstName] = useState(user?.profile?.firstName || '');
  const [lastName, setLastName] = useState(user?.profile?.lastName || '');
  const [profession, setProfession] = useState(user?.profile?.profession || '');
  const [bio, setBio] = useState(user?.profile?.bio || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.patch('/auth/profile', {
        firstName,
        lastName,
        profession,
        bio,
      });
      // Fetch updated profile
      await fetchProfile();
      Alert.alert('Succès', 'Votre profil a été mis à jour.');
      navigation.goBack();
    } catch (error: any) {
      console.error('Erreur de mise à jour:', error);
      Alert.alert('Erreur', error.response?.data?.message || 'Une erreur est survenue lors de la mise à jour.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Modifiez vos informations</Text>
        
        <View style={styles.form}>
          <Input
            label="Prénom"
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Votre prénom"
          />
          <Input
            label="Nom"
            value={lastName}
            onChangeText={setLastName}
            placeholder="Votre nom"
          />
          <Input
            label="Profession / Métier"
            value={profession}
            onChangeText={setProfession}
            placeholder="Ex: Avocat, Développeur..."
          />
          <Input
            label="Biographie"
            value={bio}
            onChangeText={setBio}
            placeholder="Présentez-vous en quelques mots..."
            multiline
            numberOfLines={4}
          />

          <Button
            title={loading ? "Enregistrement..." : "Enregistrer"}
            onPress={handleSave}
            disabled={loading}
            style={{ marginTop: 24 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.slate[50],
  },
  container: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.slate[900],
    marginBottom: 24,
  },
  form: {
    gap: 16,
  },
});
