import { useMemo, useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DaySection } from '@/components/DaySection';
import { useWeeklistStore } from '@/stores/weeklist-store';
import type { DayTasks } from '../types/task';

const dayFormatter = new Intl.DateTimeFormat(undefined, { weekday: 'long' });
const dateFormatter = new Intl.DateTimeFormat(undefined, {
  day: 'numeric',
  month: 'short',
});
const monthFormatter = new Intl.DateTimeFormat(undefined, { month: 'long' });

function isoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getCurrentWeek() {
  const today = new Date();
  const todayIsoDate = isoDate(today);
  const mondayOffset = (today.getDay() + 6) % 7;
  const monday = new Date(today);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(today.getDate() - mondayOffset);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);

    return {
      day: dayFormatter.format(date).toUpperCase(),
      date: dateFormatter.format(date).replace(/^([A-Za-z]+) (\d+)$/, '$2 $1'),
      isToday: isoDate(date) === todayIsoDate,
      isoDate: isoDate(date),
    };
  });
}

function formatWeekRange(week: ReturnType<typeof getCurrentWeek>) {
  const firstDay = new Date(`${week[0].isoDate}T00:00:00`);
  const lastDay = new Date(`${week[week.length - 1].isoDate}T00:00:00`);
  const firstMonth = monthFormatter.format(firstDay);
  const lastMonth = monthFormatter.format(lastDay);

  if (firstMonth === lastMonth) {
    return `${firstMonth} ${firstDay.getDate()} – ${lastDay.getDate()}`;
  }

  return `${firstMonth} ${firstDay.getDate()} – ${lastMonth} ${lastDay.getDate()}`;
}

export function WeekScreen() {
  const { tasks, addTask, deleteTask, editTask, toggleTask } =
    useWeeklistStore();
  const week = useMemo(() => getCurrentWeek(), []);
  const weekRange = useMemo(() => formatWeekRange(week), [week]);
  const todayIsoDate = useMemo(() => isoDate(new Date()), []);
  const [expandedDay, setExpandedDay] = useState(todayIsoDate);

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
      <StatusBar barStyle='dark-content' />
      <SafeAreaView style={styles.safe}>
        <View style={styles.topBar}>
          <View>
            <Text selectable style={styles.kicker}>
              WEEKLIST
            </Text>
            <Text selectable style={styles.kickerSecond}>
              This Week
            </Text>
            <Text selectable style={styles.title}>
              {weekRange}
            </Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {days.map((day) => (
            <DaySection
              key={day.isoDate}
              day={day}
              isExpanded={expandedDay === day.isoDate}
              onToggleExpanded={() =>
                setExpandedDay((current) =>
                  current === day.isoDate ? '' : day.isoDate,
                )
              }
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
    backgroundColor: '#111111',
  },
  safe: {
    flex: 1,
    backgroundColor: '#deddd9',
  },
  topBar: {
    backgroundColor: '#deddd9',
    paddingHorizontal: 28,
    paddingTop: 18,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    backgroundColor: '#deddd9',
    paddingBottom: 40,
  },
  kicker: {
    color: '#67645e',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2,
  },
  kickerSecond: {
    color: '#67645e',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
    paddingTop: 4,
  },
  title: {
    color: '#171717',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 2,
  },
  settings: {
    color: '#67645e',
    fontSize: 28,
  },
});
