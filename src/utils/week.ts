import type { Task, WeekDay } from '@/types/task';

const dayFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'long' });
const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'long' });
const monthShortFormatter = new Intl.DateTimeFormat('en-US', { month: 'short' });

function isoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(date.getDate() + days);

  return nextDate;
}

function fromIsoDate(value: string) {
  return new Date(`${value}T00:00:00`);
}

export function isToday(date: Date) {
  return isoDate(date) === isoDate(new Date());
}

export function getWeekDays(weekOffset: number) {
  const today = new Date();
  const mondayOffset = (today.getDay() + 6) % 7;
  const monday = new Date(today);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(today.getDate() - mondayOffset + weekOffset * 7);

  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(monday, index);

    return {
      day: dayFormatter.format(date).toUpperCase(),
      date: `${date.getDate()} ${monthShortFormatter.format(date)}`,
      isToday: isToday(date),
      isoDate: isoDate(date),
    };
  });
}

export function formatWeekRange(days: WeekDay[]) {
  const firstDay = fromIsoDate(days[0].isoDate);
  const lastDay = fromIsoDate(days[days.length - 1].isoDate);
  const firstMonth = monthFormatter.format(firstDay);
  const lastMonth = monthFormatter.format(lastDay);

  if (firstMonth === lastMonth) {
    return `${firstMonth} ${firstDay.getDate()} – ${lastDay.getDate()}`;
  }

  return `${firstMonth} ${firstDay.getDate()} – ${lastMonth} ${lastDay.getDate()}`;
}

export function getDefaultExpandedDay(days: WeekDay[], tasks: Task[], weekOffset: number) {
  if (weekOffset === 0) {
    return days.find((day) => day.isToday)?.isoDate ?? days[0].isoDate;
  }

  const taskDates = new Set(tasks.map((task) => task.date));

  return days.find((day) => taskDates.has(day.isoDate))?.isoDate ?? days[0].isoDate;
}
