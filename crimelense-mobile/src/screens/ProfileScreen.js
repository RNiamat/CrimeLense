import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  const infoRows = [
    { label: 'Name', value: user?.name || 'N/A' },
    { label: 'Email', value: user?.email || 'N/A' },
    { label: 'Role', value: user?.role || 'user' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarLetter}>{(user?.name || 'U')[0].toUpperCase()}</Text>
          </View>
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{user?.role === 'admin' ? '⚡ Admin' : '👤 Member'}</Text>
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Account Details</Text>
          {infoRows.map((row) => (
            <View key={row.label} style={styles.infoRow}>
              <Text style={styles.infoLabel}>{row.label}</Text>
              <Text style={styles.infoValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <Text style={styles.cardTitle}>Activity</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Reports</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Reactions</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Routes</Text>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0a101d' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  avatarSection: { alignItems: 'center', paddingVertical: 32 },
  avatarCircle: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: '#00e5ff', alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
  },
  avatarLetter: { color: '#0a101d', fontSize: 40, fontWeight: 'bold' },
  userName: { color: '#ffffff', fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  roleBadge: {
    backgroundColor: 'rgba(0,229,255,0.15)', paddingHorizontal: 16,
    paddingVertical: 4, borderRadius: 20,
  },
  roleText: { color: '#00e5ff', fontSize: 13, fontWeight: '600' },
  infoCard: {
    backgroundColor: '#16223d', borderRadius: 16, padding: 20,
    marginBottom: 16, borderWidth: 1, borderColor: 'rgba(0,229,255,0.1)',
  },
  cardTitle: { color: '#ffffff', fontSize: 16, fontWeight: 'bold', marginBottom: 16 },
  infoRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  infoLabel: { color: '#94a3b8' },
  infoValue: { color: '#ffffff', fontWeight: '500' },
  statsCard: {
    backgroundColor: '#16223d', borderRadius: 16, padding: 20,
    marginBottom: 24, borderWidth: 1, borderColor: 'rgba(0,229,255,0.1)',
  },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: { color: '#00e5ff', fontSize: 24, fontWeight: 'bold' },
  statLabel: { color: '#94a3b8', fontSize: 12, marginTop: 4 },
  statDivider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.05)' },
  logoutBtn: {
    backgroundColor: 'rgba(255,79,106,0.15)', borderWidth: 1,
    borderColor: '#ff4f6a', borderRadius: 12, padding: 16, alignItems: 'center',
  },
  logoutText: { color: '#ff4f6a', fontWeight: 'bold', fontSize: 16 },
});
