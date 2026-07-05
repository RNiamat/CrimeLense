import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Circle, PROVIDER_DEFAULT } from 'react-native-maps';
import api from '../services/api';

const TIER_COLORS = {
  HIGH: 'rgba(255, 79, 106, 0.35)',
  MEDIUM: 'rgba(255, 165, 0, 0.3)',
  LOW: 'rgba(0, 229, 255, 0.2)',
};
const TIER_BORDER = {
  HIGH: '#ff4f6a',
  MEDIUM: '#ffa500',
  LOW: '#00e5ff',
};

export default function LiveMapScreen() {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tierFilter, setTierFilter] = useState('ALL');

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const res = await api.get('/hotspots');
        setZones(res.data || []);
      } catch (e) {
        console.log('Map fetch error', e);
      } finally {
        setLoading(false);
      }
    };
    fetchZones();
  }, []);

  const filtered = tierFilter === 'ALL' ? zones : zones.filter(z => z.tier === tierFilter);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Live <Text style={styles.titleAccent}>Risk Map</Text></Text>
        <Text style={styles.subtitle}>Real crime hotspot clusters from DBSCAN analysis.</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map(t => (
            <TouchableOpacity
              key={t}
              onPress={() => setTierFilter(t)}
              style={[styles.filterBtn, tierFilter === t && styles.filterBtnActive]}
            >
              <Text style={[styles.filterText, tierFilter === t && styles.filterTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#00e5ff" />
        </View>
      ) : (
        <MapView
          style={styles.map}
          provider={PROVIDER_DEFAULT}
          initialRegion={{ latitude: 31.5204, longitude: 74.3587, latitudeDelta: 0.15, longitudeDelta: 0.15 }}
        >
          {filtered.map((zone, i) => (
            <Circle
              key={i}
              center={{ latitude: zone.lat, longitude: zone.lng }}
              radius={zone.radius || 500}
              fillColor={TIER_COLORS[zone.tier] || 'rgba(0,229,255,0.2)'}
              strokeColor={TIER_BORDER[zone.tier] || '#00e5ff'}
              strokeWidth={2}
            />
          ))}
        </MapView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0a101d' },
  header: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  title: { color: '#ffffff', fontSize: 22, fontWeight: 'bold' },
  titleAccent: { color: '#0ea5e9' },
  subtitle: { color: '#94a3b8', fontSize: 12, marginTop: 4 },
  filterRow: { marginTop: 12, marginBottom: 4 },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,229,255,0.3)',
    marginRight: 8,
  },
  filterBtnActive: { backgroundColor: '#00e5ff' },
  filterText: { color: '#94a3b8', fontSize: 12, fontWeight: '600' },
  filterTextActive: { color: '#0a101d' },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  map: { flex: 1 },
});
