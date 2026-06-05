# App Functionality

This document describes the current Weeklist app behavior and implementation.

## Product Overview

Weeklist is a local-first weekly task list. It keeps the interface narrow and calm: one week, seven days, and tasks grouped under the day they belong to.

The main screen answers:

```text
What do I need to do this week?
```

## Main Screen

The root route is `src/app/index.tsx`, which renders `WeekScreen`.

`WeekScreen` is responsible for:

- Building the current Monday-to-Sunday week.
- Formatting the header week range.
- Marking the current day.
- Expanding the current day by default.
- Passing task actions into each day section.

The app header currently shows:

```text
WEEKLIST
This Week
June 1 – 7
```

The range is generated from the current week. If a week crosses months, both month names are shown, for example:

```text
May 31 – June 6
```

## Day Sections

Each day is rendered by `src/components/DaySection.tsx`.

Collapsed days show:

- The weekday name.
- A task summary:
  - `No tasks`
  - `1 task`
  - `2 tasks`

Expanded days show:

- The weekday name.
- The day date, such as `5 Jun`.
- A `Today` marker when the date is the current day, such as `5 Jun • Today`.
- A completed count when tasks exist, such as `2 of 3`.
- The editable task rows.
- An inline `Add a new task...` control.

Only one day is expanded at a time. Tapping the open day collapses it. Tapping another day opens that day.

## Task Management

Tasks are rendered by `src/components/TaskRow.tsx`.

Users can:

- Add a task inline from an expanded day.
- Toggle a task complete or incomplete.
- Edit task text directly in the row.
- Delete a task from the row.

Completed tasks are:

- Checked.
- Struck through.
- Dimmed as a full row.

## Data Model

Task types live in `src/types/task.ts`.

Current task shape:

```ts
type Task = {
  id: string;
  title: string;
  completed: boolean;
  date: string;
  createdAt: string;
};
```

Each task belongs to one ISO date, for example:

```text
2026-06-05
```

Day sections are generated from the current week and populated by filtering tasks by `task.date`.

## State Management

Task state lives in `src/stores/weeklist-store.ts`.

The Zustand store exposes:

- `tasks`
- `addTask(date, title)`
- `toggleTask(taskId)`
- `editTask(taskId, title)`
- `deleteTask(taskId)`

Every mutation persists the full task list after updating state.

## Persistence

Persistence lives in `src/storage/weeklist-storage.ts`.

Storage key:

```text
tasks
```

The storage helper attempts to load `react-native-mmkv` lazily. This avoids crashing in environments that do not have the MMKV native module available.

When MMKV is available:

- Tasks are stored locally on the device.
- No account or network access is required.

When MMKV is unavailable:

- The app falls back to in-memory storage.
- The UI remains usable.
- Data lasts only for the current runtime session.

## Current Design

The current design follows a notebook-like layout:

- One full-screen weekly list.
- Soft warm-gray paper background.
- Dark, large weekday headings.
- Thin section dividers.
- Muted secondary text.
- Orange completed checkboxes.
- Minimal visible controls.

## Known Limitations

- No week navigation yet.
- No drag-and-drop ordering.
- No search.
- No recurring tasks.
- No cloud sync.
- No notifications.
- MMKV persistence requires a native/development build that includes the native module.

## Useful Commands

Type-check:

```bash
npx tsc --noEmit
```

Start development:

```bash
npx expo start
```

Run web:

```bash
npm run web
```

Export web:

```bash
npx expo export --platform web
```
