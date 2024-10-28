import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthScreen = ({ onAuthenticated }) => {
  const [isCompatible, setIsCompatible] = useState(false);
  const [authTypes, setAuthTypes] = useState([]);

  useEffect(() => {
    checkDeviceCompatibility();
  }, []);

  const checkDeviceCompatibility = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    setIsCompatible(compatible);

    if (compatible) {
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
      setAuthTypes(supportedTypes);
      
      // Start authentication immediately when component mounts
      authenticateUser();
    }
  };

  const authenticateUser = async () => {
    try {
      const authResult = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Please authenticate to access your passwords',
        disableDeviceFallback: false,
        cancelLabel: 'Cancel',
      });

      if (authResult.success) {
        onAuthenticated(true);
      } else {
        // If authentication fails, retry after a short delay
        setTimeout(authenticateUser, 1000);
      }
    } catch (error) {
      Alert.alert(
        'Authentication Error',
        'There was an error during authentication. Please try again.',
        [{ text: 'Retry', onPress: authenticateUser }]
      );
    }
  };

  const getAuthTypesText = () => {
    const types = [];
    if (authTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      types.push('Fingerprint');
    }
    if (authTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      types.push('Face ID');
    }
    if (authTypes.includes(LocalAuthentication.AuthenticationType.IRIS)) {
      types.push('Iris');
    }
    return types.join(', ');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Password Manager</Text>
      <Text style={styles.subtitle}>
        {isCompatible
          ? `Please authenticate using ${getAuthTypesText()}`
          : 'Your device does not support biometric authentication'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
});

export default AuthScreen;