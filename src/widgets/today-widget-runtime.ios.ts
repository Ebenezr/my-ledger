import type { TodayWidgetSnapshot } from './today-widget-data';
import TodayIosWidget from './today-widget.ios';

export function updateTodayWidget(snapshot: TodayWidgetSnapshot): void {
  TodayIosWidget.updateSnapshot(snapshot);
}
