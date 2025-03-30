import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import savedStyles from '../../style/savedjobs';
import DarkModeToggle from '../../components/DarkModeToggle';
import ApplyForm from './ApplyForm';

interface Job {
  id: string;
  title: string;
  company_name: string;
  compensation: string;
  description: string;
  job_location: string;
  company_logo?: string;
}

const SavedJobs = () => {
  const navigation = useNavigation();
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const storedJobs = await AsyncStorage.getItem('savedJobs');
        const parsedJobs: Job[] = storedJobs ? JSON.parse(storedJobs) : [];
        setSavedJobs(parsedJobs);
        setFilteredJobs(parsedJobs);
      } catch (error) {
        console.error('Error loading saved jobs:', error);
      }
    };

    const unsubscribe = navigation.addListener('focus', fetchSavedJobs);
    return unsubscribe;
  }, [navigation]);

  const handleRemove = async (id: string) => {
    const updatedJobs = savedJobs.filter((job) => job.id !== id);
    setSavedJobs(updatedJobs);
    setFilteredJobs(updatedJobs);
    await AsyncStorage.setItem('savedJobs', JSON.stringify(updatedJobs));
    Alert.alert('Removed', 'The job has been removed from your saved list.');
  };

  const handleApply = (job: Job) => {
    setSelectedJob(job);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    navigation.navigate('Jobs');
  };

  const handleSortByTitleAsc = () => {
    const sortedJobs = [...filteredJobs].sort((a, b) => a.title.localeCompare(b.title));
    setFilteredJobs(sortedJobs);
  };

  const handleSortByTitleDesc = () => {
    const sortedJobs = [...filteredJobs].sort((a, b) => b.title.localeCompare(a.title));
    setFilteredJobs(sortedJobs);
  };

  const handleSortBySalaryDesc = () => {
    const sortedJobs = [...filteredJobs].sort((a, b) => {
      const salaryA = parseFloat(a.compensation.replace(/[^0-9.]/g, '')) || 0;
      const salaryB = parseFloat(b.compensation.replace(/[^0-9.]/g, '')) || 0;
      return salaryB - salaryA;
    });
    setFilteredJobs(sortedJobs);
  };

  const renderJob = ({ item }: { item: Job }) => (
    <View style={savedStyles.card}>
      {item.company_logo && (
        <Image
          source={{ uri: item.company_logo }}
          style={savedStyles.logo}
          resizeMode="contain"
        />
      )}
      <Text style={savedStyles.title}>{item.title || 'No Title'}</Text>
      <Text style={savedStyles.text}>Company: {item.company_name || 'N/A'}</Text>
      <Text style={savedStyles.text}>Location: {item.job_location || 'N/A'}</Text>
      <Text style={savedStyles.text}>
        Salary: {item.compensation || 'Not specified'}
      </Text>

      <View style={savedStyles.buttonRow}>
        <TouchableOpacity
          style={savedStyles.applyButton}
          onPress={() => handleApply(item)}
        >
          <Text style={savedStyles.buttonText}>Apply</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={savedStyles.removeButton}
          onPress={() => handleRemove(item.id)}
        >
          <Text style={savedStyles.buttonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[savedStyles.container, darkMode && { backgroundColor: '#f86802' }]}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
    <TouchableOpacity onPress={() => setFilterDropdownVisible(!filterDropdownVisible)}>
      <Ionicons name="filter" size={30} color={darkMode ? '#000' : '#f86802'} />
    </TouchableOpacity>
  </View>

  {filterDropdownVisible && (
    <View style={{ backgroundColor: darkMode ? '#fcc10b' : 'white', borderRadius: 8, padding: 10, marginBottom: 10, elevation: 2 }}>
      <TouchableOpacity onPress={handleSortByTitleAsc} style={{ paddingVertical: 8 }}>
        <Text style={{ fontSize: 16, color: darkMode ? 'white' : '#000' }}>Sort by Title (A-Z)</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSortByTitleDesc} style={{ paddingVertical: 8 }}>
        <Text style={{ fontSize: 16, color: darkMode ? 'white' : '#000' }}>Sort by Title (Z-A)</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSortBySalaryDesc} style={{ paddingVertical: 8 }}>
        <Text style={{ fontSize: 16, color: darkMode ? '#fff' : '#000' }}>Sort by Salary (High to Low)</Text>
      </TouchableOpacity>
    </View>
  )}

  <FlatList
    data={filteredJobs}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => (
      <View style={[savedStyles.card, darkMode && { backgroundColor: '#fcc106', borderColor: '#666' }]}>
        {item.company_logo && (
          <Image source={{ uri: item.company_logo }} style={savedStyles.logo} resizeMode="contain" />
        )}
        <Text style={[savedStyles.title, darkMode && { color: '#000' }]}>{item.title || 'No Title'}</Text>
        <Text style={[savedStyles.text, darkMode && { color: '#000' }]}>Company: {item.company_name || 'N/A'}</Text>
        <Text style={[savedStyles.text, darkMode && { color: '#000' }]}>Location: {item.job_location || 'N/A'}</Text>
        <Text style={[savedStyles.text, darkMode && { color: '#000' }]}>
          Salary: {item.compensation || 'Not specified'}
        </Text>

        <View style={savedStyles.buttonRow}>
          <TouchableOpacity style={savedStyles.applyButton} onPress={() => handleApply(item)}>
            <Text style={savedStyles.buttonText}>Apply</Text>
          </TouchableOpacity>
          <TouchableOpacity style={savedStyles.removeButton} onPress={() => handleRemove(item.id)}>
            <Text style={savedStyles.buttonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    )}
    ListEmptyComponent={
      <Text style={[savedStyles.emptyText, darkMode && { color: '#000' }]}>No saved jobs found.</Text>
    }
    showsVerticalScrollIndicator={false}
  />

  <ApplyForm visible={modalVisible} jobTitle={selectedJob?.title} onClose={closeModal} />
  <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
</SafeAreaView>
  );
};

export default SavedJobs;
