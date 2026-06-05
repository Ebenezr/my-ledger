export type Task = {
  id: string;
  title: string;
  completed: boolean;
  date: string;
  createdAt: string;
};

export type DayTasks = {
  day: string;
  date: string;
  isoDate: string;
  tasks: Task[];
};
