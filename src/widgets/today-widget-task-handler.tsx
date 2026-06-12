'use no memo';

import type { WidgetTaskHandlerProps } from 'react-native-android-widget';

import { readStoredTasks } from '@/storage/weeklist-storage';

import {
  createTodayWidgetSnapshot,
  getLocalIsoDate,
  readTodayWidgetSnapshot,
} from './today-widget-data';
import { TodayAndroidWidget } from './today-widget.android';

export async function todayWidgetTaskHandler({
  widgetAction,
  renderWidget,
}: WidgetTaskHandlerProps) {
  if (
    widgetAction === 'WIDGET_ADDED' ||
    widgetAction === 'WIDGET_UPDATE' ||
    widgetAction === 'WIDGET_RESIZED'
  ) {
    const storedSnapshot = readTodayWidgetSnapshot();
    const snapshot =
      storedSnapshot.date === getLocalIsoDate()
        ? storedSnapshot
        : createTodayWidgetSnapshot(readStoredTasks());

    renderWidget(<TodayAndroidWidget snapshot={snapshot} />);
  }
}
