import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import client from '../api/client';
import { theme } from '../theme/colors';

export default function PaymentScreen() {
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<any>(null);

  const simulatePayment = async () => {
    setLoading(true);
    try {
      // On simule l'achat d'un service/produit
      const payload = {
        amount: 5000,
        provider: 'TMONEY',
        phone: '+22890000000',
      };
      const res = await client.post('/payment/initiate', payload);
      setPaymentStatus(res.data);
      Alert.alert('Initiation réussie', 'Votre paiement a été initié et l\'argent est sous séquestre (Escrow).');
    } catch (e: any) {
      Alert.alert('Erreur', e.response?.data?.message || 'Erreur de paiement');
    } finally {
      setLoading(false);
    }
  };

  const releaseEscrow = async () => {
    if (!paymentStatus?.paymentId) return;
    setLoading(true);
    try {
      await client.post(`/payment/${paymentStatus.paymentId}/release`);
      Alert.alert('Fonds débloqués', 'L\'argent a été transféré au vendeur avec succès.');
      setPaymentStatus(null); // Reset
    } catch (e: any) {
      Alert.alert('Erreur', e.response?.data?.message || 'Erreur lors du déblocage');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Simulateur de Paiement</Text>
      <Text style={styles.subtitle}>Test de l'architecture d'Escrow (Sprint 1.7)</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Commande de Test</Text>
        <Text style={styles.price}>5 000 FCFA</Text>
        <Text style={styles.cardDesc}>Achat d'un produit fictif via Mobile Money.</Text>

        {!paymentStatus ? (
          <TouchableOpacity style={styles.payButton} onPress={simulatePayment} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.payText}>Payer avec TMoney</Text>}
          </TouchableOpacity>
        ) : (
          <View style={styles.successBox}>
            <Text style={styles.successTitle}>Paiement en Séquestre (Escrow)</Text>
            <Text style={styles.successDesc}>L'argent est bloqué. En tant qu'acheteur, cliquez ci-dessous lorsque vous avez reçu la commande.</Text>
            
            <TouchableOpacity style={styles.releaseButton} onPress={releaseEscrow} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.releaseText}>J'ai reçu ma commande</Text>}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: theme.colors.background },
  title: { fontSize: 24, fontWeight: 'bold', color: theme.colors.text },
  subtitle: { fontSize: 14, color: theme.colors.textSecondary, marginBottom: 24 },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  price: { fontSize: 28, fontWeight: 'bold', color: theme.colors.primary, marginBottom: 16 },
  cardDesc: { color: theme.colors.textSecondary, marginBottom: 24 },
  payButton: { backgroundColor: theme.colors.primary, padding: 16, borderRadius: 8, alignItems: 'center' },
  payText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  successBox: { backgroundColor: '#f0fdf4', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#bbf7d0' },
  successTitle: { fontWeight: 'bold', color: '#166534', marginBottom: 8 },
  successDesc: { color: '#15803d', fontSize: 14, marginBottom: 16 },
  releaseButton: { backgroundColor: '#16a34a', padding: 16, borderRadius: 8, alignItems: 'center' },
  releaseText: { color: '#fff', fontWeight: 'bold' }
});
