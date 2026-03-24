import { StyleSheet } from 'react-native';
import { THEME_ACCENT, THEME_BG, THEME_CARD, THEME_TEXT, THEME_TEXT_SECONDARY } from './theme';

export const IndexStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_BG,
  },
  scrollContent: {
    padding: 8,
    paddingTop:0,
   
    paddingBottom: 100,
  },
  headerButton: {
    padding: 8,
    alignItems: 'center',
    flexDirection: 'row',
  },
  marketContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  marketCard: {
    flex: 1,
    backgroundColor: THEME_CARD,
    borderRadius: 12,
    padding: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  marketTitle: {
    color: THEME_TEXT_SECONDARY,
    fontSize: 10,
    marginBottom: 4,
  },
  marketPrice: {
    color: THEME_TEXT,
    fontSize: 12,
    marginTop: 2,
  },
  marketChange: {
    color: THEME_TEXT,
    fontSize: 13,
    fontWeight: 'bold',
  },
  marketPercent: {
    color: THEME_TEXT,
    fontSize: 12,
    marginTop: 2,
  },
  marketLabel: {
    color: THEME_TEXT_SECONDARY,
    fontSize: 12,
    marginBottom: 4,
  },
  marketValue: {
    color: THEME_TEXT,
    fontSize: 14,
    fontWeight: 'bold',
  },
  totalProfitCard: {
    backgroundColor: THEME_CARD,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  totalProfitTitle: {
    color: THEME_TEXT_SECONDARY,
    fontSize: 14,
    marginBottom: 8,
  },
  totalProfitValue: {
    color: THEME_TEXT,
    fontSize: 24,
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    color: THEME_TEXT,
    fontWeight: 'bold',
  },
  sectionCount: {
    color: THEME_TEXT_SECONDARY,
    fontSize: 14,
  },
  sortContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderRadius: 4,
  },
  sortText: {
    fontSize: 12,
    color: THEME_TEXT_SECONDARY,
  },
  stockList: {
    gap: 12,
  },
  stockItem: {
    backgroundColor: THEME_CARD,
    borderRadius: 12,
    padding: 16,
    
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockInfo: {
   
  },
  stockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tradingTag: {
    backgroundColor: '#4CAF50',
  },
  closedTag: {
    backgroundColor: '#999999',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  stockName: {
    color: THEME_TEXT,
    fontSize: 16,
    fontWeight: 'bold',
  },
  stockCode: {
    color: THEME_TEXT_SECONDARY,
    fontSize: 12,
    marginTop: 2,
  },
  stockTime: {
    color: '#8d8a8aff',
    fontSize: 11,
    marginTop: 2,
  },
  stockProfit: {
    fontSize: 12,
    marginTop: 4,
  },
  stockPriceContainer: {
    alignItems: 'flex-end',
    marginLeft:'auto',
  },
  stockPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  stockChange: {
    fontSize: 12,
    marginTop: 2,
  },
  stockPercent: {
    fontSize: 12,
    marginTop: 2,
  },
  stockActions: {
    flexDirection: 'row',
    marginTop:4,
    gap: 6,
  },
  iconButton: {
    padding: 6,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: THEME_TEXT,
    fontSize: 18,
    marginTop: 16,
  },
  emptySubtext: {
    color: THEME_TEXT_SECONDARY,
    fontSize: 14,
    marginTop: 8,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: THEME_ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: THEME_CARD,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
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
  settingsModal: {
    backgroundColor: THEME_CARD,
    borderRadius: 16,
    padding: 24,
    width: '100%',
  },
  settingsSection: {
    marginTop: 20,
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
  emptySearchContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptySearchText: {
    color: THEME_TEXT_SECONDARY,
    fontSize: 16,
  },
  detailModal: {
    backgroundColor: THEME_CARD,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingBottom: 40,
  },
  chartContainer: {
    width: '100%',
    height: 200,
    padding: 16,
  },
  chartLoadingContainer: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyChartText: {
    color: THEME_TEXT_SECONDARY,
    fontSize: 14,
  },

  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME_TEXT,
  },
  countdownText: {
    fontSize: 14,
    color: THEME_ACCENT,
  },
  stockDetail: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
  },
  stockDetailItem: {
    width: '24%',
    maxWidth:'24%',
    // backgroundColor: THEME_BG,
    borderRadius: 8,
    marginBottom: 4,
    marginHorizontal: '1%',
  },
  detailLabel: {
    color: THEME_TEXT_SECONDARY,
    fontSize: 12,
    marginBottom: 4,
  },
  detailValue: {
    color: THEME_TEXT,
    fontSize: 14,
    fontWeight: 'bold',
  },
  klineTitle: {
    color: THEME_TEXT,
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 16,
   
    paddingBottom: 8,
  },
  klineList: {
    maxHeight: 300,
    paddingHorizontal: 16,
  },
  klineItem: {
    // backgroundColor: THEME_BG,
    borderRadius: 8,
    padding: 6,
    marginBottom: 4,
  },
  klineTime: {
    color: THEME_TEXT_SECONDARY,
    fontSize: 12,
    marginBottom: 4,
  },
  klinePrice: {
    color: THEME_TEXT,
    fontSize: 14,
  },
  klineVol: {
    color: THEME_TEXT_SECONDARY,
    fontSize: 12,
    marginTop: 2,
  },
});