import { StyleSheet } from 'react-native';

const applyFormStyles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000aa',
  },
  modalContainer: {
    backgroundColor: '#fff',
    width: '85%',
    padding: 20,
    borderRadius: 15,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    height: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#f86802',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  cancelText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },positionText: {
    fontSize: 16,
    marginTop: 5,
    marginBottom: 2,
    color: '#333',
  },
  companyText: {
    fontSize: 16,
    marginBottom: 15,
    color: '#333',
  },
  
});

export default applyFormStyles;
