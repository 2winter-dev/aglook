// 通知服务，使用 expo-notifications 请求权限
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StockData } from './stockService';

// 注册通知类别
Notifications.setNotificationCategoryAsync('stock-notification-category', [
  {
    identifier: 'refresh',
    buttonTitle: '刷新',
    options: {
      opensAppToForeground: false,
    },
  },
  {
    identifier: 'hide-profit',
    buttonTitle: '隐藏金额',
    options: {
      opensAppToForeground: false,
    },
  },
]);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// 初始化通知权限
export const initNotifications = async () => {
  try {
    if (Platform.OS === 'android') {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('通知权限未授予');
        return false;
      }
      return true;
    }
    return false;
  } catch (error) {
    console.error('初始化通知权限失败:', error);
    return false;
  }
};

// 更新通知栏股票数据
// 持仓数据类型
type PositionData = {
  code: string;
  costPrice: number;
  shares: number;
};

export const updateStockNotification = async (stocks: StockData[], showProfit: boolean = true) => {
  try {
    const displayStocks = stocks.slice(0, 4);
    
    if (displayStocks.length === 0) {
      // 隐藏通知
      await Notifications.dismissAllNotificationsAsync();
      return;
    }
    
    // 加载持仓数据
    let positions: PositionData[] = [];
    try {
      const savedPositions = await AsyncStorage.getItem('positions');
      if (savedPositions) {
        positions = JSON.parse(savedPositions);
      }
    } catch (error) {
      console.error('加载持仓数据失败:', error);
    }
    
    // 构建通知内容
    let notificationContent = '';
    displayStocks.forEach((stock, index) => {
      const position = positions.find(p => p.code === stock.code);
      // 今日盈亏 = 今日涨跌 * 持仓数量
      const profit = position ? stock.change * position.shares : null;
      
      notificationContent += `${stock.name} ${stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)} (${stock.change >= 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%)`;
      if (showProfit && profit !== null) {
        notificationContent += ` 今日: ${profit >= 0 ? '+' : ''}${profit.toFixed(2)}`;
      }
      if (index < displayStocks.length - 1) {
        notificationContent += '\n';
      }
    });
    
    // 发送通知
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'A股牛观',
        body: notificationContent,
        data: { stocks: displayStocks, showProfit },
        categoryIdentifier: 'stock-notification-category',
      },
      trigger: null, // 立即发送
      identifier: 'stock-notification', // 使用固定的通知 ID
    });
  } catch (error) {
    console.error('更新股票通知失败:', error);
  }
};

// 隐藏通知数据
export const hideNotificationData = async () => {
  try {
    await Notifications.dismissAllNotificationsAsync();
  } catch (error) {
    console.error('隐藏通知数据失败:', error);
  }
};

// 监听通知操作
export const addNotificationResponseListener = (callback: (response: Notifications.NotificationResponse) => void) => {
  return Notifications.addNotificationResponseReceivedListener(callback);
};