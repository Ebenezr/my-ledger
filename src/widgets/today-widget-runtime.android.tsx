import { requestWidgetUpdate } from 'react-native-android-widget';

import type { TodayWidgetSnapshot } from './today-widget-data';
import { TodayAndroidWidget } from './today-widget.android';

export function updateTodayWidget(snapshot: TodayWidgetSnapshot): void {
  void requestWidgetUpdate({
    widgetName: 'Today',
    renderWidget: () => <TodayAndroidWidget snapshot={snapshot} />,
  }).catch(() => {
    // Native widget support is unavailable until the development build is installed.
  });
}
