import React from 'react';

// export default function NotificationService() {

class NotificationService {
  constructor() {
    this.init();
  }

  init() {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Notification permission granted');
        }
      });
    }
  }

  playNotificationSound() {
    const audio = new Audio('../icons/livechat-129007.mp3');
    audio.play().catch(error => console.log('Error playing sound:', error));
  }

  showNotification(message, senderName) {
    if (!this.areNotificationsEnabled()) return;
    console.log('Notofications allowed');

    if ('Notification' in window && Notification.permission === 'granted') {
      this.playNotificationSound();

      const notification = new Notification('New Message', {
        body: `${senderName}: ${message}`,
        icon: '/path-to-your-icon.png',
        badge: '/path-to-your-badge.png',
        vibrate: [200, 100, 200],
        tag: 'new-message',
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      setTimeout(() => notification.close(), 5000);
    }
  }

  setNotificationPreferences(enabled) {
    localStorage.setItem('notificationsEnabled', enabled);
  }

  areNotificationsEnabled() {
    return localStorage.getItem('notificationsEnabled') !== 'false';
  }
}
// }

const notificationService = new NotificationService();
export default notificationService;