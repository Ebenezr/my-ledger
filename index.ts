import { Platform } from 'react-native';

if (Platform.OS === 'android') {
  const { registerWidgetTaskHandler } = require('react-native-android-widget');
  const { todayWidgetTaskHandler } = require('./src/widgets/today-widget-task-handler');

  registerWidgetTaskHandler(todayWidgetTaskHandler);
}

require('expo-router/entry');
