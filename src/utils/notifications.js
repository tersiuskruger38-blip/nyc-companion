import * as Notifications from 'expo-notifications';
import { DAYS } from '../data/weather';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestPermissions() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function scheduleDailySummary(activities) {
  await Notifications.cancelAllScheduledNotificationsAsync();

  // Trip dates: Mar 13-18, 2026
  const tripStart = new Date('2026-03-13T08:00:00-05:00'); // 8 AM ET

  for (let dayIndex = 0; dayIndex < 6; dayIndex++) {
    const day = DAYS[dayIndex];
    const da = activities[dayIndex];
    if (!da) continue;

    const all = [...(da.morning || []), ...(da.afternoon || []), ...(da.evening || [])];
    const count = all.filter(a => a.status === 'upcoming').length;
    if (count === 0) continue;

    const triggerDate = new Date(tripStart);
    triggerDate.setDate(triggerDate.getDate() + dayIndex);

    // Only schedule if in the future
    if (triggerDate <= new Date()) continue;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Good morning! ${day.title}`,
        body: `You have ${count} activities planned today. Have a great day in NYC!`,
      },
      trigger: { date: triggerDate },
    });
  }
}

export async function scheduleActivityReminders(activities) {
  // Trip dates: Mar 13-18, 2026
  const tripStart = new Date('2026-03-13');

  for (let dayIndex = 0; dayIndex < 6; dayIndex++) {
    const da = activities[dayIndex];
    if (!da) continue;

    for (const section of ['morning', 'afternoon', 'evening']) {
      for (const activity of (da[section] || [])) {
        if (activity.status !== 'upcoming') continue;

        const timeMatch = activity.time?.match(/(\d{1,2}):(\d{2})/);
        if (!timeMatch) continue;

        const hour = parseInt(timeMatch[1]);
        const minute = parseInt(timeMatch[2]);

        const triggerDate = new Date(tripStart);
        triggerDate.setDate(triggerDate.getDate() + dayIndex);
        triggerDate.setHours(hour, minute - 15, 0, 0); // 15 min before

        // Only schedule if in the future
        if (triggerDate <= new Date()) continue;

        await Notifications.scheduleNotificationAsync({
          content: {
            title: `Coming up: ${activity.name}`,
            body: `Starting at ${activity.time} · ${activity.duration}`,
          },
          trigger: { date: triggerDate },
        });
      }
    }
  }
}
