import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { colors } from '../../theme/colors';
import { useAuthStore } from '../../store/useAuthStore';

export const HomeScreen = () => {
  const { user } = useAuthStore();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Bonjour, {user?.profile?.firstName || 'Utilisateur'} 👋</Text>
          <Text style={styles.subtitle}>Bienvenue sur Siryia</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Votre activité</Text>
          <Text style={styles.cardText}>L'application mobile est en cours de construction. Vous retrouverez ici toutes vos statistiques et activités récentes.</Text>
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
  header: {
    marginBottom: 32,
    marginTop: 16,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.slate[900],
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.slate[500],
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.slate[200],
    shadowColor: colors.slate[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.slate[900],
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: colors.slate[500],
    lineHeight: 22,
  },
});
