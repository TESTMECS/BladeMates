import { useEffect, useState } from "react";
import trends from "../utils/trends.ts";
import Article from "../types/Article";
import ArticleCard from "./Articles/ArticleCard";
import apiArticlesListResponse from "../types/apiArticlesListResponse";
const FollowingFeed: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [userTrends, setUserTrends] = useState<string[]>([]);
  const fetchPersonalArticles = async () => {
    const response = await fetch(
      "http://localhost:3001/api/user/followingFeed",
      {
        method: "GET",
        credentials: "include",
      },
    );
    if (response.ok) {
      const data: apiArticlesListResponse[] = await response.json();
      setArticles(
        data.map((article) => {
          return {
            id: article._id,
            title: article.title,
            author: article.author,
            publishedAt: new Date(article.publishedAt).toLocaleString(),
          };
        }),
      );
    }
  };
  useEffect(() => {
    const fetchTrends = async () => {
      const response = await fetch("http://localhost:3001/api/user/trends", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setUserTrends(data);
      }
    };
    fetchTrends();
    fetchPersonalArticles();
  }, []);
  const handleTrendDelete = async (trend: string) => {
    const response = await fetch("http://localhost:3001/api/user/trends", {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ trend }),
    });
    if (response.ok) {
      setUserTrends(userTrends.filter((t) => t !== trend));
      fetchPersonalArticles();
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const trend = formData.get("trend") as string;
    console.log(formData);
    const response = await fetch("http://localhost:3001/api/user/trends", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ trend }),
    });
    if (response.ok) {
      setUserTrends([...userTrends, trend]);
      fetchPersonalArticles();
    }
  };
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 min-h-screen">
      {/* Header and Form */}
      <div className="text-center">
        <h1 className="text-2xl font-bold">Select Trend to Follow!</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center space-y-4 mt-4"
        >
          <select
            name="trend"
            className="px-4 py-2 border rounded bg-lightpink text-white dark:bg-purple dark:text-black hover:bg-lightblue hover:dark:bg-green"
          >
            {trends.map((trend: any) => (
              <option
                key={trend}
                value={trend}
                className="hover:bg-lightblue dark:hover:bg-green"
              >
                {trend}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="px-4 py-2 border rounded bg-lightpink text-white hover:bg-lightblue dark:bg-purple dark:text-black dark:hover:bg-green"
          >
            Follow
          </button>
        </form>
      </div>
      {/* List of Followed Trends */}
      <div>
        <h1 className="text-2xl font-bold mb-4">
          List of Trends You Follow...
        </h1>
        {userTrends.length === 0 ? (
          <p>You haven't followed any trends...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {userTrends.map((trend) => (
              <div
                key={trend}
                className="flex items-center justify-between border border-lightblue p-4 rounded"
              >
                <p>{trend}</p>
                <button
                  onClick={() => handleTrendDelete(trend)}
                  className="px-2 py-1 rounded bg-lightpink text-white dark:text-black hover:bg-blue dark:bg-purple dark:hover:bg-green"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <h1 className="text-2xl font-bold">Following Feed</h1>
      {/* Articles */}
      {articles.length > 0 && (
        <div>
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
};
export default FollowingFeed;
