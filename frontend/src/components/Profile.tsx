import React, { useState, useEffect } from "react";
import { useAuth } from "../context/userContext";

type apiResponse = {
  username: string,
  recentComments: string[], // List of comment IDs
  recentArticles: string[], // list of article IDs
  friends: string[], // List of friend usernames 
  trends: string[] // List of trend names
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [username, setUsername] = useState<string>("");
  const [recentComments, setRecentComments] = useState<string[]>([]);
  const [recentArticles, setRecentArticles] = useState<string[]>([]);
  const [friends, setFriends] = useState<string[]>([]);
  const [trends, setTrends] = useState<string[]>([]);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/user/profileData/" + user.id, {
        method: "GET",
        credentials: "include",
      });
      const data: apiResponse = await response.json();
      setRecentComments(data.recentComments);
      setRecentArticles(data.recentArticles);
      setFriends(data.friends);
      setTrends(data.trends);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  useEffect(() => {
    if (user) {
      setUsername(user.username);
    }
    fetchData();
  }, [user]);

  return (
    <div className="max-w-2xl mx-auto p-6 rounded-lg shadow-md h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Profile</h1>
      </div>
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div>
            <p className="text-gray dark:text-white">@{username}</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Recent Comments</h2>
            <ul>
              {recentComments && recentComments.map((comment, index) => (
                <li key={index}>{comment}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Recent Articles</h2>
            <ul>
              {recentArticles && recentArticles.map((article, index) => (
                <li key={index}>{article}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Friends</h2>
            <ul>
              {friends && friends.map((friend, index) => (
                <li key={index}>{friend}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Trends</h2>
            <ul>
              {trends && trends.map((trend, index) => (
                <li key={index}>{trend}</li>
              ))}
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Profile;
