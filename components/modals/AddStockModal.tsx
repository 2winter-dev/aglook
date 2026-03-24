import React from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StockData } from '../../services/stockService';
import { THEME_BG, THEME_CARD, THEME_TEXT, THEME_TEXT_SECONDARY, THEME_ACCENT } from '../../constants/theme';
import { useKeyboardHeight } from '@/hooks/useKeyboardHeight';

interface AddStockModalProps {
  visible: boolean;
  onClose: () => void;
  searchKeyword: string;
  onSearchKeywordChange: (text: string) => void;
  loading: boolean;
  searchResults: StockData[];
  onSearch: () => void;
  onAddStock: (stock: StockData) => void;
  keyboardHeight: number;
}

const AddStockModal: React.FC<AddStockModalProps> = ({
  visible,
  onClose,
  searchKeyword,
  onSearchKeywordChange,
  loading,
  searchResults,
  onSearch,
  onAddStock,
  keyboardHeight,
}) => {
  const renderSearchResultItem = ({ item }: { item: StockData }) => {
    const changeColor = item.change >= 0 ? THEME_ACCENT : '#4CAF50';


    return (
      <TouchableOpacity
        style={styles.searchResultItem}
        onPress={() => onAddStock(item)}
      >
        <View style={styles.searchResultInfo}>
          <Text style={styles.searchResultName}>{item.name}</Text>
          <Text style={styles.searchResultCode}>{item.code}</Text>
        </View>
        <View style={styles.searchResultPrice}>
          <Text style={[styles.stockPrice, { color: changeColor }]}>
            {item.price.toFixed(2)}
          </Text>
          <Text style={[styles.stockChange, { color: changeColor }]}>
            {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
          </Text>
        </View>
      </TouchableOpacity>
    );
  };


  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>添加股票</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={THEME_TEXT} />
            </TouchableOpacity>
          </View>

          <View style={{...styles.searchContainer, paddingBottom: keyboardHeight}}>
            <TextInput
              style={styles.searchInput}
              placeholder="输入股票代码或名称"
              placeholderTextColor={THEME_TEXT_SECONDARY}
              value={searchKeyword}
              onChangeText={onSearchKeywordChange}
              onSubmitEditing={onSearch}
              returnKeyType="search"
            />
            <TouchableOpacity style={styles.searchButton} onPress={onSearch}>
              <Ionicons name="search" size={24} color={THEME_TEXT} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>搜索中...</Text>
            </View>
          ) : (
            <FlatList
              data={searchResults}
              renderItem={renderSearchResultItem}
              keyExtractor={(item) => item.code}
              contentContainerStyle={styles.searchResultsList}
              ListEmptyComponent={
                <View style={styles.emptySearchContainer}>
                  <Text style={styles.emptySearchText}>输入股票代码进行搜索</Text>
                </View>
              }
            />
          )}
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
    paddingBottom: 40,
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
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    backgroundColor: THEME_BG,
    borderRadius: 8,
    padding: 12,
    color: THEME_TEXT,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: THEME_ACCENT,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    color: THEME_TEXT_SECONDARY,
    fontSize: 16,
  },
  searchResultsList: {
    padding: 16,
    marginTop:16,
    paddingTop: 0,
  },
  searchResultItem: {
    backgroundColor: THEME_BG,
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchResultInfo: {
    flex: 1,
  },
  searchResultName: {
    color: THEME_TEXT,
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchResultCode: {
    color: THEME_TEXT_SECONDARY,
    fontSize: 12,
    marginTop: 2,
  },
  searchResultPrice: {
    alignItems: 'flex-end',
  },
  stockPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  stockChange: {
    fontSize: 12,
    marginTop: 2,
  },
  emptySearchContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptySearchText: {
    color: THEME_TEXT_SECONDARY,
    fontSize: 16,
  },
});

export default AddStockModal;