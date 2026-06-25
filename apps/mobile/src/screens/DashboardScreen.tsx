import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import client from '../api/client';
import { theme } from '../theme/colors';

export default function DashboardScreen() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await client.get('/auth/profile');
        setProfile(res.data);
      } catch (error) {
        console.error("Erreur profil", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tableau de bord</Text>
      <Text style={styles.subtitle}>Bienvenue sur votre espace, {user?.email}</Text>

      {loading ? (
        <ActivityIndicator color={theme.colors.primary} />
      ) : (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Informations</Text>
          <Text style={styles.cardText}>Niveau KYC : {profile?.profile?.kycLevel || 1}</Text>
          <Text style={styles.cardText}>Statut : Actif</Text>
        </View>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
        <Text style={styles.logoutText}>Déconnexion</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: theme.colors.background },
  title: { fontSize: 24, fontWeight: 'bold', color: theme.colors.text },
  subtitle: { fontSize: 16, color: theme.colors.textSecondary, marginBottom: 24 },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 24,
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  cardText: { fontSize: 16, color: theme.colors.textSecondary, marginBottom: 8 },
  logoutButton: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    marginTop: 'auto',
  },
  logoutText: { color: theme.colors.text, fontWeight: 'bold' },
});
