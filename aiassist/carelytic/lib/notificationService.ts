// Notification service for medication reminders
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export interface MedicationReminder {
  id: string;
  medicationName: string;
  time: string; // HH:mm format
  dose: string;
  frequency: string;
  enabled: boolean;
}

// Request permissions
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Notification permissions not granted');
      return false;
    }

    // Configure Android notification channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('medication-reminders', {
        name: 'Medication Reminders',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        sound: true,
      });
    }

    return true;
  } catch (error) {
    console.error('Notification permission error:', error);
    return false;
  }
}

// Schedule medication reminder
export async function scheduleMedicationReminder(
  reminder: MedicationReminder
): Promise<string | null> {
  try {
    if (!reminder.enabled) {
      return null;
    }

    const [hours, minutes] = reminder.time.split(':').map(Number);

    // Create notification content
    const content: Notifications.NotificationContentInput = {
      title: '💊 Medication Reminder',
      body: `Time to take ${reminder.medicationName} (${reminder.dose})`,
      data: {
        medicationId: reminder.id,
        medicationName: reminder.medicationName,
        dose: reminder.dose,
      },
      sound: true,
    };

    // Schedule for daily repeat
    const trigger: Notifications.DailyTriggerInput = {
      hour: hours,
      minute: minutes,
      repeats: true,
    };

    const notificationId = await Notifications.scheduleNotificationAsync({
      content,
      trigger,
    });

    // Save reminder with notification ID
    await saveReminderNotificationId(reminder.id, notificationId);

    return notificationId;
  } catch (error) {
    console.error('Schedule notification error:', error);
    return null;
  }
}

// Cancel medication reminder
export async function cancelMedicationReminder(reminderId: string): Promise<void> {
  try {
    const notificationId = await getReminderNotificationId(reminderId);
    if (notificationId) {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      await removeReminderNotificationId(reminderId);
    }
  } catch (error) {
    console.error('Cancel notification error:', error);
  }
}

// Schedule all medication reminders
export async function scheduleAllReminders(
  reminders: MedicationReminder[]
): Promise<void> {
  // Cancel all existing reminders first
  await cancelAllReminders();

  // Schedule new reminders
  for (const reminder of reminders) {
    if (reminder.enabled) {
      await scheduleMedicationReminder(reminder);
    }
  }
}

// Cancel all reminders
export async function cancelAllReminders(): Promise<void> {
  try {
    const allNotifications = await Notifications.getAllScheduledNotificationsAsync();
    for (const notification of allNotifications) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
    await AsyncStorage.removeItem('medication-reminder-ids');
  } catch (error) {
    console.error('Cancel all notifications error:', error);
  }
}

// Storage helpers
async function saveReminderNotificationId(
  reminderId: string,
  notificationId: string
): Promise<void> {
  try {
    const stored = await AsyncStorage.getItem('medication-reminder-ids');
    const ids = stored ? JSON.parse(stored) : {};
    ids[reminderId] = notificationId;
    await AsyncStorage.setItem('medication-reminder-ids', JSON.stringify(ids));
  } catch (error) {
    console.error('Save reminder notification ID error:', error);
  }
}

async function getReminderNotificationId(reminderId: string): Promise<string | null> {
  try {
    const stored = await AsyncStorage.getItem('medication-reminder-ids');
    if (!stored) return null;
    const ids = JSON.parse(stored);
    return ids[reminderId] || null;
  } catch (error) {
    console.error('Get reminder notification ID error:', error);
    return null;
  }
}

async function removeReminderNotificationId(reminderId: string): Promise<void> {
  try {
    const stored = await AsyncStorage.getItem('medication-reminder-ids');
    if (!stored) return;
    const ids = JSON.parse(stored);
    delete ids[reminderId];
    await AsyncStorage.setItem('medication-reminder-ids', JSON.stringify(ids));
  } catch (error) {
    console.error('Remove reminder notification ID error:', error);
  }
}

// Get all scheduled notifications
export async function getAllScheduledNotifications(): Promise<
  Notifications.NotificationRequest[]
> {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Get all notifications error:', error);
    return [];
  }
}

