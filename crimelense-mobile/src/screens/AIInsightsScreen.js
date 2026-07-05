import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../services/api';

const CATEGORIES = ['All', 'Theft', 'Assault', 'Vandalism', 'Fraud', 'Burglary'];

const INSIGHT_COLORS = {
  Theft: '#00e5ff',
  Assault: '#ff4f6a',
  Vandalism: '#ffa500',
  Fraud: '#a855f7',
  Burglary: '#f97316',
};

export default function AIInsightsScreen() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [catFilter, setCatFilter] = useState('All');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await api.get('/insights');
        setInsights(res.data || []);
      } catch (e) {
        console.log('Insights error', e);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  const filtered = catFilter === 'All' ? insights : insights.filter(i => i.category === catFilter);

  const toggleExpand = (id) => setExpanded(prev => (prev === id ? null : id));

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>AI <Text style={styles.titleAccent}>Insights</Text></Text>
        <Text style={styles.subtitle}>Machine learning crime pattern analysis</Text>

        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{insights.length}</Text>
            <Text style={styles.summaryLabel}>Insights</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>🤖</Text>
            <Text style={styles.summaryLabel}>ML Powered</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>Live</Text>
            <Text style={styles.summaryLabel}>Status</Text>
          </View>
        </View>

        {/* Category Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              onPress={() => setCatFilter(cat)}
              style={[styles.filterBtn, catFilter === cat && styles.filterBtnActive]}
            >
              <Text style={[styles.filterText, catFilter === cat && styles.filterTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {loading ? (
          <ActivityIndicator color="#00e5ff" style={{ marginTop: 32 }} />
        ) : filtered.length === 0 ? (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderIcon}>🤖</Text>
            <Text style={styles.placeholderText}>No insights available for this category.</Text>
          </View>
        ) : (
          filtered.map((item) => {
            const isOpen = expanded === item._id;
            const color = INSIGHT_COLORS[item.category] || '#00e5ff';
            return (
              <TouchableOpacity
                key={item._id}
                style={[styles.insightCard, { borderLeftColor: color }]}
                onPress={() => toggleExpand(item._id)}
                activeOpacity={0.8}
              >
                <View style={styles.insightHeader}>
                  <View style={[styles.categoryDot, { backgroundColor: color }]} />
                  <Text style={styles.insightTitle}>{item.title || item.category}</Text>
                  <Text style={styles.chevron}>{isOpen ? '▲' : '▼'}</Text>
                </View>
                {isOpen && (
                  <View style={styles.insightBody}>
                    <Text style={styles.insightDesc}>{item.description || item.summary}</Text>
                    {item.confidence && (
                      <View style={styles.confidenceRow}>
                        <Text style={styles.confidenceLabel}>Confidence</Text>
                        <Text style={[styles.confidenceValue, { color }]}>{item.confidence}%</Text>
                      </View>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0a101d' },
  scrollContent: { padding: 16, paddingBottom: 32 },
  title: { color: '#ffffff', fontSize: 26, fontWeight: 'bold', marginBottom: 4 },
  titleAccent: { color: '#a855f7' },
  subtitle: { color: '#94a3b8', marginBottom: 20 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  summaryCard: {
    flex: 1, backgroundColor: '#16223d', borderRadius: 12, padding: 14,
    alignItems: 'center', marginHorizontal: 4,
    borderWidth: 1, borderColor: 'rgba(0,229,255,0.1)',
  },
  summaryValue: { color: '#00e5ff', fontSize: 20, fontWeight: 'bold' },
  summaryLabel: { color: '#94a3b8', fontSize: 11, marginTop: 4 },
  filterRow: { marginBottom: 16 },
  filterBtn: {
    paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20,
    borderWidth: 1, borderColor: 'rgba(0,229,255,0.3)', marginRight: 8,
  },
  filterBtnActive: { backgroundColor: '#00e5ff' },
  filterText: { color: '#94a3b8', fontSize: 12, fontWeight: '600' },
  filterTextActive: { color: '#0a101d' },
  insightCard: {
    backgroundColor: '#16223d', borderRadius: 12, padding: 16,
    marginBottom: 10, borderWidth: 1, borderColor: 'rgba(0,229,255,0.1)',
    borderLeftWidth: 4,
  },
  insightHeader: { flexDirection: 'row', alignItems: 'center' },
  categoryDot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  insightTitle: { flex: 1, color: '#ffffff', fontWeight: '600', fontSize: 15 },
  chevron: { color: '#94a3b8', fontSize: 12 },
  insightBody: { marginTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 12 },
  insightDesc: { color: '#94a3b8', lineHeight: 20, marginBottom: 12 },
  confidenceRow: { flexDirection: 'row', justifyContent: 'space-between' },
  confidenceLabel: { color: '#94a3b8' },
  confidenceValue: { fontWeight: 'bold', fontSize: 16 },
  placeholder: { alignItems: 'center', marginTop: 60 },
  placeholderIcon: { fontSize: 60, marginBottom: 16 },
  placeholderText: { color: '#94a3b8', textAlign: 'center' },
});
