# Weeklist

Weeklist is a simple weekly task manager built with Expo Router, React Native, TypeScript, Zustand, and MMKV.

The app is intentionally focused on one question:

> What do I need to do this week?

It shows the current week as a continuous list of days. Each day can be expanded to manage its tasks inline, without navigating to another screen.

## Current Functionality

- Generates the current Monday-to-Sunday week automatically from the device date.
- Shows the week range in the header, for example `June 1 – 7`.
- Lets users move to previous and future weeks with subtle header arrows.
- Shows a small `Today` button when viewing a non-current week.
- Collapses all days by default except the current day.
- For non-current weeks, expands the first day that has tasks, or Monday when the week has no tasks.
- Lets users tap a day header to expand or collapse it.
- Shows task totals while a day is collapsed, such as `No tasks`, `1 task`, or `3 tasks`.
- Marks the current day with `Today`, for example `5 Jun • Today`.
- Supports creating tasks inline.
- Supports editing task titles inline.
- Supports completing and uncompleting tasks with a checkbox.
- Dims completed tasks and keeps them struck through.
- Supports deleting tasks from the day list.
- Persists tasks locally through MMKV when the native module is available.
- Falls back to in-memory storage when MMKV is unavailable, such as in an Expo Go session without the native module.

More details are in [docs/APP_FUNCTIONALITY.md](docs/APP_FUNCTIONALITY.md).

## Tech Stack

- Expo SDK 56
- Expo Router
- React Native 0.85
- React 19
- TypeScript
- Zustand
- react-native-mmkv

## Project Structure

```text
src/
  app/
    _layout.tsx        Expo Router stack layout
    index.tsx          Root route that renders WeekScreen
  components/
    DaySection.tsx     Expandable day section and inline add-task control
    TaskRow.tsx        Editable task row with complete/delete actions
  screens/
    WeekScreen.tsx     Current-week screen and date generation
  storage/
    weeklist-storage.ts  MMKV-backed task persistence with fallback
  stores/
    weeklist-store.ts  Zustand task state and mutations
  types/
    task.ts            Task and day types
  utils/
    week.ts            Generated week dates, range labels, default expansion
```

## Getting Started

Install dependencies:

```bash
npm install
```

Start the Expo dev server:

```bash
npx expo start
```

Run on web:

```bash
npm run web
```

Run on iOS or Android:

```bash
npm run ios
npm run android
```

## Native Storage Note

Weeklist uses `react-native-mmkv`, which depends on native modules. For persistent storage on iOS or Android, run the app in a development/native build that includes the MMKV and Nitro modules.

Expo Go may not include those native modules. In that case the app still runs, but task storage falls back to memory for the current session.

## Verification

Run TypeScript checks:

```bash
npx tsc --noEmit
```

Build/export the web app:

```bash
npx expo export --platform web
```

## Non-Goals

Weeklist is not a calendar, project management system, or collaboration tool. It does not currently include monthly views, time slots, recurring rules, accounts, cloud sync, priorities, or notifications.
