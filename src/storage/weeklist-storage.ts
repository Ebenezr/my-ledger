import type { DayNote, Task } from '@/types/task';

const TASKS_KEY = 'tasks';
const DAY_NOTES_KEY = 'dayNotes';

type StringStorage = {
  getString: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
};

declare const require: (moduleName: string) => {
  createMMKV?: (config: { id: string }) => StringStorage;
};

const memoryValues = new Map<string, string>();
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

function readStoredValue<T>(key: string) {
  const value = getStorage()?.getString(key) ?? memoryValues.get(key);

  if (!value) {
    return [] as T[];
  }

  try {
    return JSON.parse(value) as T[];
  } catch {
    return [] as T[];
  }
}

function writeStoredValue<T>(key: string, items: T[]) {
  const value = JSON.stringify(items);
  memoryValues.set(key, value);
  getStorage()?.set(key, value);
}

export function readStoredJson<T>(key: string, fallback: T) {
  const value = getStorage()?.getString(key) ?? memoryValues.get(key);

  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function writeStoredJson<T>(key: string, value: T) {
  const serializedValue = JSON.stringify(value);
  memoryValues.set(key, serializedValue);
  getStorage()?.set(key, serializedValue);
}

export function readStoredTasks() {
  return readStoredValue<Task>(TASKS_KEY);
}

export function writeStoredTasks(tasks: Task[]) {
  writeStoredValue(TASKS_KEY, tasks);
}

export function readStoredDayNotes() {
  return readStoredValue<DayNote>(DAY_NOTES_KEY);
}

export function writeStoredDayNotes(dayNotes: DayNote[]) {
  writeStoredValue(DAY_NOTES_KEY, dayNotes);
}
