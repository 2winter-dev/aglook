// 自定义通知服务，用于调用 Android 原生通知模块
import { NativeModules } from 'react-native';
import { StockData } from './stockService';

const CustomNotificationService = NativeModules.CustomNotificationService;

// 显示自定义通知
export const showCustomNotification = async (stocks: StockData[], positions: any[] = []) => {
  try {
    if (CustomNotificationService) {
      // 转换股票数据为原生模块可以理解的格式
      const stockArray = stocks.map(stock => {
        // 查找持仓数据
        const position = positions.find(p => p.code === stock.code);
        const profit = position ? (stock.price - position.costPrice) * position.shares : null;
        
        return {
          code: stock.code,
          name: stock.name,
          price: stock.price,
          change: stock.change,
          changePercent: stock.changePercent,
          status: stock.status,
          profit: profit
        };
      });
      
      await CustomNotificationService.showNotification(stockArray);
      return true;
    }
    return false;
  } catch (error) {
    console.error('显示自定义通知失败:', error);
    return false;
  }
};

// 隐藏通知
export const hideCustomNotification = async () => {
  try {
    if (CustomNotificationService) {
      await CustomNotificationService.hideNotification();
      return true;
    }
    return false;
  } catch (error) {
    console.error('隐藏通知失败:', error);
    return false;
  }
};