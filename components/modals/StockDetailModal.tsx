import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-gifted-charts';
import { StockData, KLineData } from '../../services/stockService';
import { THEME_BG, THEME_CARD, THEME_TEXT, THEME_TEXT_SECONDARY } from '../../constants/theme';
import { getChangeColor } from '../../utils/helpers';

interface StockDetailModalProps {
  visible: boolean;
  onClose: () => void;
  selectedStock: StockData | null;
  klineData: KLineData[];
  chartLoading: boolean;
  chartRef: any;
}

const StockDetailModal: React.FC<StockDetailModalProps> = ({
  visible,
  onClose,
  selectedStock,
  klineData,
  chartLoading,
  chartRef,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.detailModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {selectedStock?.name || ''}｜
              <Text style={{ color: Number(selectedStock?.changePercent) >= 0 ? '#F44336' : THEME_TEXT_SECONDARY }}>
                {Number(selectedStock?.changePercent) >= 0 ? '+' : '-'}{Number(selectedStock?.changePercent).toFixed(2) || ''}%
              </Text>
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={THEME_TEXT} />
            </TouchableOpacity>
          </View>

          {chartLoading ? (
            <View style={styles.chartLoadingContainer}>
              <Text style={styles.loadingText}>加载图表中...</Text>
            </View>
          ) : klineData.length > 0 ? (
            <View style={styles.chartContainer}>
              <LineChart
                scrollRef={chartRef}
                data={klineData.map(item => ({
                  value: parseFloat(String(item.close)),
                  dataPointText: parseFloat(String(item.close)).toFixed(2)
                }))}
                xAxisLabelTexts={klineData.map(item => {
                  const date = new Date(item.day);
                  return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
                })}
                xAxisLabelTextStyle={{ color: THEME_TEXT, fontSize: 10 }}
                width={Dimensions.get('window').width - 36}
                height={160}
                color={getChangeColor(selectedStock?.change || 0)}
                thickness={2}
                spacing={30}
                dataPointsColor={getChangeColor(selectedStock?.change || 0)}
                hideDataPoints={false}
                showValuesAsDataPointsText
                textColor1={THEME_TEXT}
                textFontSize={10}
                textShiftY={-10}
                hideRules
                yAxisColor={'transparent'}
                xAxisColor={THEME_TEXT_SECONDARY}
                areaChart
                startFillColor={getChangeColor(selectedStock?.change || 0)}
                endFillColor={THEME_BG}
                startOpacity={0.4}
                endOpacity={0.1}
              />
            </View>
          ) : (
            <View style={styles.chartContainer}>
              <Text style={styles.emptyChartText}>暂无图表数据</Text>
            </View>
          )}

          {selectedStock && (
            <View style={styles.stockDetail}>
              <View style={styles.stockDetailItem}>
                <Text style={styles.detailLabel}>代码</Text>
                <Text style={styles.detailValue}>{selectedStock.code}</Text>
              </View>
              <View style={styles.stockDetailItem}>
                <Text style={styles.detailLabel}>当前价</Text>
                <Text style={[styles.detailValue, { color: getChangeColor(selectedStock.change) }]}>
                  {selectedStock.price.toFixed(2)}
                </Text>
              </View>
              <View style={styles.stockDetailItem}>
                <Text style={styles.detailLabel}>涨跌</Text>
                <Text style={[styles.detailValue, { color: getChangeColor(selectedStock.change) }]}>
                  {selectedStock.change >= 0 ? '+' : ''}{selectedStock.change.toFixed(2)}
                </Text>
              </View>
              <View style={styles.stockDetailItem}>
                <Text style={styles.detailLabel}>涨跌幅</Text>
                <Text style={[styles.detailValue, { color: getChangeColor(selectedStock.change) }]}>
                  {selectedStock.changePercent >= 0 ? '+' : ''}{selectedStock.changePercent.toFixed(2)}%
                </Text>
              </View>
              <View style={styles.stockDetailItem}>
                <Text style={styles.detailLabel}>开盘</Text>
                <Text style={styles.detailValue}>{(selectedStock.open || 0).toFixed(2)}</Text>
              </View>
              <View style={styles.stockDetailItem}>
                <Text style={styles.detailLabel}>最高</Text>
                <Text style={styles.detailValue}>{(selectedStock.high || 0).toFixed(2)}</Text>
              </View>
              <View style={styles.stockDetailItem}>
                <Text style={styles.detailLabel}>最低</Text>
                <Text style={styles.detailValue}>{(selectedStock.low || 0).toFixed(2)}</Text>
              </View>
              <View style={styles.stockDetailItem}>
                <Text style={styles.detailLabel}>昨收</Text>
                <Text style={styles.detailValue}>{(selectedStock.prevClose || 0).toFixed(2)}</Text>
              </View>
              <View style={[styles.stockDetailItem, { width: '98%' }]}>
                <Text style={styles.detailLabel}>成交额</Text>
                <Text style={styles.detailValue}>
                  {selectedStock.amount ? (selectedStock.amount / 100000000).toFixed(2) + '亿' : '-'}
                </Text>
              </View>
            </View>
          )}

          <Text style={styles.klineTitle}>分时数据</Text>
          <FlatList
            data={klineData}
            keyExtractor={(item) => item.day}
            renderItem={({ item }) => (
              <View style={styles.klineItem}>
                <Text style={styles.klineTime}>{item.day}</Text>
                <Text style={styles.klinePrice}>开:{item.open} 收:{item.close}</Text>
                <Text style={styles.klineVol}>高:{item.high} 低:{item.low}</Text>
              </View>
            )}
            style={styles.klineList}
          />
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
  detailModal: {
    backgroundColor: THEME_CARD,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingBottom: 40,
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
  loadingText: {
    color: THEME_TEXT_SECONDARY,
    fontSize: 16,
  },
  emptyChartText: {
    color: THEME_TEXT_SECONDARY,
    fontSize: 14,
  },
  stockDetail: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
  },
  stockDetailItem: {
    width: '24%',
    maxWidth: '24%',
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

export default StockDetailModal;