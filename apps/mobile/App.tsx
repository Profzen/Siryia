import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { theme } from './src/theme/colors';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Top Accent Line */}
      <View style={styles.topAccent} />

      <View style={styles.content}>
        {/* Header/Logo placeholder */}
        <View style={styles.header}>
          <View style={styles.logoBox}>
            <Text style={styles.logoStar}>✨</Text>
          </View>
          <Text style={styles.title}>Siryia</Text>
        </View>

        <View style={styles.main}>
          <Text style={styles.heading}>Le Hub Africain du</Text>
          <Text style={styles.headingHighlight}>Commerce & Services</Text>
          
          <Text style={styles.subtitle}>
            Plateforme B2B et B2C pro, fluide et sécurisée.
          </Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Application Mobile Squelette</Text>
            <Text style={styles.cardText}>
              Le design system est synchronisé avec la version web.
              (Bleu Corporate, Or, Blanc).
            </Text>
          </View>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Connexion / Inscription</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  topAccent: {
    height: 4,
    backgroundColor: theme.colors.accent,
    width: '100%',
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
    marginTop: theme.spacing.md,
  },
  logoBox: {
    width: 32,
    height: 32,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  logoStar: {
    color: theme.colors.textInverse,
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  main: {
    flex: 1,
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  headingHighlight: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xxl,
    lineHeight: 24,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  cardText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: theme.spacing.xl,
  },
  buttonText: {
    color: theme.colors.textInverse,
    fontSize: 16,
    fontWeight: '600',
  },
});
