import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/AppNavigation/AppNavigation';
import { DarkModeProvider } from './components/DarkModeContext';

export default function App() {
  return (
    <DarkModeProvider>
      <AppNavigator />
    </DarkModeProvider>
  );
}
