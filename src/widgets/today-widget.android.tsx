'use no memo';

import {
  FlexWidget,
  TextWidget,
} from 'react-native-android-widget';

import type { TodayWidgetSnapshot } from './today-widget-data';

type Props = {
  snapshot: TodayWidgetSnapshot;
};

export function TodayAndroidWidget({ snapshot }: Props) {
  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{
        width: 'match_parent',
        height: 'match_parent',
        padding: 16,
        backgroundColor: '#F8F6F1',
        borderRadius: 20,
        flexDirection: 'column',
        flexGap: 5,
      }}
    >
      <TextWidget
        text="MY-LEDGER"
        style={{ color: '#6E6259', fontSize: 11, fontWeight: 'bold' }}
      />
      <TextWidget
        text="Today"
        style={{ color: '#171717', fontSize: 20, fontWeight: 'bold' }}
      />
      {snapshot.tasks.length === 0 ? (
        <TextWidget
          text="No tasks today"
          style={{ color: '#77716B', fontSize: 14, marginTop: 8 }}
        />
      ) : (
        snapshot.tasks.map((task) => (
          <FlexWidget
            key={task.id}
            style={{ flexDirection: 'row', alignItems: 'center', flexGap: 7 }}
          >
            <TextWidget
              text={task.completed ? '☑' : '☐'}
              style={{
                color: task.completed ? '#9B928A' : '#C9491D',
                fontSize: 15,
              }}
            />
            <TextWidget
              text={task.title}
              maxLines={1}
              truncate="END"
              style={{
                color: task.completed ? '#9B928A' : '#2D2926',
                fontSize: 14,
              }}
            />
          </FlexWidget>
        ))
      )}
    </FlexWidget>
  );
}
