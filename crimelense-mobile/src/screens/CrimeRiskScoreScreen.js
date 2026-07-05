import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../services/api';

const RISK_COLORS = { High: '#ff4f6a', Medium: '#ffa500', Low: '#00e5ff' };

export default function CrimeRiskScoreScreen() {
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!location.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await api.get(`/risk-score?area=${encodeURIComponent(location)}`);
      setResult(res.data);
    } catch (e) {
      setError('Could not fetch risk data. Try another area.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Crime <Text style={styles.titleAccent}>Risk Score</Text></Text>
        <Text style={styles.subtitle}>Analyze safety levels for any area</Text>

        <View style={styles.searchRow}>
          <TextInput
            style={styles.input}
            placeholder="Enter area or locality..."
            placeholderTextColor="#475569"
            value={location}
            onChangeText={setLocation}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
            <Text style={styles.searchBtnText}>Analyze</Text>
          </TouchableOpacity>
        </View>

        {loading && <ActivityIndicator color="#00e5ff" style={{ marginTop: 32 }} />}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {result && (
          <View style={styles.resultCard}>
            <Text style={styles.resultArea}>{result.area}</Text>
            <View style={[styles.riskBadge, { backgroundColor: RISK_COLORS[result.riskLevel] || '#00e5ff' }]}>
              <Text style={styles.riskBadgeText}>{result.riskLevel} Risk</Text>
            </View>
            <View style={styles.scoreRow}>
              <Text style={styles.scoreLabel}>Safety Score</Text>
              <Text style={[styles.scoreValue, { color: RISK_COLORS[result.riskLevel] }]}>{result.safetyScore}/100</Text>
            </View>
            {result.categories && (
              <View style={styles.categoriesContainer}>
                {result.categories.map((cat, i) => (
                  <View key={i} style={styles.categoryRow}>
                    <Text style={styles.categoryName}>{cat.name}</Text>
                    <Text style={styles.categoryCount}>{cat.count} reports</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {!result && !loading && (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderIcon}>🛡</Text>
            <Text style={styles.placeholderText}>Enter an area name to analyze crime risk levels and safety scores.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0a101d' },
  scrollContent: { padding: 16 },
  title: { color: '#ffffff', fontSize: 26, fontWeight: 'bold', marginBottom: 4 },
  titleAccent: { color: '#ff4f6a' },
  subtitle: { color: '#94a3b8', marginBottom: 20 },
  searchRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  input: {
    flex: 1,
    backgroundColor: '#16223d',
    color: '#ffffff',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,229,255,0.2)',
    fontSize: 15,
  },
  searchBtn: {
    backgroundColor: '#00e5ff',
    paddingHorizontal: 16,
    borderRadius: 12,
    justifyContent: 'center',
  },
  searchBtnText: { color: '#0a101d', fontWeight: 'bold', fontSize: 14 },
  errorText: { color: '#ff4f6a', textAlign: 'center', marginTop: 16 },
  resultCard: {
    backgroundColor: '#16223d',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,229,255,0.15)',
    marginTop: 16,
  },
  resultArea: { color: '#ffffff', fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  riskBadge: { alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginBottom: 16 },
  riskBadgeText: { color: '#ffffff', fontWeight: 'bold' },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  scoreLabel: { color: '#94a3b8', fontSize: 16 },
  scoreValue: { fontSize: 20, fontWeight: 'bold' },
  categoriesContainer: { borderTopWidth: 1, borderTopColor: 'rgba(0,229,255,0.1)', paddingTop: 12 },
  categoryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  categoryName: { color: '#ffffff' },
  categoryCount: { color: '#94a3b8' },
  placeholder: { alignItems: 'center', marginTop: 60 },
  placeholderIcon: { fontSize: 60, marginBottom: 16 },
  placeholderText: { color: '#94a3b8', textAlign: 'center', lineHeight: 22 },
});
