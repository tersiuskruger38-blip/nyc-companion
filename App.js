import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './src/context/AppContext';
import TabNavigator from './src/navigation/TabNavigator';

export default function App() {
  return (
    <AppProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <TabNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </AppProvider>
  );
}
