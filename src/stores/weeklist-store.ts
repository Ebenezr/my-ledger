import { create } from 'zustand';

import { readStoredTasks, writeStoredTasks } from '@/storage/weeklist-storage';
import type { Task } from '@/types/task';

type WeeklistState = {
  tasks: Task[];
  addTask: (date: string, title: string) => void;
  toggleTask: (taskId: string) => void;
  editTask: (taskId: string, title: string) => void;
  deleteTask: (taskId: string) => void;
  moveTaskUp: (taskId: string) => void;
  moveTaskDown: (taskId: string) => void;
};

function taskId() {
  return `task_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function taskSortValue(task: Task) {
  const createdAtTime = Date.parse(task.createdAt);

  if (Number.isFinite(task.order)) {
    return task.order;
  }

  return Number.isFinite(createdAtTime) ? createdAtTime : 0;
}

export function sortTasksByOrder(tasks: Task[]) {
  return [...tasks].sort((firstTask, secondTask) => {
    const orderDifference = taskSortValue(firstTask) - taskSortValue(secondTask);

    if (orderDifference !== 0) {
      return orderDifference;
    }

    return Date.parse(firstTask.createdAt) - Date.parse(secondTask.createdAt);
  });
}

function nextOrderForDate(tasks: Task[], date: string) {
  const dayTasks = tasks.filter((task) => task.date === date);

  if (dayTasks.length === 0) {
    return 0;
  }

  return Math.max(...dayTasks.map(taskSortValue)) + 1;
}

function normalizeTasks(tasks: Task[]) {
  const tasksByDate = new Map<string, Task[]>();

  tasks.forEach((task) => {
    tasksByDate.set(task.date, [...(tasksByDate.get(task.date) ?? []), task]);
  });

  return [...tasksByDate.values()].flatMap((dayTasks) =>
    sortTasksByOrder(dayTasks).map((task, index) => ({
      ...task,
      order: Number.isFinite(task.order) ? task.order : index,
      updatedAt: task.updatedAt ?? task.createdAt,
    })),
  );
}

function persist(tasks: Task[]) {
  writeStoredTasks(tasks);
  return { tasks };
}

function moveTask(tasks: Task[], taskId: string, direction: -1 | 1) {
  const task = tasks.find((candidateTask) => candidateTask.id === taskId);

  if (!task) {
    return tasks;
  }

  const dayTasks = sortTasksByOrder(tasks.filter((dayTask) => dayTask.date === task.date));
  const currentIndex = dayTasks.findIndex((dayTask) => dayTask.id === taskId);
  const nextIndex = currentIndex + direction;

  if (currentIndex < 0 || nextIndex < 0 || nextIndex >= dayTasks.length) {
    return tasks;
  }

  const currentTask = dayTasks[currentIndex];
  const nextTask = dayTasks[nextIndex];
  const now = new Date().toISOString();

  return tasks.map((candidateTask) => {
    if (candidateTask.id === currentTask.id) {
      return {
        ...candidateTask,
        order: taskSortValue(nextTask),
        updatedAt: now,
      };
    }

    if (candidateTask.id === nextTask.id) {
      return {
        ...candidateTask,
        order: taskSortValue(currentTask),
        updatedAt: now,
      };
    }

    return candidateTask;
  });
}

export const useWeeklistStore = create<WeeklistState>((set) => ({
  tasks: normalizeTasks(readStoredTasks()),
  addTask: (date, title) =>
    set((state) => {
      const now = new Date().toISOString();

      return persist([
        ...state.tasks,
        {
          id: taskId(),
          title,
          completed: false,
          date,
          order: nextOrderForDate(state.tasks, date),
          createdAt: now,
          updatedAt: now,
        },
      ]);
    }),
  toggleTask: (taskId) =>
    set((state) =>
      persist(
        state.tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                completed: !task.completed,
                updatedAt: new Date().toISOString(),
              }
            : task,
        ),
      ),
    ),
  editTask: (taskId, title) =>
    set((state) =>
      persist(
        state.tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                title,
                updatedAt: new Date().toISOString(),
              }
            : task,
        ),
      ),
    ),
  deleteTask: (taskId) =>
    set((state) => persist(state.tasks.filter((task) => task.id !== taskId))),
  moveTaskUp: (taskId) => set((state) => persist(moveTask(state.tasks, taskId, -1))),
  moveTaskDown: (taskId) => set((state) => persist(moveTask(state.tasks, taskId, 1))),
}));
