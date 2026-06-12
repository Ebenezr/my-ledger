import {
  readStoredJson,
  writeStoredJson,
} from '@/storage/weeklist-storage';
import type { Task } from '@/types/task';

import { updateTodayWidget } from './today-widget-runtime';

const TODAY_WIDGET_SNAPSHOT_KEY = 'todayWidgetSnapshot';
const MAX_WIDGET_TASKS = 5;

export type TodayWidgetSnapshot = {
  updatedAt: string;
  date: string;
  tasks: {
    id: string;
    title: string;
    completed: boolean;
  }[];
};

export function getLocalIsoDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function createTodayWidgetSnapshot(
  tasks: Task[],
): TodayWidgetSnapshot {
  const date = getLocalIsoDate();

  return {
    updatedAt: new Date().toISOString(),
    date,
    tasks: tasks
      .filter((task) => task.date === date)
      .sort((firstTask, secondTask) => {
        const orderDifference = firstTask.order - secondTask.order;

        if (orderDifference !== 0) {
          return orderDifference;
        }

        return Date.parse(firstTask.createdAt) - Date.parse(secondTask.createdAt);
      })
      .slice(0, MAX_WIDGET_TASKS)
      .map(({ id, title, completed }) => ({ id, title, completed })),
  };
}

export function readTodayWidgetSnapshot() {
  const date = getLocalIsoDate();

  return readStoredJson<TodayWidgetSnapshot>(TODAY_WIDGET_SNAPSHOT_KEY, {
    updatedAt: new Date(0).toISOString(),
    date,
    tasks: [],
  });
}

export function syncTodayWidget(tasks: Task[]): void {
  const snapshot = createTodayWidgetSnapshot(tasks);

  writeStoredJson(TODAY_WIDGET_SNAPSHOT_KEY, snapshot);
  updateTodayWidget(snapshot);
}
