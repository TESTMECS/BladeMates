import useSocket from "../hooks/useSocket";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import notification from "../types/notification";

const Notifications = () => {
  const [notificationList, setNotificationList] = useState<notification[]>([]);
  const { notification } = useSocket();

  useEffect(() => {
    if (!notification) return;
    setNotificationList((prevList) => [...prevList, notification]);
  }, [notification]);
  return (
    <div>
      <h1>Notifications</h1>
      {notificationList &&
        notificationList.map((notification, index) => (
          <Link to={notification.link} key={index}>
            {notification.message}
          </Link>
        ))}
    </div>
  );
};

export default Notifications;
