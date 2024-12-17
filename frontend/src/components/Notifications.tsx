import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import notification from "../types/notification";
import { useAuth } from "../context/userContext";
import handleNotification from "../utils/handleNotification";
type apiResponse = {
  notifications: [
    {
      type: string;
      message: string;
      timestamp: string;
    },
  ];
};
const Notifications = () => {
  const [notificationList, setNotificationList] = useState<notification[]>([]);
  const { user } = useAuth();
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/user/notifications/" + user.id,
        );
        const data: apiResponse = await response.json();
        const transformedNotifications: notification[] = data.notifications.map(
          (noti: any) => {
            return handleNotification(noti, user.id);
          },
        );
        setNotificationList(transformedNotifications);
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
    <div className="p-4 h-screen">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      {notificationList &&
        notificationList.map((notification, index) => (
          <div key={index} className="mb-4 p-4 border rounded shadow">
            <Link to={notification.link} className="text-blue hover:underline">
              {notification.message}
            </Link>
            <p className="text-gray">{notification.timestamp}</p>
            <button
              onClick={() => handleRead(index)}
              className="p-2 text-2xl rounded-r-lg bg-lightpink hover:bg-lightblue dark:bg-purple dark:hover:bg-green"
            >
              Mark as read
            </button>
          </div>
        ))}
    </div>
  );
};
export default Notifications;
