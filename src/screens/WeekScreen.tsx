import { useEffect, useMemo, useState } from 'react';
import DateTimePicker, {
  DateTimePickerAndroid,
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CarryForwardPrompt } from '@/components/CarryForwardPrompt';
import { DaySection } from '@/components/DaySection';
import { WeeklySummary } from '@/components/WeeklySummary';
import { sortTasksByOrder, useWeeklistStore } from '@/stores/weeklist-store';
import {
  formatWeekRange,
  getDefaultExpandedDay,
  getWeekOffsetFromDate,
  getWeekDays,
} from '@/utils/week';
import type { DayTasks } from '../types/task';

export function WeekScreen() {
  const {
    tasks,
    dayNotes,
    addTask,
    addOrUpdateDayNote,
    carryForwardTasks,
    deleteTask,
    editTask,
    reorderTasks,
    toggleTask,
  } = useWeeklistStore();
  const [weekOffset, setWeekOffset] = useState(0);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isTaskDragging, setIsTaskDragging] = useState(false);
  const week = useMemo(() => getWeekDays(weekOffset), [weekOffset]);
  const currentWeek = useMemo(() => getWeekDays(0), []);
  const previousWeek = useMemo(() => getWeekDays(-1), []);
  const weekRange = useMemo(() => formatWeekRange(week), [week]);
  const defaultExpandedDay = useMemo(
    () => getDefaultExpandedDay(week, tasks, weekOffset),
    [tasks, week, weekOffset],
  );
  const [expandedDay, setExpandedDay] = useState(defaultExpandedDay);
  const [dismissedCarryForwardKey, setDismissedCarryForwardKey] = useState<
    string | null
  >(null);

  useEffect(() => {
    setExpandedDay(defaultExpandedDay);
  }, [defaultExpandedDay]);

  function selectDate(date: Date) {
    setSelectedDate(date);
    setWeekOffset(getWeekOffsetFromDate(date));
    setPickerVisible(false);
  }

  function handleDateChange(event: DateTimePickerEvent, date?: Date) {
    if (event.type === 'set' && date) {
      selectDate(date);
    }
  }

  function openDatePicker() {
    const visibleWeekDate = new Date(`${week[0].isoDate}T00:00:00`);
    setSelectedDate(visibleWeekDate);

    if (process.env.EXPO_OS === 'android') {
      DateTimePickerAndroid.open({
        value: visibleWeekDate,
        mode: 'date',
        display: 'calendar',
        title: 'Choose a date',
        positiveButton: {
          label: 'Go',
          textColor: '#c9491d',
        },
        negativeButton: {
          label: 'Cancel',
          textColor: '#67645e',
        },
        onChange: handleDateChange,
      });
      return;
    }

    setPickerVisible(true);
  }

  const days: DayTasks[] = useMemo(
    () =>
      week.map((day) => ({
        ...day,
        tasks: sortTasksByOrder(tasks.filter((task) => task.date === day.isoDate)),
      })),
    [tasks, week],
  );
  const tasksToCarry = useMemo(() => {
    const currentWeekDates = new Set(currentWeek.map((day) => day.isoDate));
    const alreadyCarriedIds = new Set(
      tasks
        .filter(
          (task) =>
            currentWeekDates.has(task.date) && task.carriedFromTaskId,
        )
        .map((task) => task.carriedFromTaskId as string),
    );

    return previousWeek.flatMap((day) =>
      sortTasksByOrder(
        tasks.filter(
          (task) =>
            task.date === day.isoDate &&
            !task.completed &&
            !alreadyCarriedIds.has(task.id),
        ),
      ),
    );
  }, [currentWeek, previousWeek, tasks]);
  const carryForwardKey = useMemo(
    () => tasksToCarry.map((task) => task.id).join(':'),
    [tasksToCarry],
  );
  const showCarryForwardPrompt =
    weekOffset === 0 &&
    tasksToCarry.length > 0 &&
    dismissedCarryForwardKey !== carryForwardKey;
  const weeklyMetrics = useMemo(() => {
    const visibleTasks = days.flatMap((day) => day.tasks);
    const completedTasks = visibleTasks.filter((task) => task.completed).length;
    const totalTasks = visibleTasks.length;

    return {
      completedTasks,
      incompleteTasks: totalTasks - completedTasks,
      completionPercentage:
        totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100),
      totalTasks,
    };
  }, [days]);

  return (
    <View style={styles.app}>
      <StatusBar barStyle='dark-content' />
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
          style={styles.keyboardAvoiding}
        >
          <View style={styles.topBar}>
            <View style={styles.headerContent}>
              <Text selectable style={styles.kicker}>
                WEEKLIST
              </Text>
              <View style={styles.rangeRow}>
                <Pressable
                  accessibilityLabel={`Jump to another week. Current range: ${weekRange}`}
                  accessibilityRole='button'
                  onPress={openDatePicker}
                  style={({ pressed }) => [
                    styles.rangeButton,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text selectable style={styles.title}>
                    {weekRange}
                  </Text>
                </Pressable>

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

          <ScrollView
            contentContainerStyle={styles.content}
            keyboardDismissMode='interactive'
            keyboardShouldPersistTaps='handled'
            scrollEnabled={!isTaskDragging}
            style={styles.scroll}
          >
            {showCarryForwardPrompt ? (
              <CarryForwardPrompt
                count={tasksToCarry.length}
                onCarryForward={() =>
                  carryForwardTasks(
                    tasksToCarry.map((task) => task.id),
                    currentWeek[0].isoDate,
                  )
                }
                onDismiss={() => setDismissedCarryForwardKey(carryForwardKey)}
              />
            ) : null}

            <WeeklySummary
              completedTasks={weeklyMetrics.completedTasks}
              totalTasks={weeklyMetrics.totalTasks}
            />

            {days.map((day) => (
              <DaySection
                key={day.isoDate}
                day={day}
                note={dayNotes.find((note) => note.date === day.isoDate)}
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
                onReorderTasks={reorderTasks}
                onDragStateChange={setIsTaskDragging}
                onChangeNote={addOrUpdateDayNote}
              />
            ))}
          </ScrollView>
        </KeyboardAvoidingView>

        {process.env.EXPO_OS === 'ios' ? (
          <Modal
            animationType='fade'
            onRequestClose={() => setPickerVisible(false)}
            transparent
            visible={pickerVisible}
          >
            <Pressable
              accessibilityRole='button'
              onPress={() => setPickerVisible(false)}
              style={styles.pickerBackdrop}
            >
              <Pressable
                onPress={(event) => event.stopPropagation()}
                style={styles.pickerContainer}
              >
                <View style={styles.pickerSurface}>
                  <View style={styles.pickerHeader}>
                    <View>
                      <Text style={styles.pickerKicker}>WEEKLIST</Text>
                      <Text style={styles.pickerTitle}>Choose a date</Text>
                    </View>

                    <Pressable
                      accessibilityLabel='Close date picker'
                      accessibilityRole='button'
                      hitSlop={10}
                      onPress={() => setPickerVisible(false)}
                      style={({ pressed }) => [
                        styles.pickerClose,
                        pressed && styles.pressed,
                      ]}
                    >
                      <Text style={styles.pickerCloseText}>×</Text>
                    </Pressable>
                  </View>

                  <DateTimePicker
                    accentColor='#c9491d'
                    display='inline'
                    mode='date'
                    onChange={handleDateChange}
                    style={styles.datePicker}
                    themeVariant='light'
                    value={selectedDate}
                  />
                </View>
              </Pressable>
            </Pressable>
          </Modal>
        ) : null}
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
  keyboardAvoiding: {
    flex: 1,
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
  rangeButton: {
    flex: 1,
  },
  weekControls: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  content: {
    backgroundColor: '#deddd9',
    paddingBottom: 160,
  },
  scroll: {
    flex: 1,
  },
  kicker: {
    color: '#67645e',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2,
  },
  title: {
    color: '#171717',
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
  pickerBackdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(23, 23, 23, 0.34)',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  pickerContainer: {
    maxWidth: 390,
    width: '100%',
  },
  pickerSurface: {
    backgroundColor: '#deddd9',
    borderRadius: 8,
    borderColor: '#bdb8af',
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    paddingBottom: 8,
  },
  pickerHeader: {
    alignItems: 'center',
    borderBottomColor: '#c9c5be',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  pickerKicker: {
    color: '#77736d',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
  },
  pickerTitle: {
    color: '#171717',
    fontSize: 19,
    fontWeight: '700',
    paddingTop: 2,
  },
  pickerClose: {
    alignItems: 'center',
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  pickerCloseText: {
    color: '#67645e',
    fontSize: 30,
    fontWeight: '300',
    lineHeight: 32,
  },
  datePicker: {
    backgroundColor: '#deddd9',
    alignSelf: 'center',
    width: 340,
  },
  settings: {
    color: '#67645e',
    fontSize: 28,
  },
});
