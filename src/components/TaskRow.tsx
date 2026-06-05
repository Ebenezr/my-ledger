import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { Task } from '../types/task';

type Props = {
  task: Task;
  onToggle: () => void;
  onChangeTitle: (title: string) => void;
  onDelete: () => void;
};

export function TaskRow({ task, onToggle, onChangeTitle, onDelete }: Props) {
  return (
    <View style={[styles.row, task.completed && styles.rowDone]}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: task.completed }}
        hitSlop={10}
        onPress={onToggle}
        style={[styles.checkbox, task.completed && styles.checkboxDone]}>
        {task.completed && <Text style={styles.check}>✓</Text>}
      </Pressable>

      <TextInput
        value={task.title}
        onChangeText={onChangeTitle}
        placeholder="Task"
        placeholderTextColor="#67645e"
        returnKeyType="done"
        style={[styles.title, task.completed && styles.titleDone]}
      />

      <Pressable
        accessibilityLabel={`Delete ${task.title}`}
        hitSlop={10}
        onPress={onDelete}
        style={({ pressed }) => [styles.deleteButton, pressed && styles.pressed]}>
        <Text style={styles.deleteText}>×</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 32,
  },
  rowDone: {
    opacity: 0.48,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#77726a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: {
    backgroundColor: '#c9491d',
    borderColor: '#c9491d',
  },
  check: {
    color: '#171717',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 20,
  },
  title: {
    flex: 1,
    color: '#202020',
    fontSize: 20,
    lineHeight: 24,
    paddingVertical: 0,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: '#67645e',
  },
  deleteButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.5,
  },
  deleteText: {
    color: '#67645e',
    fontSize: 24,
    lineHeight: 28,
  },
});
