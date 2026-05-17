import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, Alert,
} from 'react-native'
import { colors } from '../../../shared/colors'
import { login, setToken } from '../../../shared/api'

export default function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    if (!phone || !password) {
      Alert.alert('Fehler', 'Bitte Telefonnummer und Passwort eingeben')
      return
    }
    setLoading(true)
    try {
      const res = await login(phone, password)
      setToken(res.accessToken)
      navigation.replace('BookRide')
    } catch (err) {
      Alert.alert('Fehler', err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={styles.emoji}>🚕</Text>
        <Text style={styles.title}>Taxi Mouine</Text>
        <Text style={styles.subtitle}>Mönchengladbach</Text>

        <TextInput
          style={styles.input}
          placeholder="Telefonnummer"
          placeholderTextColor={colors.gray}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Passwort"
          placeholderTextColor={colors.gray}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Wird geladen...' : 'Anmelden'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>
            Noch kein Konto? Registrieren
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  emoji: { fontSize: 64, marginBottom: 8 },
  title: { fontSize: 32, fontWeight: 'bold', color: colors.black, marginBottom: 4 },
  subtitle: { fontSize: 16, color: colors.gray, marginBottom: 32 },
  input: {
    width: '100%',
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
    color: colors.black,
  },
  button: {
    width: '100%',
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { fontSize: 18, fontWeight: 'bold', color: colors.black },
  linkText: { color: colors.primaryDark, marginTop: 16, fontSize: 14 },
})
