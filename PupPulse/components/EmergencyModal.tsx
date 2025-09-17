import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Alert, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';

interface EmergencyModalProps {
  visible: boolean;
  onClose: () => void;
  dogName: string;
  symptoms: string[];
  severity: 'high' | 'critical';
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  visible,
  onClose,
  dogName,
  symptoms,
  severity
}) => {
  const handleCallVet = () => {
    Alert.alert(
      'Call Emergency Vet',
      'This will call the nearest emergency veterinary clinic. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Call Now', 
          onPress: () => {
            // In a real app, this would call the actual emergency vet
            Linking.openURL('tel:+1234567890');
          }
        }
      ]
    );
  };

  const handleFindVet = () => {
    // In a real app, this would open a map with nearby vets
    Alert.alert('Find Emergency Vet', 'Opening map with nearby emergency veterinary clinics...');
  };

  const handleExportReport = () => {
    Alert.alert('Export Health Report', 'Generating comprehensive health report for your vet...');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <LinearGradient
        colors={severity === 'critical' ? Colors.light.emergencyGradient : ['#FF9800', '#F57C00']}
        style={styles.container}
      >
        <View style={styles.header}>
          <MaterialIcons 
            name="emergency" 
            size={32} 
            color="#FFFFFF" 
          />
          <Text style={styles.headerTitle}>
            {severity === 'critical' ? 'CRITICAL EMERGENCY' : 'URGENT ATTENTION NEEDED'}
          </Text>
        </View>

        <View style={styles.content}>
          <View style={styles.dogInfo}>
            <Text style={styles.dogName}>{dogName}</Text>
            <Text style={styles.urgencyText}>
              {severity === 'critical' 
                ? 'Your dog needs immediate veterinary attention' 
                : 'Your dog needs urgent veterinary care'
              }
            </Text>
          </View>

          <View style={styles.symptomsContainer}>
            <Text style={styles.symptomsTitle}>Reported Symptoms:</Text>
            {symptoms.map((symptom, index) => (
              <View key={index} style={styles.symptomItem}>
                <MaterialIcons name="warning" size={16} color="#FFFFFF" />
                <Text style={styles.symptomText}>{symptom}</Text>
              </View>
            ))}
          </View>

          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.primaryAction} onPress={handleCallVet}>
              <MaterialIcons name="phone" size={24} color="#FFFFFF" />
              <Text style={styles.primaryActionText}>Call Emergency Vet</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryAction} onPress={handleFindVet}>
              <MaterialIcons name="location-on" size={24} color="#FFFFFF" />
              <Text style={styles.secondaryActionText}>Find Nearest Vet</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryAction} onPress={handleExportReport}>
              <MaterialIcons name="file-download" size={24} color="#FFFFFF" />
              <Text style={styles.secondaryActionText}>Export Health Report</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.disclaimer}>
            <MaterialIcons name="info" size={16} color="rgba(255, 255, 255, 0.8)" />
            <Text style={styles.disclaimerText}>
              This is not a substitute for professional veterinary care. 
              Seek immediate veterinary attention for your pet.
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <MaterialIcons name="close" size={24} color="#FFFFFF" />
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </LinearGradient>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  dogInfo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  dogName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  urgencyText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },
  symptomsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
  },
  symptomsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  symptomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  symptomText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  actionsContainer: {
    marginBottom: 30,
  },
  primaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  primaryActionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  secondaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 12,
  },
  secondaryActionText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 8,
  },
  disclaimerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
  closeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
});

