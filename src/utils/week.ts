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

export function getStartOfWeek(date: Date) {
  const startOfWeek = new Date(date);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(startOfWeek.getDate() - ((startOfWeek.getDay() + 6) % 7));

  return startOfWeek;
}

export function getWeekOffsetFromDate(date: Date) {
  const selectedWeek = getStartOfWeek(date);
  const currentWeek = getStartOfWeek(new Date());
  const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000;

  return Math.round(
    (selectedWeek.getTime() - currentWeek.getTime()) / millisecondsPerWeek,
  );
}

export function isToday(date: Date) {
  return isoDate(date) === isoDate(new Date());
}

export function getWeekDays(weekOffset: number) {
  const today = new Date();
  const monday = getStartOfWeek(today);
  monday.setDate(monday.getDate() + weekOffset * 7);

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
