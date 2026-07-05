import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>

        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>User</Text>
          </View>
        </View>

        {/* Risk Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🛡 Current Risk Level</Text>
          <View style={styles.riskCircle}>
            <Text style={styles.riskLabel}>Low</Text>
          </View>
          <Text style={styles.cardDesc}>
            Your current area is relatively safe. Stay aware of your surroundings.
          </Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>24</Text>
            <Text style={styles.statLabel}>Reports Today</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Active Zones</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>92%</Text>
            <Text style={styles.statLabel}>Safe Areas</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>🗺</Text>
            <Text style={styles.actionLabel}>Live Map</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>🛡</Text>
            <Text style={styles.actionLabel}>Risk Score</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionLabel}>Community</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>🤖</Text>
            <Text style={styles.actionLabel}>AI Insights</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0a101d' },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeText: { color: '#94a3b8', fontSize: 16 },
  userName: { color: '#ffffff', fontSize: 24, fontWeight: 'bold' },
  card: {
    backgroundColor: '#16223d',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.15)',
    alignItems: 'center',
  },
  cardTitle: { color: '#ffffff', fontSize: 18, fontWeight: 'bold', marginBottom: 16, alignSelf: 'flex-start' },
  riskCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#00e5ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  riskLabel: { color: '#00e5ff', fontSize: 28, fontWeight: 'bold' },
  cardDesc: { color: '#94a3b8', textAlign: 'center', lineHeight: 20 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  statCard: {
    flex: 1,
    backgroundColor: '#16223d',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.15)',
  },
  statValue: { color: '#00e5ff', fontSize: 22, fontWeight: 'bold' },
  statLabel: { color: '#94a3b8', fontSize: 11, marginTop: 4, textAlign: 'center' },
  sectionTitle: { color: '#ffffff', fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  actionsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  actionCard: {
    width: '48%',
    backgroundColor: '#16223d',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.15)',
  },
  actionIcon: { fontSize: 28, marginBottom: 8 },
  actionLabel: { color: '#ffffff', fontWeight: '600' },
});
