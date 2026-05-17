import { useState, useEffect } from 'react'
import {
  View, Text, StyleSheet, FlatList,
} from 'react-native'
import { colors } from '../../../shared/colors'
import { getToken } from '../../../shared/api'

const API_BASE = __DEV__
  ? 'http://192.168.0.100:6868/api'
  : 'https://taxi-mouine.de/api'

const statusLabels = {
  completed: 'Abgeschlossen',
  cancelled: 'Storniert',
}

export default function DriverHistoryScreen() {
  const [rides, setRides] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalEarnings, setTotalEarnings] = useState(0)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_BASE}/driver/rides/history`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        })
        const data = await res.json()
        if (data.success) {
          setRides(data.rides)
          const earnings = data.rides
            .filter(r => r.status === 'completed')
            .reduce((sum, r) => sum + (r.actualFare || r.estimatedFare || 0), 0)
          setTotalEarnings(earnings)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.earningsCard}>
        <Text style={styles.earningsLabel}>Gesamteinnahmen</Text>
        <Text style={styles.earningsValue}>€{totalEarnings.toFixed(2)}</Text>
        <Text style={styles.earningsCount}>{rides.filter(r => r.status === 'completed').length} Fahrten</Text>
      </View>

      {rides.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>Noch keine Fahrten</Text>
        </View>
      ) : (
        <FlatList
          data={rides}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.addresses}>
                  <Text style={styles.address} numberOfLines={1}>
                    {item.pickup.address || `${item.pickup.lat.toFixed(4)}, ${item.pickup.lng.toFixed(4)}`}
                  </Text>
                  <Text style={styles.address} numberOfLines={1}>
                    → {item.dropoff.address || `${item.dropoff.lat.toFixed(4)}, ${item.dropoff.lng.toFixed(4)}`}
                  </Text>
                </View>
                <View style={[styles.badge, { backgroundColor: item.status === 'completed' ? '#D1FAE5' : '#FEE2E2' }]}>
                  <Text style={[styles.badgeText, { color: item.status === 'completed' ? colors.green : colors.red }]}>
                    {statusLabels[item.status] || item.status}
                  </Text>
                </View>
              </View>
              <View style={styles.cardFooter}>
                <Text style={styles.date}>
                  {new Date(item.bookedAt).toLocaleDateString('de-DE')}
                </Text>
                <Text style={styles.fare}>€{(item.actualFare || item.estimatedFare || 0).toFixed(2)}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: colors.gray },
  earningsCard: {
    backgroundColor: colors.green,
    margin: 16,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  earningsLabel: { color: '#D1FAE5', fontSize: 14 },
  earningsValue: { color: '#fff', fontSize: 36, fontWeight: 'bold', marginVertical: 4 },
  earningsCount: { color: '#D1FAE5', fontSize: 14 },
  list: { paddingHorizontal: 16, paddingBottom: 20 },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    elevation: 1,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  addresses: { flex: 1, marginRight: 8 },
  address: { fontSize: 13, color: colors.black },
  badge: { borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4 },
  badgeText: { fontSize: 11, fontWeight: '600' },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  date: { fontSize: 12, color: colors.gray },
  fare: { fontSize: 16, fontWeight: 'bold', color: colors.black },
})
