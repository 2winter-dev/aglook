import axios from 'axios';

export interface StockData {
  code: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  time: string;
  status: 'trading' | 'closed';
  open?: number;
  high?: number;
  low?: number;
  prevClose?: number;
  volume?: number;
  amount?: number;
}

export interface MarketData {
  amount: number;
  volume: number;
  change: number;
  changePercent: number;
}

export interface MarketIndex {
  code: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface KLineData {
  day: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  amount: number;
}

const stockClient = axios.create({
  headers: {
    'Referer': 'https://finance.sina.com.cn',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  },
});

export const getStockData = async (codes: string[]): Promise<StockData[]> => {
  try {
    const codeStr = codes.map(code => {
      if (code.startsWith('sh') || code.startsWith('sz')) {
        return code;
      }
      if (code.startsWith('6')) return `sh${code}`;
      if (code.startsWith('0') || code.startsWith('3')) return `sz${code}`;
      return code;
    }).join(',');

    const url = `https://hq.sinajs.cn/list=${codeStr}`;
    const response = await stockClient.get(url);
    const text = response.data as string;

    const stocks: StockData[] = [];
    const lines = text.split(';');

    for (const line of lines) {
      if (!line.trim()) continue;

      const match = line.match(/var hq_str_(\w+)="([^"]+)"/);
      if (match) {
        const code = match[1];
        const data = match[2].split(',');

        if (data.length >= 32) {
          const name = data[0] || '';
          const open = parseFloat(data[1]) || 0;
          const prevClose = parseFloat(data[2]) || 0;
          const price = parseFloat(data[3]) || 0;
          const high = parseFloat(data[4]) || 0;
          const low = parseFloat(data[5]) || 0;
          const volume = parseFloat(data[8]) || 0;
          const amount = parseFloat(data[9]) || 0;
          const change = price - prevClose;
          const changePercent = prevClose > 0 ? (change / prevClose) * 100 : 0;
          const date = data[30] || '';
          const time = data[31] || '';
          
          // 计算交易状态
          const now = new Date();
          const hour = now.getHours();
          const minute = now.getMinutes();
          const dayOfWeek = now.getDay();
          
          // 周一到周五，上午9:30-11:30，下午13:00-15:00
          let status: 'trading' | 'closed' = 'closed';
          if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            const isMorningTrading = (hour === 9 && minute >= 30) || (hour === 10) || (hour === 11 && minute < 30);
            const isAfternoonTrading = (hour === 13) || (hour === 14) || (hour === 15 && minute === 0);
            if (isMorningTrading || isAfternoonTrading) {
              status = 'trading';
            }
          }

          stocks.push({
            code,
            name,
            price,
            change,
            changePercent,
            time: `${date} ${time}`,
            status,
            open,
            high,
            low,
            prevClose,
            volume,
            amount,
          });
        }
      }
    }

    return stocks;
  } catch (error) {
    console.error('获取股票数据失败:', error);
    return [];
  }
};

export const getKLineData = async (code: string, scale: number = 60, datalen: number = 1023): Promise<KLineData[]> => {
  try {
    let fullCode = code;
    if (code.startsWith('sh') || code.startsWith('sz')) {
      fullCode = code;
    } else if (code.startsWith('6')) {
      fullCode = `sh${code}`;
    } else if (code.startsWith('0') || code.startsWith('3')) {
      fullCode = `sz${code}`;
    }

    const timestamp = Date.now();
    const url = `https://quotes.sina.cn/cn/api/jsonp_v2.php/var%20_${fullCode}_${scale}_${timestamp}=/CN_MarketDataService.getKLineData?symbol=${fullCode}&scale=${scale}&ma=no&datalen=${datalen}`;

    const response = await stockClient.get(url);
    const text = response.data as string;

    // 移除脚本注释
    const cleanedText = text.replace(/\/\*[\s\S]*?\*\//g, '');
    
    // 匹配 JSON 数据
    const jsonMatch = cleanedText.match(/\=\((\[.*?\])\);?$/s);
    if (!jsonMatch) {
      console.error('[getKLineData] 无法解析JSON数据');
      return [];
    }

    const data: KLineData[] = JSON.parse(jsonMatch[1]);
    return data;
  } catch (error) {
    console.error('获取K线数据失败:', error);
    return [];
  }
};

export const getMarketIndices = async (): Promise<MarketIndex[]> => {
  try {
    const indices = [
      { code: 's_sh000001', name: '上证指数' },
      { code: 's_sz399001', name: '深证成指' },
      { code: 's_sz399006', name: '创业板指' },
      { code: 's_sh000300', name: '沪深300' },
    ];

    const url = `https://hq.sinajs.cn/list=${indices.map(i => i.code).join(',')}`;
    const response = await stockClient.get(url);
    const text = response.data as string;

    const results: MarketIndex[] = [];
    const lines = text.split(';');

    for (let i = 0; i < indices.length; i++) {
      const line = lines[i];
      if (!line || !line.includes('="')) continue;

      const match = line.match(/="([^"]+)"/);
      if (match) {
        const data = match[1].split(',');

        if (data.length >= 4) {
          const price = parseFloat(data[1]) || 0;
          const change = parseFloat(data[2]) || 0;
          const changePercent = parseFloat(data[3]) || 0;

          results.push({
            code: indices[i].code,
            name: indices[i].name,
            price,
            change,
            changePercent,
          });
        }
      }
    }

    return results;
  } catch (error) {
    console.error('获取大盘指数失败:', error);
    return [];
  }
};

export const getMarketData = async (): Promise<MarketData> => {
  try {
    const url = 'https://hq.sinajs.cn/list=s_sh000001';
    const response = await stockClient.get(url);
    const text = response.data as string;

    const match = text.match(/var hq_str_s_sh000001="([^"]+)"/);
    if (match) {
      const data = match[1].split(',');

      if (data.length >= 4) {
        const price = parseFloat(data[1]) || 0;
        const change = parseFloat(data[2]) || 0;
        const changePercent = parseFloat(data[3]) || 0;
        const volume = parseFloat(data[4]) || 0;
        const amount = parseFloat(data[5]) || 0;

        return { amount, volume, change, changePercent };
      }
    }

    return { amount: 0, volume: 0, change: 0, changePercent: 0 };
  } catch (error) {
    console.error('获取大盘数据失败:', error);
    return { amount: 0, volume: 0, change: 0, changePercent: 0 };
  }
};

export const searchStock = async (keyword: string): Promise<StockData[]> => {
  try {
    const url = `https://suggest3.sinajs.cn/suggest/type=11,12&key=${encodeURIComponent(keyword)}`;
    const response = await stockClient.get(url);
    const text = response.data as string;

    const stocks: StockData[] = [];
    const match = text.match(/"([^"]+)"/);

    if (match) {
      const items = match[1].split(';');

      for (const item of items) {
        if (!item.trim()) continue;

        const parts = item.split(',');
        if (parts.length >= 2) {
          const code = parts[2] || parts[0] || '';
          const name = parts[1] || '';

          let fullCode = code;
          if (code.startsWith('6')) {
            fullCode = `sh${code}`;
          } else if (code.startsWith('0') || code.startsWith('3')) {
            fullCode = `sz${code}`;
          }

          try {
            const stockDetail = await getStockData([fullCode]);
            if (stockDetail.length > 0) {
              stocks.push(stockDetail[0]);
            }
          } catch (e) {
            console.error(`获取股票 ${fullCode} 详情失败:`, e);
          }
        }
      }
    }

    return stocks.slice(0, 10);
  } catch (error) {
    console.error('搜索股票失败:', error);
    return [];
  }
};