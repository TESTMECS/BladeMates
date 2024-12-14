function handleNotification(notification: string, userId: string) {
  console.log("handling notifications");
  const notificationElements = notification.split(" ");
  const [from, action, to] = notificationElements;
  if (from === userId) {
    if (action === "favorited") {
      const link = `/articles/${to}`;
      return { message: `You favorited an article!`, link };
    }
    if (action === "followed") {
      const link = `/profile/${to}`;
      return { message: `You followed:`, link };
    }
  } else {
    if (action === "favorited") {
      const link = `/articles/${to}`;
      return {
        message: `One of your friends: ${from} favorited an article!`,
        link,
      };
    }
    if (action === "followed") {
      const link = `/profile/${to}`;
      return {
        message: `One of your friends: ${from} followed you!`,
        link,
      };
    }
  }
}
export default handleNotification;
