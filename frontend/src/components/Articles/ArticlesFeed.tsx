import { useState, useEffect } from "react";
import Article from "../../types/Article";
import ArticleCard from "./ArticleCard";

const ArticlesFeed: React.FC = () => {
  const [trends, setTrends] = useState<Article[]>([]);
  // Change this function to get articles from the backend
  async function fetchTrends() {
    setTrends([
      {
        id: "1",
        title: "Lorem ipsum dolor sit amet",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        image: "https://placehold.co/600x400",
        summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        comments: [
          {
            id: "1",
            content: "Lorem ipsum dolor sit amet",
            articleId: "1",
            userId: "1",
          },
          {
            id: "2",
            content: "Lorem ipsum dolor sit amet",
            articleId: "1",
            userId: "1",
          },
        ],
        isLive: true, // set the first article as live. 
      },
      {
        id: "2",
        title: "Lorem ipsum dolor sit amet",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        image: "https://placehold.co/600x400",
        summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        comments: [
          {
            id: "1",
            content: "Lorem ipsum dolor sit amet",
            articleId: "2",
            userId: "1",
          },
          {
            id: "2",
            content: "Lorem ipsum dolor sit amet",
            articleId: "2",
            userId: "1",
          },
        ],
      },
      {
        id: "3",
        title: "Lorem ipsum dolor sit amet",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        image: "https://placehold.co/600x400",
        summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        comments: [
          {
            id: "1",
            content: "Lorem ipsum dolor sit amet",
            articleId: "3",
            userId: "1",
          },
          {
            id: "2",
            content: "Lorem ipsum dolor sit amet",
            articleId: "3",
            userId: "1",
          },
        ],
      },
    ]);
  }
  const liveTrend: Article = trends.filter((article) => article.isLive)[0] || trends[0];
  useEffect(() => {
    fetchTrends();
  }, []);
  if (!trends.length) return <p>Loading articles...</p>;
  return (
    <div>
      <div>
        <ArticleCard key={liveTrend.id} article={liveTrend} isLive />
      </div>
      <div>
        {trends.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
};

export default ArticlesFeed;
