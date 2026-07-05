import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Alert, StyleSheet, ActivityIndicator, Modal, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['All', 'Theft', 'Vandalism', 'Suspicious Activity', 'Assault', 'Other'];

export default function CommunityFeedScreen() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [catFilter, setCatFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [newPost, setNewPost] = useState({ content: '', category: 'Suspicious Activity' });
  const [submitting, setSubmitting] = useState(false);

  const fetchPosts = async () => {
    try {
      const res = await api.get('/community');
      setPosts(res.data || []);
    } catch (e) {
      console.log('Feed error', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleReact = async (postId) => {
    try {
      await api.post(`/community/${postId}/react`);
      fetchPosts();
    } catch (e) { console.log(e); }
  };

  const handleDelete = async (postId) => {
    Alert.alert('Delete', 'Remove this post?', [
      { text: 'Cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          await api.delete(`/community/${postId}`);
          fetchPosts();
        }
      }
    ]);
  };

  const handleSubmit = async () => {
    if (!newPost.content.trim()) return;
    setSubmitting(true);
    try {
      await api.post('/community', newPost);
      setShowModal(false);
      setNewPost({ content: '', category: 'Suspicious Activity' });
      fetchPosts();
    } catch (e) {
      Alert.alert('Error', 'Could not post observation');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = catFilter === 'All' ? posts : posts.filter(p => p.category === catFilter);

  const renderPost = ({ item }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>{item.category}</Text>
        </View>
        <Text style={styles.postTime}>{new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>
      <Text style={styles.postContent}>{item.content}</Text>
      <View style={styles.postFooter}>
        <TouchableOpacity style={styles.reactBtn} onPress={() => handleReact(item._id)}>
          <Text style={styles.reactText}>👁 {item.reactions || 0} noticed this</Text>
        </TouchableOpacity>
        {user?.role === 'admin' && (
          <TouchableOpacity onPress={() => handleDelete(item._id)}>
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Neighborhood <Text style={styles.titleAccent}>Watch</Text></Text>
        <TouchableOpacity style={styles.reportBtn} onPress={() => setShowModal(true)}>
          <Text style={styles.reportBtnText}>+ Report</Text>
        </TouchableOpacity>
      </View>

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
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item._id}
          renderItem={renderPost}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={<Text style={styles.emptyText}>No observations yet.</Text>}
        />
      )}

      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Report Observation</Text>
            <TextInput
              style={styles.textarea}
              placeholder="Describe what you observed..."
              placeholderTextColor="#475569"
              multiline
              numberOfLines={4}
              value={newPost.content}
              onChangeText={t => setNewPost(p => ({ ...p, content: t }))}
            />
            <Text style={styles.modalLabel}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
              {CATEGORIES.filter(c => c !== 'All').map(cat => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setNewPost(p => ({ ...p, category: cat }))}
                  style={[styles.filterBtn, newPost.category === cat && styles.filterBtnActive, { marginBottom: 0 }]}
                >
                  <Text style={[styles.filterText, newPost.category === cat && styles.filterTextActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowModal(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={submitting}>
                {submitting ? <ActivityIndicator color="#0a101d" /> : <Text style={styles.submitBtnText}>Submit</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0a101d' },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16 },
  title: { color: '#ffffff', fontSize: 22, fontWeight: 'bold' },
  titleAccent: { color: '#00e5ff' },
  reportBtn: { backgroundColor: '#00e5ff', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  reportBtnText: { color: '#0a101d', fontWeight: 'bold' },
  filterRow: { paddingHorizontal: 16, paddingVertical: 12 },
  filterBtn: {
    paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20,
    borderWidth: 1, borderColor: 'rgba(0,229,255,0.3)', marginRight: 8,
  },
  filterBtnActive: { backgroundColor: '#00e5ff' },
  filterText: { color: '#94a3b8', fontSize: 12, fontWeight: '600' },
  filterTextActive: { color: '#0a101d' },
  postCard: {
    backgroundColor: '#16223d', borderRadius: 12, padding: 16,
    marginBottom: 12, borderWidth: 1, borderColor: 'rgba(0,229,255,0.1)',
  },
  postHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  categoryBadge: { backgroundColor: 'rgba(0,229,255,0.15)', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  categoryBadgeText: { color: '#00e5ff', fontSize: 11, fontWeight: '600' },
  postTime: { color: '#475569', fontSize: 12 },
  postContent: { color: '#ffffff', lineHeight: 20, marginBottom: 12 },
  postFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reactBtn: { flexDirection: 'row', alignItems: 'center' },
  reactText: { color: '#94a3b8', fontSize: 13 },
  deleteText: { color: '#ff4f6a', fontSize: 13 },
  emptyText: { color: '#94a3b8', textAlign: 'center', marginTop: 48 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#10182b', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
  modalTitle: { color: '#ffffff', fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  textarea: {
    backgroundColor: '#16223d', color: '#ffffff', borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: 'rgba(0,229,255,0.2)', textAlignVertical: 'top', marginBottom: 16, minHeight: 100,
  },
  modalLabel: { color: '#94a3b8', marginBottom: 8 },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  cancelBtn: { flex: 1, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(0,229,255,0.3)', alignItems: 'center' },
  cancelBtnText: { color: '#94a3b8', fontWeight: '600' },
  submitBtn: { flex: 1, backgroundColor: '#00e5ff', padding: 14, borderRadius: 12, alignItems: 'center' },
  submitBtnText: { color: '#0a101d', fontWeight: 'bold' },
});
