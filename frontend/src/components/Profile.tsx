import React, { useState, useEffect } from "react";
import { useAuth } from "../context/userContext";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { HomeIcon } from "@heroicons/react/outline";
type apiResponse = {
  user: {
    username: string;
    recentComments: string[]; // List of article ID with the comments.
    recentArticles: string[]; // list of article IDs
    friends: { id: string; username: string }[];
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
  const [friends, setFriends] = useState<{ id: string; username: string }[]>(
    [],
  );
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
    if (!id) return;
    fetchData();
  }, [id]);
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
    <div className="flex">
      {/* Home Icon */}
      <div className="fixed top-1/2 left-4 transform -translate-y-1/2">
        <Link
          to="/home"
          className="flex flex-col items-center hover:text-lightblue dark:hover:text-purple px-3 py-2 rounded-md text-lg font-semibold transition-colors duration-200"
        >
          <HomeIcon className="h-8 w-8" aria-hidden="true" />
          <span className="text-sm">Home</span>
        </Link>
      </div>
      {/* Profile Section */}
      <div className="flex-grow max-w-4xl mx-auto p-6 rounded-lg shadow-md h-screen border border-lightblue">
        <div className="flex flex-col space-y-6">
          {/* Profile Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">My Profile</h1>
            <p className="text-gray dark:text-white">@{username}</p>
            {otherUser && !areFriends && (
              <button
                onClick={() => followUser()}
                className="mt-4 px-4 py-2 bg-lightpink text-black rounded hover:bg-lightblue dark:bg-purple dark:text-whitedark:hover:bg-green"
              >
                Follow
              </button>
            )}
            {otherUser && areFriends && (
              <button
                onClick={() => unFollowUser()}
                className="mt-4 px-4 py-2 bg-lightpink text-black rounded hover:bg-lightblue dark:bg-purple dark:text-white dark:hover:bg-green"
              >
                Unfollow
              </button>
            )}
            {customError && <p className="text-red mt-2">{customError}</p>}
            {success && <p className="text-green mt-2">{success}</p>}
          </div>
          {/* Lists Section */}
          <div className="grid grid-cols-1 gap-6">
            {/* Recent Comments */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Recent Comments</h2>
              <ul className="space-y-2">
                {recentComments &&
                  recentComments.map((comment, index) => (
                    <Link to={`/articles/${comment}`}>
                      <li
                        key={index}
                        className="p-2 border-b border-lightblue text-lightblue dark:text-green hover:text-lightpink dark:hover:text-purple underline cursor-pointer"
                      >
                        On Article: {comment}
                      </li>
                    </Link>
                  ))}
              </ul>
            </div>
            {/* Recent Articles */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Recent Articles</h2>
              <ul className="space-y-2">
                {recentArticles &&
                  recentArticles.map((article, index) => (
                    <Link to={`/articles/${article}`}>
                      <li
                        key={index}
                        className="p-2 border-b border-lightblue text-lightblue dark:text-green hover:text-lightpink dark:hover:text-purple underline cursor-pointer"
                      >
                        {article}
                      </li>
                    </Link>
                  ))}
              </ul>
            </div>
            {/* Friends */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Friends</h2>
              <ul className="space-y-2">
                {friends &&
                  friends.map((friend, index) => (
                    <Link to={`/profile/${friend.id}`}>
                      <li
                        key={index}
                        className="p-2 border-b border-lightblue underline cursor-pointer text-lightblue dark:text-green hover:text-lightpink dark:hover:text-purple"
                      >
                        {friend.username}
                      </li>
                    </Link>
                  ))}
              </ul>
            </div>
            {/* Trends */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Trends</h2>
              <ul className="space-y-2">
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
