function handleNotification(notification: string, userId: string) {
  console.log("handling notifications");
  const notificationElements = notification.split(" ");
  let [from, action, to] = notificationElements;
  if (from === userId) {
    if (action === "favorited") {
      const link = `/articles/${to}`;
      return { message: `You favorited an article!`, link, read: false };
    }
    if (action === "followed") {
      const link = `/profile/${to}`;
      return { message: `You followed:`, link, read: false };
    }
  } else {
    if (action === "favorited") {
      const link = `/articles/${to}`;
      return {
        message: `One of your friends: ${from} favorited an article!`,
        link,
        read: false,
      };
    }
    if (action === "followed") {
      const link = `/profile/${to}`;
      return {
        message: `One of your friends: ${from} followed you!`,
        link,
        read: false,
      };
    }
    if (action === "unfollowed") {
      const link = `/profile/${from}`; // link to the user that unfollowed
      return {
        message: `One of your friends: ${from} unfollowed you!`,
        link,
        read: false,
      };
    }
  }
}
export default handleNotification;
