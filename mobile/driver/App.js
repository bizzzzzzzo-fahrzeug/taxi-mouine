import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { colors } from '../shared/colors'
import DriverLoginScreen from './src/screens/DriverLoginScreen'
import DriverHomeScreen from './src/screens/DriverHomeScreen'
import RideDetailScreen from './src/screens/RideDetailScreen'
import DriverHistoryScreen from './src/screens/DriverHistoryScreen'

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
          <Stack.Screen name="Login" component={DriverLoginScreen} options={{ title: 'Taxi Mouine Fahrer' }} />
          <Stack.Screen name="Home" component={DriverHomeScreen} options={{ title: 'Fahrer', headerShown: false }} />
          <Stack.Screen name="RideDetail" component={RideDetailScreen} options={{ title: 'Fahrtdetails' }} />
          <Stack.Screen name="History" component={DriverHistoryScreen} options={{ title: 'Verlauf' }} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  )
}
