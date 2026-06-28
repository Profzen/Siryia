import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { colors } from '../../theme/colors';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../../components/Button';
import { LogOut, User, Mail, Shield } from 'lucide-react-native';

export const ProfileScreen = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.profile?.firstName?.[0] || 'U'}</Text>
          </View>
          <Text style={styles.name}>{user?.profile?.firstName} {user?.profile?.lastName}</Text>
          <Text style={styles.email}>{user?.email || user?.phone || 'Identifiant inconnu'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <User color={colors.slate[400]} size={20} />
              <Text style={styles.infoText}>Membre depuis 2026</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Shield color={colors.primary[500]} size={20} />
              <Text style={styles.infoText}>Compte sécurisé</Text>
            </View>
          </View>
        </View>

        <View style={styles.logoutContainer}>
          <Button 
            title="Se déconnecter" 
            onPress={handleLogout} 
            variant="outline" 
            textStyle={{ color: colors.danger }}
            style={{ borderColor: colors.danger }}
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
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.primary[500],
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '800',
    color: colors.primary[600],
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.slate[900],
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: colors.slate[500],
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.slate[900],
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.slate[200],
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoText: {
    fontSize: 16,
    color: colors.slate[700],
    marginLeft: 16,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: colors.slate[100],
    marginLeft: 36,
  },
  logoutContainer: {
    marginTop: 24,
  },
});
