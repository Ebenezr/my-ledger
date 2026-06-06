import { StyleSheet, Text, View } from 'react-native';

type Props = {
  totalTasks: number;
  completedTasks: number;
};

export function WeeklySummary({ totalTasks, completedTasks }: Props) {
  const completionPercentage =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <View style={styles.container}>
      <Text selectable style={styles.completedText}>
        {completedTasks} of {totalTasks} completed
      </Text>
      <Text selectable style={styles.percentage}>
        {completionPercentage}%
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'baseline',
    borderBottomColor: '#bdb8af',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingVertical: 14,
  },
  completedText: {
    color: '#67645e',
    fontSize: 14,
    fontWeight: '600',
  },
  percentage: {
    color: '#67645e',
    fontSize: 18,
    fontVariant: ['tabular-nums'],
    fontWeight: '700',
  },
});
