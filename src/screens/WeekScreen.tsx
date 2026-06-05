import { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DaySection } from '@/components/DaySection';
import { sortTasksByOrder, useWeeklistStore } from '@/stores/weeklist-store';
import {
  formatWeekRange,
  getDefaultExpandedDay,
  getWeekDays,
} from '@/utils/week';
import type { DayTasks } from '../types/task';

export function WeekScreen() {
  const {
    tasks,
    addTask,
    deleteTask,
    editTask,
    moveTaskDown,
    moveTaskUp,
    toggleTask,
  } = useWeeklistStore();
  const [weekOffset, setWeekOffset] = useState(0);
  const week = useMemo(() => getWeekDays(weekOffset), [weekOffset]);
  const weekRange = useMemo(() => formatWeekRange(week), [week]);
  const defaultExpandedDay = useMemo(
    () => getDefaultExpandedDay(week, tasks, weekOffset),
    [tasks, week, weekOffset],
  );
  const [expandedDay, setExpandedDay] = useState(defaultExpandedDay);

  useEffect(() => {
    setExpandedDay(defaultExpandedDay);
  }, [defaultExpandedDay]);

  const days: DayTasks[] = useMemo(
    () =>
      week.map((day) => ({
        ...day,
        tasks: sortTasksByOrder(tasks.filter((task) => task.date === day.isoDate)),
      })),
    [tasks, week],
  );

  return (
    <View style={styles.app}>
      <StatusBar barStyle='dark-content' />
      <SafeAreaView style={styles.safe}>
        <View style={styles.topBar}>
          <View style={styles.headerContent}>
            <Text selectable style={styles.kicker}>
              WEEKLIST
            </Text>
            <View style={styles.rangeRow}>
              <Text selectable style={styles.title}>
                {weekRange}
              </Text>

              <View style={styles.weekControls}>
                {weekOffset !== 0 ? (
                  <Pressable
                    accessibilityRole='button'
                    onPress={() => setWeekOffset(0)}
                    style={({ pressed }) => [
                      styles.todayButton,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Text style={styles.todayButtonText}>Today</Text>
                  </Pressable>
                ) : null}

                <Pressable
                  accessibilityLabel='Previous week'
                  accessibilityRole='button'
                  hitSlop={10}
                  onPress={() => setWeekOffset((current) => current - 1)}
                  style={({ pressed }) => [styles.arrowButton, pressed && styles.pressed]}
                >
                  <Text style={styles.arrowText}>‹</Text>
                </Pressable>

                <Pressable
                  accessibilityLabel='Next week'
                  accessibilityRole='button'
                  hitSlop={10}
                  onPress={() => setWeekOffset((current) => current + 1)}
                  style={({ pressed }) => [styles.arrowButton, pressed && styles.pressed]}
                >
                  <Text style={styles.arrowText}>›</Text>
                </Pressable>
              </View>
            </View>
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
              onMoveTaskDown={moveTaskDown}
              onMoveTaskUp={moveTaskUp}
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
  headerContent: {
    flex: 1,
  },
  rangeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
    justifyContent: 'space-between',
    paddingTop: 2,
  },
  weekControls: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
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
  title: {
    color: '#171717',
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 2,
  },
  todayButton: {
    borderColor: '#bdb8af',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  todayButtonText: {
    color: '#67645e',
    fontSize: 13,
    fontWeight: '700',
  },
  arrowButton: {
    alignItems: 'center',
    height: 34,
    justifyContent: 'center',
    width: 28,
  },
  arrowText: {
    color: '#67645e',
    fontSize: 30,
    fontWeight: '400',
    lineHeight: 32,
  },
  pressed: {
    opacity: 0.5,
  },
  settings: {
    color: '#67645e',
    fontSize: 28,
  },
});
