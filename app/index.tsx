import React, { useState, useEffect, useCallback, useRef } from 'react';
import {View,Text,FlatList,TouchableOpacity, Alert,RefreshControl,ScrollView,DeviceEventEmitter,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { StockData, getStockData, searchStock, getMarketIndices, MarketIndex, getKLineData, KLineData } from '../services/stockService';
import { saveStocks, getStocks, saveNotificationStocks, getNotificationStocks } from '../services/storageService';
import { initNotifications, updateStockNotification, addNotificationResponseListener } from '../services/notificationService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerBackgroundTask, setupAppStateListener, registerBackgroundTaskWithSavedInterval } from '../services/backgroundService';
import AddStockModal from '../components/modals/AddStockModal';
import SettingsModal from '../components/modals/SettingsModal';
import PositionModal from '../components/modals/PositionModal';
import StockDetailModal from '../components/modals/StockDetailModal';
import StockItem from '../components/StockItem';
import { getChangeColor } from '../utils/helpers';
import { isMarketClosed, calculatePositionProfit, calculateTotalProfit, PositionData } from '../utils/marketUtils';
import { IndexStyles as styles } from '@/constants/index.style';
import { THEME_ACCENT, THEME_BG, THEME_TEXT, THEME_TEXT_SECONDARY } from '@/constants/theme';
import { useKeyboardHeight } from '@/hooks/useKeyboardHeight';

export default function HomeScreen() {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [notificationStocks, setNotificationStocks] = useState<string[]>([]);
  const [marketIndices, setMarketIndices] = useState<MarketIndex[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [klineData, setKlineData] = useState<KLineData[]>([]);
  const [sortBy, setSortBy] = useState<'changePercent' | 'price' | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<number>(-1); // 默认不自动刷新
  const [countdown, setCountdown] = useState<number>(0);
  const isInitialized = useRef(false);
  const [lastRefreshTime, setLastRefreshTime] = useState('');
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const chartRef = useRef<any>(null);
  // 持仓相关状态
  const [positionModalVisible, setPositionModalVisible] = useState(false);
  const [currentPositionStock, setCurrentPositionStock] = useState<StockData | null>(null);
  const [positions, setPositions] = useState<PositionData[]>([]);
  const [costPrice, setCostPrice] = useState('');
  const [shares, setShares] = useState('');
  // 键盘高度
  const keyboardHeight = useKeyboardHeight();
  // 图表加载状态
  const [chartLoading, setChartLoading] = useState(false);


  // 加载大盘数据
  const loadMarketData = useCallback(async () => {
    try {
      const data = await getMarketIndices();
      setMarketIndices(data);
    } catch (error) {
      console.error('加载大盘数据失败:', error);
    }
  }, []);

  // 定义刷新股票数据的函数
  const refreshStocks = useCallback(async (stocksToRefresh?: StockData[], notificationStocksList?: string[], checkMarketStatus: boolean = true) => {
    try {
      // 检查是否为休市时间（仅在自动刷新时检查）
      if (checkMarketStatus && isMarketClosed()) {
        console.log('当前为休市时间，不执行自动刷新操作');
        setRefreshing(false);
        return;
      }
      
      setRefreshing(true);
      const stocksRef = stocksToRefresh || stocks;
      const stockCodes = stocksRef.map(stock => stock.code);
      if (stockCodes.length > 0) {
        const updatedStocks = await getStockData(stockCodes);
        setStocks(updatedStocks);
        await saveStocks(updatedStocks);

        const notificationStocksData = updatedStocks.filter(stock =>
          (notificationStocksList || notificationStocks).includes(stock.code)
        );
        await updateStockNotification(notificationStocksData);
      }
      await loadMarketData();
      const now = new Date().toLocaleString();
      setLastRefreshTime(now);
    } catch (error) {
      console.error('刷新股票数据失败:', error);
    } finally {
      setRefreshing(false);
    }
  }, [stocks, notificationStocks, loadMarketData]);

  // 配置自动刷新
  const setupAutoRefresh = useCallback(async (interval: number) => {
    // 保存配置到 AsyncStorage
    try {
      await AsyncStorage.setItem('refreshInterval', interval.toString());
    } catch (error) {
      console.error('保存刷新配置失败:', error);
    }
    
    // 重新注册后台任务，使用新的间隔
    if (interval > 0) {
      await registerBackgroundTask(interval);
    } else {
      // 如果设置为不自动刷新，使用默认间隔
      await registerBackgroundTask(60); // 后台任务最小间隔为1分钟
    }
    
    // 清除现有的定时器
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
    
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }

    if (interval === -1) {
      setCountdown(0);
      return;
    }

    // 设置新的自动刷新定时器
    refreshTimerRef.current = setInterval(async () => {
      // 检查是否为休市时间
      if (!isMarketClosed()) {
        await refreshStocks();
      } else {
        console.log('当前为休市时间，跳过自动刷新');
      }
      setCountdown(interval);
    }, interval * 1000) as unknown as NodeJS.Timeout;

    // 设置倒计时
    setCountdown(interval);
    countdownTimerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          return interval;
        }
        return prev - 1;
      });
    }, 1000) as unknown as NodeJS.Timeout;
  }, [refreshStocks]);

  const openStockDetail = useCallback(async (stock: StockData) => {
    try {
      setSelectedStock(stock);
      setDetailModalVisible(true);
      setChartLoading(true);
      const data = await getKLineData(stock.code, 60, 20);
      setKlineData(data);
      setChartLoading(false);
      // 延迟执行滚动，确保数据和图表已渲染完成
      setTimeout(() => {
        if (chartRef.current) {
          chartRef.current.scrollToEnd();
        }
      }, 100);
    } catch (error) {
      console.error('获取K线数据失败:', error);
      setChartLoading(false);
    }
  }, []);

  // 打开持仓编辑 modal
  const openPositionModal = (stock: StockData) => {
    setCurrentPositionStock(stock);
    // 检查是否已有持仓数据
    const existingPosition = positions.find(p => p.code === stock.code);
    if (existingPosition) {
      setCostPrice(existingPosition.costPrice.toString());
      setShares(existingPosition.shares.toString());
    } else {
      setCostPrice('');
      setShares('');
    }
    setPositionModalVisible(true);
  };

  // 保存持仓数据
  const savePosition = async () => {
    if (!currentPositionStock) return;
    
    const costPriceValue = parseFloat(costPrice);
    const sharesValue = parseFloat(shares);
    
    if (isNaN(costPriceValue) || isNaN(sharesValue) || costPriceValue <= 0 || sharesValue <= 0) {
      Alert.alert('提示', '请输入有效的成本价和持仓股数');
      return;
    }
    
    const updatedPositions = [...positions];
    const existingIndex = positions.findIndex(p => p.code === currentPositionStock.code);
    
    if (existingIndex >= 0) {
      updatedPositions[existingIndex] = {
        code: currentPositionStock.code,
        costPrice: costPriceValue,
        shares: sharesValue
      };
    } else {
      updatedPositions.push({
        code: currentPositionStock.code,
        costPrice: costPriceValue,
        shares: sharesValue
      });
    }
    
    setPositions(updatedPositions);
    try {
      await AsyncStorage.setItem('positions', JSON.stringify(updatedPositions));
      
      // 更新通知栏，包含持仓盈亏信息
      const notificationStocksData = stocks.filter(stock =>
        notificationStocks.includes(stock.code)
      );
      await updateStockNotification(notificationStocksData);
    } catch (error) {
      console.error('保存持仓数据失败:', error);
    }
    setPositionModalVisible(false);
  };

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const loadStocks = async () => {
      try {
        const savedStocks = await getStocks();
        const savedNotificationStocks = await getNotificationStocks();
        setStocks(savedStocks);
        setNotificationStocks(savedNotificationStocks);

        // 加载持仓数据
        try {
          const savedPositions = await AsyncStorage.getItem('positions');
          if (savedPositions) {
            setPositions(JSON.parse(savedPositions));
          }
        } catch (error) {
          console.error('加载持仓数据失败:', error);
        }

        // 读取保存的刷新配置
        try {
          const savedInterval = await AsyncStorage.getItem('refreshInterval');
          if (savedInterval) {
            const interval = parseInt(savedInterval);
            setRefreshInterval(interval);
            await setupAutoRefresh(interval);
          }
        } catch (error) {
          console.error('读取刷新配置失败:', error);
        }

        await loadMarketData();
        if (savedStocks.length > 0) {
          // 直接传递 savedNotificationStocks 给 refreshStocks 函数
          await refreshStocks(savedStocks, savedNotificationStocks);
        }
      } catch (error) {
        console.error('加载股票列表失败:', error);
      }
    };

    const setupNotificationListener = () => {
      addNotificationResponseListener(async (response) => {
        const actionIdentifier = response.actionIdentifier;
        if (actionIdentifier === 'refresh') {
          await refreshStocks();
        } else if (actionIdentifier === 'hide-profit') {
          // 隐藏持仓金额
          const savedStocks = await getStocks();
          const savedNotificationStocks = await getNotificationStocks();
          if (savedStocks.length > 0 && savedNotificationStocks.length > 0) {
            const notificationStocksData = savedStocks.filter(stock =>
              savedNotificationStocks.includes(stock.code)
            );
            await updateStockNotification(notificationStocksData, false);
          }
        }
      });
      
      // 监听原生发送的刷新事件
      const subscription = DeviceEventEmitter.addListener('refreshStocks', () => {
        refreshStocks();
      });
      
      return subscription;
    };

    loadStocks();
    initNotifications();
    const notificationSubscription = setupNotificationListener();
    
    // 注册后台任务
    registerBackgroundTaskWithSavedInterval();
    
    // 监听应用状态变化
    const appStateSubscription = setupAppStateListener();

    // 清理函数
    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
      notificationSubscription.remove();
      appStateSubscription.remove();
    };
  }, [refreshStocks, loadMarketData, setupAutoRefresh]);

  const handleSearch = async () => {
    if (!searchKeyword.trim()) return;
    try {
      setLoading(true);
      const results = await searchStock(searchKeyword);
      setSearchResults(results);
    } catch (error) {
      console.error('搜索股票失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStock = async (stock: StockData) => {
    try {
      const updatedStocks = [...stocks, stock];
      setStocks(updatedStocks);
      await saveStocks(updatedStocks);
      setModalVisible(false);
      setSearchKeyword('');
      setSearchResults([]);

      if (notificationStocks.length < 4) {
        const updatedNotificationStocks = [...notificationStocks, stock.code];
        setNotificationStocks(updatedNotificationStocks);
        await saveNotificationStocks(updatedNotificationStocks);
        await updateStockNotification(updatedStocks.filter(s =>
          updatedNotificationStocks.includes(s.code)
        ));
      }
    } catch (error) {
      console.error('添加股票失败:', error);
    }
  };

  const handleRemoveStock = (code: string) => {
    Alert.alert(
      '确认移除',
      '确定要移除这个股票吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          onPress: async () => {
            try {
              const updatedStocks = stocks.filter(stock => stock.code !== code);
              setStocks(updatedStocks);
              await saveStocks(updatedStocks);

              const updatedNotificationStocks = notificationStocks.filter(c => c !== code);
              setNotificationStocks(updatedNotificationStocks);
              await saveNotificationStocks(updatedNotificationStocks);
              await updateStockNotification(updatedStocks.filter(s =>
                updatedNotificationStocks.includes(s.code)
              ));
            } catch (error) {
              console.error('移除股票失败:', error);
            }
          },
        },
      ]
    );
  };

  const toggleNotification = async (code: string) => {
    try {
      let updatedNotificationStocks;
      if (notificationStocks.includes(code)) {
        updatedNotificationStocks = notificationStocks.filter(c => c !== code);
      } else {
        if (notificationStocks.length >= 4) {
          Alert.alert('提示', '通知栏最多只能显示4个股票');
          return;
        }
        updatedNotificationStocks = [...notificationStocks, code];
      }

      setNotificationStocks(updatedNotificationStocks);
      await saveNotificationStocks(updatedNotificationStocks);

      const notificationStocksData = stocks.filter(stock =>
        updatedNotificationStocks.includes(stock.code)
      );
      await updateStockNotification(notificationStocksData);
    } catch (error) {
      console.error('切换通知栏显示失败:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: ()=>(
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>A股牛观</Text>
              {countdown > 0 && (
                <Text style={[styles.countdownText, isMarketClosed() && { color: THEME_TEXT_SECONDARY }]}>({countdown}s)</Text>
              )}
            </View>
          ),
          headerStyle: { backgroundColor: THEME_BG },
          headerTintColor: THEME_TEXT,
          headerLeft: () => (
            <TouchableOpacity onPress={() => setSettingsModalVisible(true)} style={styles.headerButton}>
              <Ionicons name="settings-outline" size={20} color={THEME_TEXT} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={()=>refreshStocks(undefined, undefined, false)} style={styles.headerButton}>
             <Text style={{color: '#ffffff',marginRight:5}}> {lastRefreshTime}</Text>
              <Ionicons name="refresh" size={20} color={THEME_TEXT} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
           (
            <RefreshControl
              refreshing={refreshInterval !== -1 ? false : refreshing}
              onRefresh={() => refreshStocks(undefined, undefined, false)}
              tintColor={THEME_ACCENT}
            />
          ) 
        }
        style={{flex:1}}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View style={styles.marketContainer}>
          {marketIndices.map((index) => (
            <View key={index.code} style={styles.marketCard}>
              <Text style={styles.marketTitle}>{index.name}</Text>
              <Text style={[styles.marketPrice, { color: getChangeColor(index.change) }]}>
                {index.price.toFixed(2)}
              </Text>
              <Text style={[styles.marketChange, { color: getChangeColor(index.change) }]}>
                {index.change >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%
              </Text>
            </View>
          ))}
        </View>

      

        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <Text style={{...styles.sectionTitle,color: getChangeColor(calculateTotalProfit(stocks, positions)) }}>今日总盈亏 ¥{calculateTotalProfit(stocks, positions).toFixed(2)}</Text>
          </View>
          <View style={styles.sortContainer}>
            <TouchableOpacity 
              style={styles.sortButton}
              onPress={() => {
                if (sortBy === 'changePercent') {
                  setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
                } else {
                  setSortBy('changePercent');
                  setSortOrder('desc');
                }
              }}
            >
              <Ionicons 
                name={sortBy === 'changePercent' ? (sortOrder === 'desc' ? 'trending-up' : 'trending-down') : 'trending-up'} 
                size={16} 
                color={sortBy === 'changePercent' ? THEME_ACCENT : THEME_TEXT_SECONDARY} 
              />
              <Text style={[styles.sortText, sortBy === 'changePercent' && { color: THEME_ACCENT }]}>涨跌幅</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.sortButton}
              onPress={() => {
                if (sortBy === 'price') {
                  setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
                } else {
                  setSortBy('price');
                  setSortOrder('desc');
                }
              }}
            >
              <Ionicons 
                name={sortBy === 'price' ? (sortOrder === 'desc' ? 'arrow-up' : 'arrow-down') : 'arrow-up'} 
                size={16} 
                color={sortBy === 'price' ? THEME_ACCENT : THEME_TEXT_SECONDARY} 
              />
              <Text style={[styles.sortText, sortBy === 'price' && { color: THEME_ACCENT }]}>股价</Text>
            </TouchableOpacity>
          </View>
        </View>

        {stocks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={48} color={THEME_TEXT_SECONDARY} />
            <Text style={styles.emptyText}>还没有添加股票</Text>
            <Text style={styles.emptySubtext}>点击右下角按钮添加股票</Text>
          </View>
        ) : (
          <View style={styles.stockList}>
            {[...stocks].sort((a, b) => {
              if (sortBy === 'changePercent') {
                return sortOrder === 'desc' 
                  ? b.changePercent - a.changePercent 
                  : a.changePercent - b.changePercent;
              } else if (sortBy === 'price') {
                return sortOrder === 'desc' 
                  ? b.price - a.price 
                  : a.price - b.price;
              }
              return 0;
            }).map(stock => (
              <View key={stock.code}>
                <StockItem
                  item={stock}
                  positions={positions}
                  notificationStocks={notificationStocks}
                  onOpenDetail={openStockDetail}
                  onOpenPositionModal={openPositionModal}
                  onToggleNotification={toggleNotification}
                  onRemoveStock={handleRemoveStock}
                />
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={32} color={THEME_TEXT} />
      </TouchableOpacity>

      {/* 添加股票 Modal */}
      <AddStockModal
        keyboardHeight={keyboardHeight}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        searchKeyword={searchKeyword}
        onSearchKeywordChange={setSearchKeyword}
        loading={loading}
        searchResults={searchResults}
        onSearch={handleSearch}
        onAddStock={handleAddStock}
      />
      {/* 股票详情 Modal */}
      <StockDetailModal
        visible={detailModalVisible}
        onClose={() => setDetailModalVisible(false)}
        selectedStock={selectedStock}
        klineData={klineData}
        chartLoading={chartLoading}
        chartRef={chartRef}
      />
      {/* 设置 Modal */}
      <SettingsModal
        visible={settingsModalVisible}
        onClose={() => setSettingsModalVisible(false)}
        refreshInterval={refreshInterval}
        onRefreshIntervalChange={(interval) => {
          setRefreshInterval(interval);
          setSettingsModalVisible(false);
          setupAutoRefresh(interval);
        }}
      />
      {/* 编辑持仓 Modal */}
      <PositionModal
        visible={positionModalVisible}
        onClose={() => setPositionModalVisible(false)}
        currentPositionStock={currentPositionStock}
        costPrice={costPrice}
        onCostPriceChange={setCostPrice}
        shares={shares}
        onSharesChange={setShares}
        onSave={savePosition}
        keyboardHeight={keyboardHeight}
      />
    </SafeAreaView>
    );
  }

  