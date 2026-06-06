export type Task = {
  id: string;
  title: string;
  completed: boolean;
  date: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  carriedFromTaskId?: string;
};

export type WeekDay = {
  day: string;
  date: string;
  isToday: boolean;
  isoDate: string;
};

export type DayTasks = WeekDay & {
  tasks: Task[];
};
