import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { colors } from '../shared/colors'
import LoginScreen from './src/screens/LoginScreen'
import RegisterScreen from './src/screens/RegisterScreen'
import BookRideScreen from './src/screens/BookRideScreen'
import TrackingScreen from './src/screens/TrackingScreen'
import HistoryScreen from './src/screens/HistoryScreen'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: colors.black,
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Taxi Mouine' }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Registrieren' }} />
          <Stack.Screen name="BookRide" component={BookRideScreen} options={{ title: 'Fahrt buchen' }} />
          <Stack.Screen name="Tracking" component={TrackingScreen} options={{ title: 'Fahrt verfolgen' }} />
          <Stack.Screen name="History" component={HistoryScreen} options={{ title: 'Verlauf' }} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  )
}
