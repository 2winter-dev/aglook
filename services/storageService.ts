// 存储服务，使用 AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StockData } from './stockService';

const STORAGE_KEYS = {
  STOCKS: 'aglook_stocks',
  NOTIFICATION_STOCKS: 'aglook_notification_stocks',
};

// 保存股票列表
export const saveStocks = async (stocks: StockData[]) => {
  try {
    const jsonValue = JSON.stringify(stocks);
    await AsyncStorage.setItem(STORAGE_KEYS.STOCKS, jsonValue);
    return true;
  } catch (error) {
    console.error('保存股票列表失败:', error);
    return false;
  }
};

// 获取股票列表
export const getStocks = async (): Promise<StockData[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.STOCKS);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('获取股票列表失败:', error);
    return [];
  }
};

// 保存通知栏股票列表
export const saveNotificationStocks = async (stockCodes: string[]) => {
  try {
    const jsonValue = JSON.stringify(stockCodes);
    await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATION_STOCKS, jsonValue);
    return true;
  } catch (error) {
    console.error('保存通知栏股票列表失败:', error);
    return false;
  }
};

// 获取通知栏股票列表
export const getNotificationStocks = async (): Promise<string[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATION_STOCKS);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('获取通知栏股票列表失败:', error);
    return [];
  }
};