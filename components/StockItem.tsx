import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StockData } from '../services/stockService';
import { PositionData } from '../utils/marketUtils';
import { getChangeColor } from '../utils/helpers';
import { THEME_ACCENT, THEME_TEXT, THEME_TEXT_SECONDARY } from '../constants/theme';
import { IndexStyles as styles } from '../constants/index.style';

interface StockItemProps {
  item: StockData;
  positions: PositionData[];
  notificationStocks: string[];
  onOpenDetail: (stock: StockData) => void;
  onOpenPositionModal: (stock: StockData) => void;
  onToggleNotification: (code: string) => void;
  onRemoveStock: (code: string) => void;
}

const StockItem: React.FC<StockItemProps> = ({
  item,
  positions,
  notificationStocks,
  onOpenDetail,
  onOpenPositionModal,
  onToggleNotification,
  onRemoveStock,
}) => {
  const isInNotification = notificationStocks.includes(item.code);
  const changeColor = getChangeColor(item.change);
  const position = positions.find(p => p.code === item.code);
  const profit = position ? (item.price - position.costPrice) * position.shares : 0;
  const profitColor = getChangeColor(profit);

  return (
    <View style={styles.stockItem}>
      <TouchableOpacity style={styles.stockInfo} onPress={() => onOpenDetail(item)}>
        <View style={styles.stockHeader}>
          <Text style={styles.stockName}>{item.name}</Text>
          <View style={[styles.statusTag, item.status === 'trading' ? styles.tradingTag : styles.closedTag]}>
            <Text style={styles.statusText}>
              {item.status === 'trading' ? '交易中' : '休市'}
            </Text>
          </View>
        </View>
        <Text style={styles.stockCode}>{item.code}</Text>
        <Text style={styles.stockTime}>{item.time}</Text>
        {position && (
          <Text style={[styles.stockProfit, { color: profitColor }]}>
            历史持仓盈亏: ¥{profit.toFixed(2)}
          </Text>
        )}
      </TouchableOpacity>
      <View style={styles.stockPriceContainer}>
        <Text style={[styles.stockPrice, { color: changeColor }]}>
          ¥{item.price.toFixed(2)}
        </Text>
        <Text style={[styles.stockChange, { color: changeColor }]}>
          {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)} ({item.change >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%)
        </Text>
        <View style={styles.stockActions}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => onOpenPositionModal(item)}
          >
            <Ionicons name="create-outline" size={20} color={THEME_ACCENT} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => onToggleNotification(item.code)}
          >
            <Ionicons
              name={isInNotification ? 'notifications' : 'notifications-off'}
              size={20}
              color={isInNotification ? THEME_ACCENT : THEME_TEXT_SECONDARY}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => onRemoveStock(item.code)}
          >
            <Ionicons name="trash-outline" size={20} color={THEME_ACCENT} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default StockItem;
