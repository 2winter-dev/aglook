import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME_BG, THEME_CARD, THEME_TEXT, THEME_TEXT_SECONDARY, THEME_ACCENT } from '../../constants/theme';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  refreshInterval: number;
  onRefreshIntervalChange: (interval: number) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  visible,
  onClose,
  refreshInterval,
  onRefreshIntervalChange,
}) => {
  const intervals = [
    { value: -1, label: '不自动刷新' },
    { value: 5, label: '5秒' },
    { value: 10, label: '10秒' },
    { value: 15, label: '15秒' },
    { value: 30, label: '30秒' },
    { value: 60, label: '1分钟' },
    { value: 1200, label: '20分钟' },
    { value: 1800, label: '30分钟' },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.settingsModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>By:2winter</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={THEME_TEXT} />
            </TouchableOpacity>
          </View>

          <View style={styles.settingsSection}>
            <Text style={styles.settingsLabel}>自动刷新时间</Text>
            <View style={styles.settingsOptions}>
              {intervals.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.settingsOption,
                    refreshInterval === option.value && styles.settingsOptionSelected,
                  ]}
                  onPress={() => onRefreshIntervalChange(option.value)}
                >
                  <Text
                    style={[
                      styles.settingsOptionText,
                      refreshInterval === option.value && styles.settingsOptionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsModal: {
    backgroundColor: THEME_CARD,
    borderRadius: 16,
    padding: 24,
    marginTop:'auto',
    width: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: THEME_TEXT,
    fontSize: 18,
    fontWeight: 'bold',
  },
  settingsSection: {
    marginTop: 20,
  },
  settingsLabel: {
    fontSize: 16,
    color: THEME_TEXT,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  settingsOptions: {
    gap: 8,
  },
  settingsOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: THEME_BG,
  },
  settingsOptionSelected: {
    backgroundColor: THEME_ACCENT,
  },
  settingsOptionText: {
    fontSize: 14,
    color: THEME_TEXT,
  },
  settingsOptionTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default SettingsModal;