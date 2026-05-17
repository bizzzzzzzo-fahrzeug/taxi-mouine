import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, Alert,
} from 'react-native'
import { colors } from '../../../shared/colors'
import { register, setToken } from '../../../shared/api'

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister() {
    if (!name || !phone || !password) {
      Alert.alert('Fehler', 'Bitte alle Felder ausfüllen')
      return
    }
    setLoading(true)
    try {
      const res = await register(name, phone, password)
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
        <Text style={styles.title}>Registrieren</Text>

        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor={colors.gray}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Telefonnummer"
          placeholderTextColor={colors.gray}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
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
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Wird geladen...' : 'Registrieren'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.linkText}>
            Bereits registriert? Anmelden
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.black, textAlign: 'center', marginBottom: 24 },
  input: {
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
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { fontSize: 18, fontWeight: 'bold', color: colors.black },
  linkText: { color: colors.primaryDark, textAlign: 'center', marginTop: 16, fontSize: 14 },
})
