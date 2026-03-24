import React from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StockData } from '../../services/stockService';
import { THEME_BG, THEME_CARD, THEME_TEXT, THEME_TEXT_SECONDARY, THEME_ACCENT } from '../../constants/theme';

interface PositionModalProps {
  visible: boolean;
  onClose: () => void;
  currentPositionStock: StockData | null;
  costPrice: string;
  onCostPriceChange: (text: string) => void;
  shares: string;
  onSharesChange: (text: string) => void;
  onSave: () => void;
  keyboardHeight: number;
}

const PositionModal: React.FC<PositionModalProps> = ({
  visible,
  onClose,
  currentPositionStock,
  costPrice,
  onCostPriceChange,
  shares,
  onSharesChange,
  onSave,
  keyboardHeight,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { paddingBottom: 40 + keyboardHeight }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>编辑持仓</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={THEME_TEXT} />
            </TouchableOpacity>
          </View>
          <ScrollView
            contentContainerStyle={styles.modalBody}
            keyboardShouldPersistTaps="handled"
          >
            {currentPositionStock && (
              <>
                <Text style={styles.modalStockName}>{currentPositionStock.name} ({currentPositionStock.code})</Text>
                <Text style={styles.modalStockPrice}>当前价: ¥{currentPositionStock.price.toFixed(2)}</Text>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>成本价</Text>
                  <TextInput
                    style={styles.textInput}
                    value={costPrice}
                    onChangeText={onCostPriceChange}
                    placeholder="请输入成本价"
                    placeholderTextColor={THEME_TEXT_SECONDARY}
                    keyboardType="decimal-pad"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>持仓股数</Text>
                  <TextInput
                    style={styles.textInput}
                    value={shares}
                    onChangeText={onSharesChange}
                    placeholder="请输入持仓股数"
                    placeholderTextColor={THEME_TEXT_SECONDARY}
                    keyboardType="decimal-pad"
                  />
                </View>
              </>
            )}
          </ScrollView>
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton]}
              onPress={onSave}
            >
              <Text style={styles.saveButtonText}>保存</Text>
            </TouchableOpacity>
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
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: THEME_CARD,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    width: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: THEME_BG,
  },
  modalTitle: {
    color: THEME_TEXT,
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalBody: {
    padding: 16,
  },
  modalStockName: {
    color: THEME_TEXT,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  modalStockPrice: {
    color: THEME_TEXT_SECONDARY,
    fontSize: 14,
    marginBottom: 20,
  },
  inputGroup: {
    marginVertical: 12,
  },
  inputLabel: {
    color: THEME_TEXT_SECONDARY,
    fontSize: 14,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: THEME_BG,
    color: THEME_TEXT,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: THEME_BG,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: THEME_BG,
  },
  cancelButtonText: {
    color: THEME_TEXT,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: THEME_ACCENT,
  },
  saveButtonText: {
    color: THEME_TEXT,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PositionModal;