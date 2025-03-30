import React, { useState } from 'react';
import {  Modal, View, Text, TextInput, TouchableOpacity, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import applyFormStyles from '../../style/applyFormStyles';

interface ApplyFormProps {
  visible: boolean;
  onClose: () => void;
  fromSaved?: boolean;
  navigation?: any;
  position: string;
  company: string;
}

const ApplyForm: React.FC<ApplyFormProps> = ({
  visible,
  onClose,
  fromSaved,
  navigation,
  position,
  company,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    if (!name || !email || !contact || !reason) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const contactRegex = /^\d{11}$/;
    if (!contactRegex.test(contact)) {
      Alert.alert('Invalid Contact', 'Contact number must be exactly 11 digits.');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com)$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Email must be valid and end with .com.');
      return;
    }

    const allowedDomain = email.split('@')[1];
    if (allowedDomain !== 'yahoo.com' && !allowedDomain.endsWith('.com')) {
      Alert.alert(
        'Invalid Email Domain',
        'Email must be from yahoo.com or any valid domain ending in .com.'
      );
      return;
    }

    Alert.alert(
      'Application Submitted!',
      'Your application has been successfully submitted.',
      fromSaved
        ? [
            {
              text: 'Okay',
              onPress: () => {
                onClose();
                navigation.navigate('JobFinderScreen');
              },
            },
          ]
        : [{ text: 'OK', onPress: onClose }]
    );

    setName('');
    setEmail('');
    setContact('');
    setReason('');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={applyFormStyles.modalBackground}>
          <View style={applyFormStyles.modalContainer}>
            <Text style={applyFormStyles.modalHeader}>Apply for Job</Text>
            <Text style={applyFormStyles.positionText}>
              Position: <Text style={{ fontWeight: 'bold' }}>{position}</Text>
            </Text>
            <Text style={applyFormStyles.companyText}>
              Company: <Text style={{ fontWeight: 'bold' }}>{company}</Text>
            </Text>
            <TextInput
              placeholder="Name"
              placeholderTextColor="#888"
              value={name}
              onChangeText={setName}
              style={applyFormStyles.input}
            />
            <TextInput
              placeholder="Email"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              style={applyFormStyles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              placeholder="Contact Number"
              placeholderTextColor="#888"
              value={contact}
              onChangeText={setContact}
              style={applyFormStyles.input}
              keyboardType="phone-pad"
            />
            <TextInput
              placeholder="Why should we hire you?"
              placeholderTextColor="#888"
              value={reason}
              onChangeText={setReason}
              style={applyFormStyles.reasonInput}
              multiline
            />
            <TouchableOpacity onPress={handleSubmit} style={applyFormStyles.submitButton}>
              <Text style={applyFormStyles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose}>
              <Text style={applyFormStyles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ApplyForm;
