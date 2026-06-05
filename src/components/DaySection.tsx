import { StyleSheet, Text, TextInput, View } from 'react-native';
import type { DayTasks } from '../types/task';
import { TaskRow } from './TaskRow';

type Props = {
  day: DayTasks;
  onToggleTask: (taskId: string) => void;
  onAddTask: (title: string) => void;
  onEditTask: (taskId: string, title: string) => void;
  onDeleteTask: (taskId: string) => void;
};

export function DaySection({
  day,
  onToggleTask,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: Props) {
  function handleSubmit(title: string) {
    const nextTitle = title.trim();

    if (nextTitle) {
      onAddTask(nextTitle);
    }
  }

  return (
    <View style={styles.section}>
      <View style={styles.heading}>
        <View>
          <Text selectable style={styles.day}>
            {day.day}
          </Text>
          <Text selectable style={styles.date}>
            {day.date}
          </Text>
        </View>
        {day.tasks.length > 0 ? (
          <Text selectable style={styles.count}>
            {day.tasks.filter((task) => task.completed).length}/{day.tasks.length}
          </Text>
        ) : null}
      </View>

      <View style={styles.tasks}>
        {day.tasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            onToggle={() => onToggleTask(task.id)}
            onChangeTitle={(title) => onEditTask(task.id, title)}
            onDelete={() => onDeleteTask(task.id)}
          />
        ))}

        <TextInput
          key={`${day.isoDate}-${day.tasks.length}`}
          placeholder="Add a new task..."
          placeholderTextColor="#5d554c"
          returnKeyType="done"
          onSubmitEditing={(event) => handleSubmit(event.nativeEvent.text)}
          style={styles.input}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    borderBottomWidth: 1,
    borderBottomColor: '#74695c',
    paddingHorizontal: 28,
    paddingVertical: 30,
  },
  heading: {
    minHeight: 96,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 18,
  },
  day: {
    fontSize: 46,
    fontWeight: '900',
    letterSpacing: -1,
    color: '#221f1b',
  },
  date: {
    fontSize: 18,
    color: '#5d554c',
    marginTop: 4,
  },
  count: {
    color: '#5d554c',
    fontSize: 18,
    fontVariant: ['tabular-nums'],
    paddingTop: 10,
  },
  tasks: {
    gap: 10,
  },
  input: {
    fontSize: 18,
    color: '#2c2924',
    paddingVertical: 2,
    minHeight: 32,
  },
});
