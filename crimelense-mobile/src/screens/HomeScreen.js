import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>
            Crime<Text style={styles.titleAccent}>Lense</Text>
          </Text>
          <Text style={styles.subtitle}>
            AI-powered safety intelligence at your fingertips.
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.primaryButtonText}>Sign In</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Signup')}
        >
          <Text style={styles.secondaryButtonText}>Create Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a101d',
  },
  scrollContent: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  titleAccent: {
    color: '#00e5ff',
  },
  subtitle: {
    color: '#94a3b8',
    textAlign: 'center',
    fontSize: 18,
  },
  primaryButton: {
    backgroundColor: '#00e5ff',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#0a101d',
    fontWeight: 'bold',
    fontSize: 18,
  },
  secondaryButton: {
    borderColor: '#00e5ff',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#00e5ff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
