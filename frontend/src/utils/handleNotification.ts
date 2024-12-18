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
        timestamp: new Date(notification.timestamp).toLocaleString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        }),
        type: notification.type,
        read: false,
      };
    }
    if (action === "followed") {
      const link = `/profile/${to}`;
      return {
        message: `You followed a user!`,
        link,
        timestamp: new Date(notification.timestamp).toLocaleString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        }),
        type: notification.type,
        read: false,
      };
    }
    if (action === "unfollowed") {
      const link = `/profile/${to}`; // link to the user that unfollowed
      return {
        message: `You unfollowed a user!`,
        link,
        timestamp: new Date(notification.timestamp).toLocaleString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        }),
        type: notification.type,
        read: false,
      };
    }
  } else {
    if (action === "favorited") {
      const link = `/articles/${to}`;
      return {
        message: `One of your friends favorited an article!`,
        link,
        timestamp: new Date(notification.timestamp).toLocaleString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        }),
        type: notification.type,
        read: false,
      };
    }
    if (action === "followed") {
      const link = `/profile/${to}`;
      return {
        message: `You have a new follower!`,
        link,
        timestamp: new Date(notification.timestamp).toLocaleString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        }),
        type: notification.type,
        read: false,
      };
    }
    if (action === "unfollowed") {
      const link = `/profile/${from}`; // link to the user that unfollowed
      return {
        message: `One of your friends unfollowed you!`,
        link,
        timestamp: new Date(notification.timestamp).toLocaleString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        }),
        type: notification.type,
        read: false,
      };
    }
  }
  return notification;
}
export default handleNotification;
