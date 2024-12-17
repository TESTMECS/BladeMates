import React, { useState, useEffect } from "react";
import { useAuth } from "../context/userContext";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
type apiResponse = {
  user: {
    username: string;
    recentComments: string[]; // List of comment IDs
    recentArticles: string[]; // list of article IDs
    friends: string[]; // List of friend usernames
    trends: string[]; // List of trend names
  };
};
const Profile: React.FC = () => {
  // Context
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  // display
  const [username, setUsername] = useState<string>("");
  const [recentComments, setRecentComments] = useState<string[]>([]);
  const [recentArticles, setRecentArticles] = useState<string[]>([]);
  const [friends, setFriends] = useState<string[]>([]);
  const [trends, setTrends] = useState<string[]>([]);
  const [customError, setCustomError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  // state
  const [otherUser, setOtherUser] = useState<boolean>(false);
  const [areFriends, setAreFriends] = useState<boolean>(false);
  const fetchData = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/user/profileData/" + id,
        {
          method: "GET",
          credentials: "include",
        },
      );
      const data: apiResponse = await response.json();
      console.log("this is the profile data", data);
      setRecentComments(data.user.recentComments);
      setRecentArticles(data.user.recentArticles);
      setFriends(data.user.friends);
      setTrends(data.user.trends);
      if (user.id !== id) {
        setUsername(data.user.username);
        setOtherUser(true);
      } else {
        setUsername(user.username);
        setOtherUser(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // Fetch the profile data when the component mounts
  useEffect(() => {
    fetchData();
  }, []);
  // Clear the error message and success message after 3 seconds
  useEffect(() => {
    if (customError || success) {
      const timer = setTimeout(() => {
        setCustomError("");
        setSuccess("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [customError, success]);
  // Handle following a user.
  const followUser = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/friend/follow", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ followeeId: id, followerId: user.id }), //pass the param id.
      });
      if (response.ok) {
        setSuccess("Successfully followed user");
        setAreFriends(true);
        //send the notification
        // Fetch updated data
        fetchData();
      } else {
        const errorData = await response.json();
        setCustomError(errorData.error);
        // find a way to do this based on the error.
        setAreFriends(true);
      }
    } catch (error) {
      console.error("Error following user:", error);
    }
  };
  const unFollowUser = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/friend/unfollow",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ unfolloweeId: id, unfollowerId: user.id }),
        },
      );
      if (response.ok) {
        setSuccess("Successfully unfollowed user");
        setAreFriends(false);
        // Send the notification
        // Fetch the updated data
        fetchData();
      } else {
        const errorData = await response.json();
        setCustomError(errorData.error);
      }
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  return (
    <div>
      <Link
        to="/home"
        className="flex items-center hover:text-lightblue dark:hover:text-purple px-3 py-2 rounded-md text-lg font-semibold transition-colors duration-200"
      >
        HOME
      </Link>
      <div className="max-w-2xl mx-auto p-6 rounded-lg shadow-md h-screen border border-lightblue">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Profile</h1>
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div>
              <p className="text-gray dark:text-white">@{username}</p>
            </div>
            {otherUser && !areFriends && (
              <button
                onClick={() => followUser()}
                className="px-4 py-2 bg-lightblue text-white rounded hover:bg-blue-700"
              >
                Follow
              </button>
            )}
            {otherUser && areFriends && (
              <button
                onClick={() => unFollowUser()}
                className="px-4 py-2 bg-lightblue text-white rounded hover:bg-blue-700"
              >
                Unfollow
              </button>
            )}
            {customError && <p className="text-red">{customError}</p>}
            {success && <p className="text-green">{success}</p>}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Recent Comments</h2>
              <ul>
                {recentComments &&
                  recentComments.map((comment, index) => (
                    <li key={index} className="p-2 border-b border-lightblue">
                      {comment}
                    </li>
                  ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Recent Articles</h2>
              <ul>
                {recentArticles &&
                  recentArticles.map((article, index) => (
                    <li key={index} className="p-2 border-b border-lightblue">
                      {article}
                    </li>
                  ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Friends</h2>
              <ul>
                {friends &&
                  friends.map((friend, index) => (
                    <li key={index} className="p-2 border-b border-lightblue">
                      {friend}
                    </li>
                  ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Trends</h2>
              <ul>
                {trends &&
                  trends.map((trend, index) => (
                    <li key={index} className="p-2 border-b border-lightblue">
                      {trend}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
