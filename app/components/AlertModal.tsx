// this componenet display a custom alert to the user, that take dynamic title and message

import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

type Props = {
  visible: boolean;
  message: string;
  title: string;
  onClose: () => void;
};

const AlertModal: React.FC<Props> = ({ visible, title, message, onClose }) => {
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Icon name="alert-circle" size={40} color="#FF5252" />
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalMessage}>{message}</Text>
          <TouchableOpacity style={styles.modalButton} onPress={onClose}>
            <Text style={styles.modalButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#1E1E1E',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    marginVertical: 10,
  },
  modalButton: {
    backgroundColor: '#FF5252',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AlertModal;