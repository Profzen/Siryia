import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { ShieldCheck, Mail, Phone, Star } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import api from '../../api/client';

export const AnnuaireDetailScreen = () => {
  const route = useRoute<any>();
  const { id, type } = route.params;
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const endpoint = type === 'COMPANY' ? `/annuaire/company/${id}` : `/annuaire/solo/${id}`;
        const response = await api.get(endpoint);
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching detail:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id, type]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary[600]} />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Profil introuvable</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Image 
            source={{ uri: profile.avatarUrl || profile.logoUrl || 'https://placehold.co/200x200/D49A25/FFFFFF/png?text=' + encodeURIComponent(profile.name) }} 
            style={styles.avatar} 
          />
          
          <View style={styles.badgesRow}>
            <View style={[styles.badge, profile.type === 'COMPANY' ? styles.badgeCompany : styles.badgeSolo]}>
              <Text style={[styles.badgeText, profile.type === 'COMPANY' ? styles.badgeTextCompany : styles.badgeTextSolo]}>
                {profile.type === 'COMPANY' ? (profile.isInformal ? 'COLLECTIF' : 'ENTREPRISE') : 'INDÉPENDANT'}
              </Text>
            </View>
            {profile.isVerified && (
              <View style={styles.verifiedBadge}>
                <ShieldCheck size={14} color={colors.success} />
                <Text style={styles.verifiedText}>Vérifié</Text>
              </View>
            )}
          </View>

          <Text style={styles.name}>{profile.name}</Text>
          {profile.profession && (
            <Text style={styles.profession}>{profile.profession}</Text>
          )}

          <View style={styles.ratingContainer}>
            <Star size={16} color={colors.warning} fill={colors.warning} />
            <Text style={styles.ratingText}>4.9</Text>
            <Text style={styles.ratingDesc}>(Avis client)</Text>
          </View>

          <Text style={styles.bio}>
            {profile.bio || 'Aucune description disponible pour ce prestataire.'}
          </Text>

          <View style={styles.contactContainer}>
            <View style={styles.contactRow}>
              <Mail size={16} color={colors.slate[500]} />
              <Text style={styles.contactText}>{profile.email}</Text>
            </View>
            {profile.phone && (
              <View style={styles.contactRow}>
                <Phone size={16} color={colors.slate[500]} />
                <Text style={styles.contactText}>{profile.phone}</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.slate[50] },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 16, color: colors.slate[500] },
  container: { padding: 16 },
  card: { backgroundColor: colors.white, borderRadius: 24, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: colors.slate[200], shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 16, borderWidth: 1, borderColor: colors.slate[100] },
  badgesRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeCompany: { backgroundColor: '#DBEAFE' }, // blue-100
  badgeSolo: { backgroundColor: '#FEF3C7' }, // amber-100
  badgeText: { fontSize: 10, fontWeight: '700' },
  badgeTextCompany: { color: '#1E40AF' }, // blue-800
  badgeTextSolo: { color: '#92400E' }, // amber-800
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, gap: 4 },
  verifiedText: { fontSize: 10, color: '#15803D', fontWeight: '700' },
  name: { fontSize: 24, fontWeight: '800', color: colors.slate[900], marginBottom: 4, textAlign: 'center' },
  profession: { fontSize: 16, fontWeight: '600', color: colors.primary[600], marginBottom: 8, textAlign: 'center' },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 16 },
  ratingText: { fontSize: 14, fontWeight: '700', color: colors.slate[800] },
  ratingDesc: { fontSize: 12, color: colors.slate[400] },
  bio: { fontSize: 15, color: colors.slate[600], lineHeight: 22, textAlign: 'center', marginBottom: 24 },
  contactContainer: { width: '100%', borderTopWidth: 1, borderTopColor: colors.slate[100], paddingTop: 16, gap: 12 },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: 12, justifyContent: 'center' },
  contactText: { fontSize: 14, color: colors.slate[700] },
});
