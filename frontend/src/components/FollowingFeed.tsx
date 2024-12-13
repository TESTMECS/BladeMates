import { useEffect, useState } from "react";
import trends from "../utils/trends";
import Article from "../types/Article";
import ArticleCard from "./Articles/ArticleCard";
import apiArticlesListResponse from "../types/apiArticlesListResponse";

const FollowingFeed: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [userTrends, setUserTrends] = useState<string[]>([]);

  const fetchPersonalArticles = async () => {
    const response = await fetch("http://localhost:3001/api/user/followingFeed", {
      method: "GET",
      credentials: 'include',
    });
    if (response.ok) {
      const data: apiArticlesListResponse[] = await response.json();
      console.log(data);

      setArticles(data.map(article => {
        return {
          id: article._id,
          ...article,
        }
      }));
    }
  }

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
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const trend = formData.get("trend") as string;

    console.log(formData)

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
  }

  return (
    <div>
      <h1>Select Trend to Follow!</h1>
      <form onSubmit={handleSubmit}>
        <select name="trend">
          {trends.map((trend) => (
            <option key={trend} value={trend}>
              {trend}
            </option>
          ))}
        </select>
        <button type="submit">Follow</button>
      </form>
      <h1>List of Trends You Follow...</h1>
      <div style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
      }}>
        {userTrends.map((trend) => (
          <div key={trend} style={{
            display: "flex",
            flexDirection: "row",
            margin: "5px",
          }}>
            <p>{trend}</p>
            <button onClick={() => handleTrendDelete(trend)}>Delete</button>
          </div>
        ))}
      </div>
      {articles.length === 0 && <p>You haven't followed any trends...</p>}
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={article} />
      ))}
    </div>
  );
};

export default FollowingFeed;
