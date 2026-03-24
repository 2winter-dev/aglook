import { StockData } from '../services/stockService';

// 持仓数据类型
export type PositionData = {
  code: string;
  costPrice: number;
  shares: number;
};

// 判断当前是否为休市时间
export const isMarketClosed = () => {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  const minute = now.getMinutes();
  
  // 周末休市
  if (day === 0 || day === 6) {
    return true;
  }
  
  // 上午交易时间：9:30 - 11:30
  const isMorningTrading = hour >= 9 && (hour < 11 || (hour === 11 && minute <= 30));
  
  // 下午交易时间：13:00 - 15:00
  const isAfternoonTrading = hour >= 13 && hour < 15;
  
  // 非交易时间
  if (!isMorningTrading && !isAfternoonTrading) {
    return true;
  }
  
  return false;
};

// 计算持仓盈亏
export const calculatePositionProfit = (stock: StockData, positions: PositionData[]) => {
  const position = positions.find(p => p.code === stock.code);
  if (!position) return null;
  
  const currentValue = stock.price * position.shares;
  const costValue = position.costPrice * position.shares;
  const profit = currentValue - costValue;
  
  return profit;
};

// 计算总盈亏
export const calculateTotalProfit = (stocks: StockData[], positions: PositionData[]) => {
  return stocks.reduce((total, stock) => {
    const position = positions.find(p => p.code === stock.code);
    if (!position) return total;
    
    const currentValue = stock.price * position.shares;
    const costValue = position.costPrice * position.shares;
    const profit = currentValue - costValue;
    
    return total + profit;
  }, 0);
};
