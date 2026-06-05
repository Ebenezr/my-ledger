export type Task = {
  id: string;
  title: string;
  completed: boolean;
  date: string;
  createdAt: string;
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
