import { create } from 'zustand';

import { readStoredTasks, writeStoredTasks } from '@/storage/weeklist-storage';
import type { Task } from '@/types/task';

type WeeklistState = {
  tasks: Task[];
  addTask: (date: string, title: string) => void;
  toggleTask: (taskId: string) => void;
  editTask: (taskId: string, title: string) => void;
  deleteTask: (taskId: string) => void;
};

function taskId() {
  return `task_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function persist(tasks: Task[]) {
  writeStoredTasks(tasks);
  return { tasks };
}

export const useWeeklistStore = create<WeeklistState>((set) => ({
  tasks: readStoredTasks(),
  addTask: (date, title) =>
    set((state) =>
      persist([
        ...state.tasks,
        {
          id: taskId(),
          title,
          completed: false,
          date,
          createdAt: new Date().toISOString(),
        },
      ]),
    ),
  toggleTask: (taskId) =>
    set((state) =>
      persist(
        state.tasks.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task,
        ),
      ),
    ),
  editTask: (taskId, title) =>
    set((state) =>
      persist(state.tasks.map((task) => (task.id === taskId ? { ...task, title } : task))),
    ),
  deleteTask: (taskId) =>
    set((state) => persist(state.tasks.filter((task) => task.id !== taskId))),
}));
