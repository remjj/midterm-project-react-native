import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface DarkModeToggleProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ darkMode, setDarkMode }) => {
  return (
    <TouchableOpacity
      style={styles.floatingButton}
      onPress={() => setDarkMode(!darkMode)}
    >
      <Ionicons name={darkMode ? 'sunny' : 'moon'} size={30} color="#fff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#fcab0a',
    borderRadius: 30,
    padding: 10,
    elevation: 5,
  },
});

export default DarkModeToggle;
