import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { colors } from '../../theme/colors';
import api from '../../api/client';
import { useAuthStore } from '../../store/useAuthStore';

export const SignupScreen = ({ navigation }: any) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();

  const handleSignup = async () => {
    if (!firstName || !lastName || !identifier || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }
    
    setIsLoading(true);
    try {
      await api.post('/auth/register', {
        firstName,
        lastName,
        identifier,
        password,
      });
      // Inscription réussie, on connecte l'utilisateur
      await login({ identifier, password });
    } catch (error: any) {
      Alert.alert('Erreur', error.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Créer un compte</Text>
            <Text style={styles.subtitle}>Rejoignez Siryia dès aujourd'hui</Text>
          </View>

          <View style={styles.form}>
            <Input 
              label="Prénom"
              placeholder="Votre prénom"
              value={firstName}
              onChangeText={setFirstName}
            />
            <Input 
              label="Nom"
              placeholder="Votre nom"
              value={lastName}
              onChangeText={setLastName}
            />
            <Input 
              label="Email ou Téléphone"
              placeholder="Ex: jean@mail.com ou +22890000000"
              value={identifier}
              onChangeText={setIdentifier}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <Input 
              label="Mot de passe"
              placeholder="Min 8 caractères"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            
            <Button 
              title="S'inscrire" 
              onPress={handleSignup} 
              isLoading={isLoading} 
              style={styles.signupButton} 
            />

            <View style={styles.footer}>
              <Text style={styles.footerText}>Déjà un compte ? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginText}>Se connecter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.slate[50],
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.slate[900],
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: colors.slate[500],
    marginTop: 8,
  },
  form: {
    width: '100%',
  },
  signupButton: {
    marginTop: 16,
    marginBottom: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: colors.slate[500],
    fontSize: 14,
  },
  loginText: {
    color: colors.primary[600],
    fontSize: 14,
    fontWeight: '600',
  },
});
