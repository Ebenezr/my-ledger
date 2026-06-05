import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { DayTasks } from '../types/task';
import { TaskRow } from './TaskRow';

type Props = {
  day: DayTasks;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onToggleTask: (taskId: string) => void;
  onAddTask: (title: string) => void;
  onEditTask: (taskId: string, title: string) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveTaskDown: (taskId: string) => void;
  onMoveTaskUp: (taskId: string) => void;
};

export function DaySection({
  day,
  isExpanded,
  onToggleExpanded,
  onToggleTask,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onMoveTaskDown,
  onMoveTaskUp,
}: Props) {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const taskSummary =
    day.tasks.length === 0
      ? 'No tasks'
      : `${day.tasks.length} ${day.tasks.length === 1 ? 'task' : 'tasks'}`;

  function handleSubmit(title: string) {
    const nextTitle = title.trim();

    if (nextTitle) {
      onAddTask(nextTitle);
    }

    setIsAddingTask(false);
  }

  return (
    <View style={[styles.section, !isExpanded && styles.sectionCollapsed]}>
      <Pressable
        accessibilityRole='button'
        accessibilityState={{ expanded: isExpanded }}
        onPress={onToggleExpanded}
        style={({ pressed }) => [
          styles.heading,
          !isExpanded && styles.headingCollapsed,
          pressed && styles.headingPressed,
        ]}
      >
        <View style={styles.titleColumn}>
          <Text selectable style={styles.day}>
            {day.day}
          </Text>
          {isExpanded ? (
            <Text selectable style={styles.date}>
              {day.date}
              {day.isToday ? ' • Today' : ''}
            </Text>
          ) : null}
        </View>
        {isExpanded && day.tasks.length > 0 ? (
          <Text selectable style={styles.count}>
            {day.tasks.filter((task) => task.completed).length} of{' '}
            {day.tasks.length}
          </Text>
        ) : null}
        {!isExpanded ? (
          <Text selectable style={styles.collapsedCount}>
            {taskSummary}
          </Text>
        ) : null}
      </Pressable>

      {isExpanded ? (
        <View style={styles.tasks}>
          {day.tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onToggle={() => onToggleTask(task.id)}
              onChangeTitle={(title) => onEditTask(task.id, title)}
              onDelete={() => onDeleteTask(task.id)}
              onMoveDown={() => onMoveTaskDown(task.id)}
              onMoveUp={() => onMoveTaskUp(task.id)}
            />
          ))}

          {isAddingTask ? (
            <TextInput
              ref={inputRef}
              autoFocus
              key={`${day.isoDate}-${day.tasks.length}`}
              placeholder='Add a new task...'
              placeholderTextColor='#67645e'
              returnKeyType='done'
              onBlur={() => setIsAddingTask(false)}
              onSubmitEditing={(event) => handleSubmit(event.nativeEvent.text)}
              style={styles.input}
            />
          ) : (
            <Pressable
              accessibilityRole='button'
              onPress={() => {
                setIsAddingTask(true);
                requestAnimationFrame(() => inputRef.current?.focus());
              }}
              style={({ pressed }) => pressed && styles.headingPressed}
            >
              <Text style={styles.addTaskText}>Add a new task...</Text>
            </Pressable>
          )}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    borderBottomWidth: 1,
    borderBottomColor: '#bdb8af',
    paddingHorizontal: 28,
    paddingVertical: 30,
  },
  sectionCollapsed: {
    paddingVertical: 14,
  },
  heading: {
    minHeight: 100,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 18,
  },
  headingCollapsed: {
    minHeight: 58,
    alignItems: 'center',
  },
  headingPressed: {
    opacity: 0.7,
  },
  titleColumn: {
    flex: 1,
  },
  day: {
    fontSize: 40,
    fontWeight: '700',
    letterSpacing: -1,
    color: '#171717',
  },
  date: {
    fontSize: 18,
    color: '#67645e',
    marginTop: 4,
  },
  count: {
    color: '#67645e',
    fontSize: 18,
    fontVariant: ['tabular-nums'],
    paddingTop: 10,
  },
  collapsedCount: {
    color: '#67645e',
    flexShrink: 0,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'right',
  },
  tasks: {
    gap: 10,
  },
  input: {
    fontSize: 18,
    color: '#202020',
    paddingVertical: 2,
    minHeight: 32,
    textDecorationLine: 'none',
  },
  addTaskText: {
    color: '#67645e',
    fontSize: 18,
    minHeight: 32,
    paddingVertical: 2,
    textDecorationLine: 'none',
  },
});
