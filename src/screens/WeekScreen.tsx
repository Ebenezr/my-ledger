import { useMemo } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DaySection } from '@/components/DaySection';
import { useWeeklistStore } from '@/stores/weeklist-store';
import type { DayTasks } from '../types/task';

const dayFormatter = new Intl.DateTimeFormat(undefined, { weekday: 'long' });
const dateFormatter = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' });

function isoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getCurrentWeek() {
  const today = new Date();
  const mondayOffset = (today.getDay() + 6) % 7;
  const monday = new Date(today);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(today.getDate() - mondayOffset);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);

    return {
      day: dayFormatter.format(date).toUpperCase(),
      date: dateFormatter.format(date),
      isoDate: isoDate(date),
    };
  });
}

export function WeekScreen() {
  const { tasks, addTask, deleteTask, editTask, toggleTask } = useWeeklistStore();
  const week = useMemo(() => getCurrentWeek(), []);

  const days: DayTasks[] = useMemo(
    () =>
      week.map((day) => ({
        ...day,
        tasks: tasks.filter((task) => task.date === day.isoDate),
      })),
    [tasks, week],
  );

  return (
    <View style={styles.app}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safe}>
        <View style={styles.topBar}>
          <View>
            <Text selectable style={styles.kicker}>
              WEEKLIST
            </Text>
            <Text selectable style={styles.title}>
              This week
            </Text>
          </View>
          <Text accessibilityLabel="Settings" style={styles.settings}>
            ⚙
          </Text>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {days.map((day) => (
            <DaySection
              key={day.isoDate}
              day={day}
              onToggleTask={toggleTask}
              onAddTask={(title) => addTask(day.isoDate, title)}
              onEditTask={editTask}
              onDeleteTask={deleteTask}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: '#241f1a',
  },
  safe: {
    flex: 1,
    backgroundColor: '#b49a7f',
  },
  topBar: {
    backgroundColor: '#b49a7f',
    paddingHorizontal: 28,
    paddingTop: 18,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    backgroundColor: '#b49a7f',
    paddingBottom: 40,
  },
  kicker: {
    color: '#5d554c',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2,
  },
  title: {
    color: '#221f1b',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 2,
  },
  settings: {
    color: '#5d554c',
    fontSize: 28,
  },
});
