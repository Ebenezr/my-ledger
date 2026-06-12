import { HStack, Text, VStack } from '@expo/ui/swift-ui';
import {
  containerBackground,
  font,
  foregroundStyle,
  lineLimit,
  opacity,
  padding,
  strikethrough,
  widgetURL,
} from '@expo/ui/swift-ui/modifiers';
import { createWidget } from 'expo-widgets';

import type { TodayWidgetSnapshot } from './today-widget-data';

function TodayWidgetView(snapshot: TodayWidgetSnapshot) {
  'widget';

  return (
    <VStack
      alignment="leading"
      spacing={5}
      modifiers={[
        padding({ all: 16 }),
        containerBackground('#F8F6F1', 'widget'),
        widgetURL('myledger:///'),
      ]}
    >
      <Text
        modifiers={[
          font({ size: 11, weight: 'bold' }),
          foregroundStyle('#6E6259'),
        ]}
      >
        MY-LEDGER
      </Text>
      <Text
        modifiers={[
          font({ size: 20, weight: 'bold' }),
          foregroundStyle('#171717'),
        ]}
      >
        Today
      </Text>
      {snapshot.tasks.length === 0 ? (
        <Text
          modifiers={[
            padding({ top: 8 }),
            font({ size: 14 }),
            foregroundStyle('#77716B'),
          ]}
        >
          No tasks today
        </Text>
      ) : (
        snapshot.tasks.map((task) => (
          <HStack key={task.id} spacing={7} alignment="center">
            <Text
              modifiers={[
                font({ size: 15 }),
                foregroundStyle(task.completed ? '#9B928A' : '#C9491D'),
              ]}
            >
              {task.completed ? '☑' : '☐'}
            </Text>
            <Text
              modifiers={[
                font({ size: 14 }),
                foregroundStyle(task.completed ? '#9B928A' : '#2D2926'),
                opacity(task.completed ? 0.7 : 1),
                strikethrough({
                  isActive: task.completed,
                  pattern: 'solid',
                  color: '#9B928A',
                }),
                lineLimit(1),
              ]}
            >
              {task.title}
            </Text>
          </HStack>
        ))
      )}
    </VStack>
  );
}

export default createWidget<TodayWidgetSnapshot>(
  'TodayWidget',
  TodayWidgetView,
);
