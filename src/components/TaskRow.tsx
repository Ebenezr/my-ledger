import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import ReanimatedSwipeable, {
  type SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import type { Task } from '../types/task';

type Props = {
  task: Task;
  onToggle: () => void;
  onChangeTitle: (title: string) => void;
  onDelete: () => void;
};

export function TaskRow({
  task,
  onToggle,
  onChangeTitle,
  onDelete,
}: Props) {
  function renderAction(
    label: string,
    style: typeof styles.doneAction | typeof styles.deleteAction,
    onPress: () => void,
    swipeable: SwipeableMethods,
  ) {
    return (
      <Pressable
        accessibilityRole='button'
        onPress={() => {
          swipeable.close();
          onPress();
        }}
        style={({ pressed }) => [
          styles.action,
          style,
          pressed && styles.actionPressed,
        ]}
      >
        <Text style={styles.actionText}>{label}</Text>
      </Pressable>
    );
  }

  return (
    <ReanimatedSwipeable
      containerStyle={styles.swipeable}
      dragOffsetFromLeftEdge={12}
      dragOffsetFromRightEdge={12}
      friction={2}
      leftThreshold={44}
      overshootLeft={false}
      overshootRight={false}
      renderLeftActions={(_, __, swipeable) =>
        renderAction(
          task.completed ? 'Undo' : 'Done',
          styles.doneAction,
          onToggle,
          swipeable,
        )
      }
      renderRightActions={(_, __, swipeable) =>
        renderAction('Delete', styles.deleteAction, onDelete, swipeable)
      }
      rightThreshold={44}
    >
      <View style={[styles.row, task.completed && styles.rowDone]}>
        <Pressable
          accessibilityRole='checkbox'
          accessibilityState={{ checked: task.completed }}
          hitSlop={10}
          onPress={onToggle}
          style={[styles.checkbox, task.completed && styles.checkboxDone]}
        >
          {task.completed && <Text style={styles.check}>✓</Text>}
        </Pressable>

        <TextInput
          value={task.title}
          onChangeText={onChangeTitle}
          placeholder='Task'
          placeholderTextColor='#67645e'
          returnKeyType='done'
          style={[styles.title, task.completed && styles.titleDone]}
        />
      </View>
    </ReanimatedSwipeable>
  );
}

const styles = StyleSheet.create({
  swipeable: {
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 44,
    backgroundColor: '#deddd9',
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
  action: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    width: 92,
  },
  doneAction: {
    backgroundColor: '#c9491d',
  },
  deleteAction: {
    backgroundColor: '#a65349',
  },
  actionText: {
    color: '#f5f1ea',
    fontSize: 15,
    fontWeight: '700',
  },
  actionPressed: {
    opacity: 0.75,
  },
});
