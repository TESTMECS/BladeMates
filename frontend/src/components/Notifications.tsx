import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import notification from "../types/notification";
import { useAuth } from "../context/userContext";
// import handleNotification from "../utils/handleNotification";
const Notifications = () => {
  const [notificationList, setNotificationList] = useState<notification[]>([]);
  const { user } = useAuth();
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/user/notifications/" + user.id,
        );
        const data = await response.json();
        console.log(data);
        // const transformedNotifications = data.notifications.map(
        //   (notification: { message: { data: string }; read: string }) => {
        //     return handleNotification(notification.message.data, user.id);
        //   },
        // );
        setNotificationList([]);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, []);
  const handleRead = (index: number) => {
    setNotificationList((prevList) => prevList.filter((_, i) => i !== index));
  };
  return (
    <div>
      <h1>Notifications</h1>
      {notificationList &&
        notificationList.map((notification, index) => (
          <div key={index}>
            <Link to={notification.link}>{notification.message}</Link>
            <button onClick={() => handleRead(index)}>Mark as read</button>
          </div>
        ))}
    </div>
  );
};

export default Notifications;
