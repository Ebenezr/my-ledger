import { Pressable, StyleSheet, Text, View } from 'react-native';

type CarryForwardPromptProps = {
  count: number;
  onCarryForward: () => void;
  onDismiss?: () => void;
};

export function CarryForwardPrompt({
  count,
  onCarryForward,
  onDismiss,
}: CarryForwardPromptProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{count} unfinished from last week</Text>

      <View style={styles.actions}>
        {onDismiss ? (
          <Pressable
            accessibilityRole='button'
            hitSlop={10}
            onPress={onDismiss}
          >
            <Text style={styles.dismiss}>Dismiss</Text>
          </Pressable>
        ) : null}

        <Pressable
          accessibilityRole='button'
          hitSlop={10}
          onPress={onCarryForward}
        >
          <Text style={styles.carryForward}>Carry forward</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderBottomColor: '#bdb8af',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 58,
    paddingHorizontal: 28,
    paddingVertical: 12,
  },
  message: {
    color: '#67645e',
    flex: 1,
    fontSize: 15,
    lineHeight: 21,
  },
  actions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 18,
    marginLeft: 18,
  },
  dismiss: {
    color: '#77736d',
    fontSize: 14,
  },
  carryForward: {
    color: '#24221f',
    fontSize: 14,
    fontWeight: '700',
  },
});
