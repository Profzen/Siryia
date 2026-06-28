import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileScreen } from '../screens/main/ProfileScreen';
import { EditProfileScreen } from '../screens/main/EditProfileScreen';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator();

export const ProfileStack = () => {
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
        name="ProfileMain" 
        component={ProfileScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen} 
        options={{ title: 'Modifier Profil' }} 
      />
    </Stack.Navigator>
  );
};
