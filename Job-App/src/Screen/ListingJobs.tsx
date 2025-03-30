import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, FlatList, Button, TouchableOpacity, SafeAreaView, Alert, Image, RefreshControl } from 'react-native';
import axios from 'axios';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import listJobStyles from '../../style/listjob';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import ApplyForm from './ApplyForm';
import DarkModeToggle from '../../components/DarkModeToggle';
import hireLogo from '../../assets/hireLogo.png';

interface Job {
  id: string;
  title: string;
  company_name: string;
  compensation: string;
  description: string;
  job_location: string;
  company_logo?: string;
}

const ListingJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [applyModalVisible, setApplyModalVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<NavigationProp<any>>();

  const fetchJobs = async () => {
    try {
      const response = await axios.get('https://empllo.com/api/v1');
      const jobArray = Array.isArray(response.data) ? response.data : response.data.jobs;

      const jobsWithIds = jobArray.map((job: any) => ({
        id: job.id || job.slug || (uuid.v4() as string),
        title: job.title || 'No title',
        company_name: job.companyName || 'Not specified',
        compensation: job.minSalary && job.maxSalary ? `$${job.minSalary} - ${job.maxSalary}` : 'Not specified',
        description: job.description || 'No description',
        job_location: job.locations && job.locations.length > 0 ? job.locations[0] : 'Not specified',
        company_logo: job.companyLogo || null,
      }));

      setJobs(jobsWithIds);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const loadSavedJobs = async () => {
    try {
      const storedSavedJobs = await AsyncStorage.getItem('savedJobs');
      setSavedJobs(storedSavedJobs ? JSON.parse(storedSavedJobs) : []);
    } catch (error) {
      console.error('Error loading saved jobs:', error);
    }
  };

  useEffect(() => {
    fetchJobs();
    loadSavedJobs();

    const unsubscribe = navigation.addListener('focus', loadSavedJobs);
    return () => unsubscribe();
  }, [navigation]);

  const handleSaveJob = async (job: Job) => {
    const jobExists = savedJobs.some((savedJob) => savedJob.id === job.id);
    let updatedJobs;

    if (!jobExists) {
      updatedJobs = [...savedJobs, job];
      setSavedJobs(updatedJobs);
      Alert.alert('Job Saved', 'You have successfully saved this job.');
    } else {
      updatedJobs = savedJobs.filter((savedJob) => savedJob.id !== job.id);
      setSavedJobs(updatedJobs);
      Alert.alert('Job Unsaved', 'You have removed this job from your saved list.');
    }

    await AsyncStorage.setItem('savedJobs', JSON.stringify(updatedJobs));
  };

  const openApplyForm = (job: Job) => {
    setSelectedJob(job);
    setApplyModalVisible(true);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchJobs();
    setRefreshing(false);
  }, []);

  const renderJob = ({ item }: { item: Job }) => (
    <View style={[listJobStyles.jobCard, darkMode && { backgroundColor: '#fcc10b' }]}>
      {item.company_logo && (
        <Image source={{ uri: item.company_logo }} style={listJobStyles.logoImage} resizeMode="contain" />
      )}
      <Text style={[listJobStyles.jobTitle, darkMode && { color: '#000' }]}>{item.title}</Text>
      <Text style={[listJobStyles.jobText, darkMode && { color: '#000' }]}>Company: {item.company_name}</Text>
      <Text style={[listJobStyles.jobText, darkMode && { color: '#000' }]}>Location: {item.job_location}</Text>
      <Text style={[listJobStyles.jobText, darkMode && { color: '#000' }]}>Salary: {item.compensation}</Text>

      <TouchableOpacity onPress={() => handleSaveJob(item)}>
        <Text style={savedJobs.some((savedJob) => savedJob.id === item.id) ? listJobStyles.savedText : listJobStyles.saveText}>
          {savedJobs.some((savedJob) => savedJob.id === item.id) ? 'Unsave' : 'Save Job'}
        </Text>
      </TouchableOpacity>

      <Button title="Apply" onPress={() => openApplyForm(item)} />
    </View>
  );

  return (
    <SafeAreaView style={[listJobStyles.safeContainer]}>
      <View style={[listJobStyles.container, darkMode && { backgroundColor: '#f86802' }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Image source={hireLogo} style={[listJobStyles.hireLogo, { width: 40, height: 40 }]} resizeMode="contain" />
          <Text style={[listJobStyles.header, darkMode && { color: 'white', marginLeft: 10 }]}>Hire-izon</Text>
        </View>

        <TextInput
          placeholder="Search jobs by title or company..."
          placeholderTextColor={darkMode ? '#999' : '#555'}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={[listJobStyles.searchInput, darkMode && { backgroundColor: 'white', color: '#fff', borderColor: '#555' }]}
        />

        <FlatList
          data={jobs.filter((job) =>
            job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.company_name.toLowerCase().includes(searchQuery.toLowerCase())
          )}
          keyExtractor={(item) => item.id}
          renderItem={renderJob}
          ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20, color: darkMode ? '#ccc' : '#000' }}>No jobs found.</Text>}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={darkMode ? '#fff' : '#000'} colors={darkMode ? ['#fff'] : ['#000']} />}
        />

        <ApplyForm
          visible={applyModalVisible}
          onClose={() => setApplyModalVisible(false)}
          navigation={navigation}
          position={selectedJob?.title || ''}
          company={selectedJob?.company_name || ''}
        />

        <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
      </View>
    </SafeAreaView>
  );
};

export default ListingJobs;
