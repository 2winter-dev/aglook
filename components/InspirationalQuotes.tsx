import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME_TEXT, THEME_TEXT_SECONDARY, THEME_BG } from '../constants/theme';

const quotes = [
  '投资是一场马拉松，不是短跑',
  '耐心是投资者最好的朋友',
  '不要试图预测市场，要做好应对准备',
  '复利是世界第八大奇迹',
  '在别人恐惧时贪婪，在别人贪婪时恐惧',
  '投资的本质是认知的变现',
  '长期持有优质资产是成功的关键',
  '风险来自于你不知道自己在做什么',
  '市场总是在绝望中诞生，在犹豫中成长，在狂欢中死亡',
  '投资是时间的函数，不是时机的函数'
];

interface InspirationalQuotesProps {
  refresh?: boolean;
}

const InspirationalQuotes: React.FC<InspirationalQuotesProps> = ({ refresh = false }) => {
  const [currentQuote, setCurrentQuote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);

  // 当 refresh prop 变化时，切换到新的励志语句
  React.useEffect(() => {
    if (refresh) {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setCurrentQuote(quotes[randomIndex]);
    }
  }, [refresh]);

  return (
    <View style={styles.container}>
      <Text style={styles.quote}>{currentQuote}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)'
  },
  quote: {
    fontSize: 14,
    lineHeight: 20,
    color: THEME_TEXT_SECONDARY,
    textAlign: 'center',
    fontStyle: 'italic'
  }
});

export default InspirationalQuotes;