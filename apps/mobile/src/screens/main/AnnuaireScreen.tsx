import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Search, ShieldCheck, Star } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { Input } from '../../components/Input';
import api from '../../api/client';

export const AnnuaireScreen = () => {
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'ALL' | 'SOLO' | 'COMPANY'>('ALL');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();

  const fetchResults = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (query) queryParams.set('q', query);
      if (type !== 'ALL') queryParams.set('type', type);
      
      const response = await api.get(`/annuaire?${queryParams.toString()}`);
      setResults(response.data);
    } catch (error) {
      console.error('Annuaire fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [query, type]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('AnnuaireDetail', { id: item.id, type: item.type })}
    >
      <View style={styles.cardHeader}>
        <Image source={{ uri: item.logoUrl }} style={styles.avatar} />
        <View style={styles.cardHeaderRight}>
          <View style={[styles.badge, item.type === 'COMPANY' ? styles.badgeCompany : styles.badgeSolo]}>
            <Text style={[styles.badgeText, item.type === 'COMPANY' ? styles.badgeTextCompany : styles.badgeTextSolo]}>
              {item.type === 'COMPANY' ? (item.isInformal ? 'COLLECTIF' : 'ENTREPRISE') : 'INDÉPENDANT'}
            </Text>
          </View>
          {item.isVerified && (
            <View style={styles.verifiedBadge}>
              <ShieldCheck size={12} color={colors.success} />
              <Text style={styles.verifiedText}>Vérifié</Text>
            </View>
          )}
        </View>
      </View>

      <Text style={styles.name}>{item.name}</Text>
      {item.profession && (
        <Text style={styles.profession}>{item.profession}</Text>
      )}

      <View style={styles.ratingContainer}>
        <Star size={14} color={colors.warning} fill={colors.warning} />
        <Text style={styles.ratingText}>{item.rating}</Text>
      </View>

      <Text style={styles.bio} numberOfLines={2}>{item.bio}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Input
          placeholder="Rechercher (métier, nom...)"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={fetchResults}
        />
        <View style={styles.filters}>
          <TouchableOpacity 
            style={[styles.filterBtn, type === 'ALL' && styles.filterBtnActive]}
            onPress={() => setType('ALL')}
          >
            <Text style={[styles.filterText, type === 'ALL' && styles.filterTextActive]}>Tous</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterBtn, type === 'SOLO' && styles.filterBtnActive]}
            onPress={() => setType('SOLO')}
          >
            <Text style={[styles.filterText, type === 'SOLO' && styles.filterTextActive]}>Indépendants</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterBtn, type === 'COMPANY' && styles.filterBtnActive]}
            onPress={() => setType('COMPANY')}
          >
            <Text style={[styles.filterText, type === 'COMPANY' && styles.filterTextActive]}>Entreprises</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary[600]} />
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>Aucun professionnel trouvé.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.slate[50] },
  header: { padding: 16, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.slate[200] },
  filters: { flexDirection: 'row', marginTop: 12, gap: 8 },
  filterBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16, borderWidth: 1, borderColor: colors.slate[200] },
  filterBtnActive: { backgroundColor: colors.primary[50], borderColor: colors.primary[600] },
  filterText: { fontSize: 12, color: colors.slate[600], fontWeight: '500' },
  filterTextActive: { color: colors.primary[700], fontWeight: '700' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  listContainer: { padding: 16, gap: 16 },
  card: { backgroundColor: colors.white, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.slate[200], shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  avatar: { width: 48, height: 48, borderRadius: 12, backgroundColor: colors.slate[100] },
  cardHeaderRight: { alignItems: 'flex-end', gap: 4 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  badgeCompany: { backgroundColor: '#DBEAFE' }, // blue-100
  badgeSolo: { backgroundColor: '#FEF3C7' }, // amber-100
  badgeText: { fontSize: 10, fontWeight: '700' },
  badgeTextCompany: { color: '#1E40AF' }, // blue-800
  badgeTextSolo: { color: '#92400E' }, // amber-800
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#DCFCE7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 12, gap: 2 }, // green-50
  verifiedText: { fontSize: 10, color: '#15803D', fontWeight: '600' }, // green-700
  name: { fontSize: 18, fontWeight: '700', color: colors.slate[900], marginBottom: 2 },
  profession: { fontSize: 14, fontWeight: '600', color: colors.primary[600], marginBottom: 4 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 },
  ratingText: { fontSize: 12, fontWeight: '600', color: colors.slate[800] },
  bio: { fontSize: 14, color: colors.slate[600], lineHeight: 20 },
  emptyText: { color: colors.slate[500], fontSize: 16 },
});
