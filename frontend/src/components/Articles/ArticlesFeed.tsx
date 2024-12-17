import { useState, useEffect } from "react";
import Article from "../../types/Article";
import ArticleCard from "./ArticleCard";
import apiArticleOfTheWeekResponse from "../../types/apiArticleOfTheWeekResponse";
import apiArticlesListResponse from "../../types/apiArticlesListResponse";

const ArticlesFeed: React.FC = () => {
  const [trends, setTrends] = useState<Article[]>([]);
  const [articleOfTheWeek, setArticleOfTheWeek] = useState<Article>();

  async function fetchTrends() {
    // FETCH ARTICLES
    const response = await fetch("http://localhost:3001/api/global/articles", {
      method: "GET",
      credentials: "include",
    });
    if (response.ok) {
      const data: apiArticlesListResponse[] = await response.json();

      setTrends(
        data.map((article) => ({
          id: article._id,
          author: article.author,
          publishedAt: article.publishedAt,
          title: article.title,
        })),
      );
    }
  }
  async function fetchArticleOfTheWeek() {
    // FETCH OF THE WEEK
    try {
      const response = await fetch(
        "http://localhost:3001/api/article-of-the-week",
        {
          method: "GET",
          credentials: "include",
        },
      );
      if (response.ok) {
        const data: apiArticleOfTheWeekResponse = await response.json();
        setArticleOfTheWeek({
          id: data.data._id,
          author: data.data.author,
          publishedAt: data.data.publishedAt,
          title: data.data.title,
          image: data.data.urlToImage,
          description: data.data.description,
          url: data.data.url,
        });
      }
    } catch (error) {
      console.error("Error fetching article of the week:", error);
    }
  }
  useEffect(() => {
    // ON COMPONENT MOUNT, FETCH ARTICLES and ARTICLE OF THE WEEK
    fetchTrends();
    fetchArticleOfTheWeek();
  }, []);
  if (!trends.length) return <p>Loading articles...</p>;
  return (
    <div>
      <div>
        {articleOfTheWeek && (
          <ArticleCard
            key={articleOfTheWeek?.id}
            article={articleOfTheWeek}
            isLive
          />
        )}
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
