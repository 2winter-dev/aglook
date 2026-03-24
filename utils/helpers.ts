export const getChangeColor = (change: number) => {
  if (change > 0) return '#F44336';
  if (change < 0) return '#4CAF50';
  return '#999999';
};