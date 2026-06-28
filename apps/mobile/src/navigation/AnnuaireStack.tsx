import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AnnuaireScreen } from '../screens/main/AnnuaireScreen';
import { AnnuaireDetailScreen } from '../screens/main/AnnuaireDetailScreen';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator();

export const AnnuaireStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.slate[50],
        },
        headerShadowVisible: false,
        headerTintColor: colors.slate[900],
        headerTitleStyle: {
          fontWeight: '700',
        },
      }}
    >
      <Stack.Screen 
        name="AnnuaireMain" 
        component={AnnuaireScreen} 
        options={{ title: 'Annuaire' }} 
      />
      <Stack.Screen 
        name="AnnuaireDetail" 
        component={AnnuaireDetailScreen} 
        options={{ title: 'Profil' }} 
      />
    </Stack.Navigator>
  );
};
