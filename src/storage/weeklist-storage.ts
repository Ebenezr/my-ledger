import type { Task } from '@/types/task';

const TASKS_KEY = 'tasks';

type StringStorage = {
  getString: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
};

declare const require: (moduleName: string) => {
  createMMKV?: (config: { id: string }) => StringStorage;
};

let memoryValue: string | undefined;
let storage: StringStorage | null | undefined;

function getStorage() {
  if (storage !== undefined) {
    return storage;
  }

  try {
    const { createMMKV } = require('react-native-mmkv');
    storage = createMMKV?.({ id: 'weeklist' }) ?? null;
  } catch {
    storage = null;
  }

  return storage;
}

export function readStoredTasks() {
  const value = getStorage()?.getString(TASKS_KEY) ?? memoryValue;

  if (!value) {
    return [];
  }

  try {
    return JSON.parse(value) as Task[];
  } catch {
    return [];
  }
}

export function writeStoredTasks(tasks: Task[]) {
  const value = JSON.stringify(tasks);
  memoryValue = value;
  getStorage()?.set(TASKS_KEY, value);
}
