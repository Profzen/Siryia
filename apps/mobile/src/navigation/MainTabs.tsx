import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, UserCheck, CreditCard, User } from 'lucide-react-native';
import DashboardScreen from '../screens/DashboardScreen';
import KycScreen from '../screens/KycScreen';
import PaymentScreen from '../screens/PaymentScreen';
import { theme } from '../theme/colors';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerTintColor: theme.colors.primary,
        headerTitleStyle: { fontWeight: 'bold' },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          borderTopColor: theme.colors.border,
          elevation: 0, // Enlever l'ombre Android
        },
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          title: "Accueil"
        }}
      />
      <Tab.Screen 
        name="KYC" 
        component={KycScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <UserCheck color={color} size={size} />,
          title: "Vérification"
        }}
      />
      <Tab.Screen 
        name="Paiement" 
        component={PaymentScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <CreditCard color={color} size={size} />,
          title: "Paiements"
        }}
      />
    </Tab.Navigator>
  );
}
