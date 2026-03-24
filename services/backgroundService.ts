// 后台服务，处理后台任务和应用状态变化
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import { AppState, AppStateStatus } from 'react-native';
import { getStocks, getNotificationStocks } from './storageService';
import { getStockData } from './stockService';
import { updateStockNotification } from './notificationService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 定义后台任务
const BACKGROUND_FETCH_TASK = 'background-refresh-stocks';

// 注册后台任务
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    // 获取股票数据
    const stocks = await getStocks();
    if (stocks.length > 0) {
      const updatedStocks = await getStockData(stocks.map(stock => stock.code));
      
      // 更新通知栏
      const notificationStocks = await getNotificationStocks();
      const notificationStocksData = updatedStocks.filter(stock =>
        notificationStocks.includes(stock.code)
      );
      await updateStockNotification(notificationStocksData);
    }
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error('后台刷新失败:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

// 注册后台获取任务
export const registerBackgroundTask = async (interval: number = 60) => {
  try {
    // 先取消之前的任务
    if (await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK)) {
      await BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
    }
    
    // 注册新任务，使用指定的间隔时间
    await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
      minimumInterval: interval * 1000, // 转换为毫秒
      stopOnTerminate: false,
      startOnBoot: true,
    });
    console.log('后台任务注册成功，间隔:', interval, '秒');
  } catch (error) {
    console.error('后台任务注册失败:', error);
  }
};

// 从存储中获取刷新间隔并注册后台任务
export const registerBackgroundTaskWithSavedInterval = async () => {
  try {
    const savedInterval = await AsyncStorage.getItem('refreshInterval');
    const interval = savedInterval ? parseInt(savedInterval) : 60; // 默认60秒
    await registerBackgroundTask(interval);
  } catch (error) {
    console.error('获取刷新间隔失败:', error);
    await registerBackgroundTask(); // 使用默认值
  }
};

// 监听应用状态变化，当应用进入后台时触发通知
export const setupAppStateListener = () => {
  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (nextAppState === 'background') {
      // 应用进入后台时触发通知
      try {
        const savedStocks = await getStocks();
        const savedNotificationStocks = await getNotificationStocks();
        if (savedStocks.length > 0 && savedNotificationStocks.length > 0) {
          const updatedStocks = await getStockData(savedStocks.map(stock => stock.code));
          const notificationStocksData = updatedStocks.filter(stock =>
            savedNotificationStocks.includes(stock.code)
          );
          // 确保通知被触发
          console.log('应用进入后台，更新通知栏:', notificationStocksData.length, '个股票');
          await updateStockNotification(notificationStocksData);
        } else {
          console.log('没有股票数据，不更新通知栏');
        }
      } catch (error) {
        console.error('后台触发通知失败:', error);
      }
    }
  };
  
  return AppState.addEventListener('change', handleAppStateChange);
};
