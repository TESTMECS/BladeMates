export function displayNotification(notification: any) {
  const notificationElement = document.createElement("div");
  notificationElement.textContent = `New notification: ${notification.message}`;
  document.body.appendChild(notificationElement);
}
