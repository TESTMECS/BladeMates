import notification from "../types/notification";
function handleNotification(notification: notification, userId: string) {
  const notificationElements = notification.message.split(" ");
  let [from, action, to] = notificationElements;
  if (from === userId) {
    if (action === "favorited") {
      const link = `/articles/${to}`;
      return {
        message: `You favorited an article!`,
        link,
        timestamp: notification.timestamp,
        type: notification.type,
        read: false,
      };
    }
    if (action === "followed") {
      const link = `/profile/${to}`;
      return {
        message: `You followed:`,
        link,
        timestamp: notification.timestamp,
        type: notification.type,
        read: false,
      };
    }
  } else {
    if (action === "favorited") {
      const link = `/articles/${to}`;
      return {
        message: `One of your friends: ${from} favorited an article!`,
        link,
        timestamp: notification.timestamp,
        type: notification.type,
        read: false,
      };
    }
    if (action === "followed") {
      const link = `/profile/${to}`;
      return {
        message: `One of your friends: ${from} followed you!`,
        link,
        timestamp: notification.timestamp,
        type: notification.type,
        read: false,
      };
    }
    if (action === "unfollowed") {
      const link = `/profile/${from}`; // link to the user that unfollowed
      return {
        message: `One of your friends: ${from} unfollowed you!`,
        link,
        timestamp: notification.timestamp,
        type: notification.type,
        read: false,
      };
    }
  }
  return notification;
}
export default handleNotification;
