import { useState, useEffect } from "react";
import Article from "../../types/Article";
import ArticleCard from "./ArticleCard";
import apiArticleOfTheWeekResponse from "../../types/apiArticleOfTheWeekResponse";
import apiArticlesListResponse from "../../types/apiArticlesListResponse";
const ArticlesFeed: React.FC = () => {
  const [trends, setTrends] = useState<Article[]>([]);
  const [articleOfTheWeek, setArticleOfTheWeek] = useState<Article>();
  const [searchQuery, setSearchQuery] = useState("");

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
  const searchArticles = async () => {
    // SEARCH ARTICLES
    const response = await fetch(
      `http://localhost:3001/api/global/search/${searchQuery}`,
      {
        method: "GET",
        credentials: "include",
      },
    );
    if (response.ok) {
      const data: apiArticlesListResponse[] = await response.json();
      console.log("Search results in React:", data);
      
      setTrends(
        data.map((article) => ({
          id: article._id,
          author: article.author,
          publishedAt: article.publishedAt,
          title: article.title,
        })),
      );
    }
    };


  useEffect(() => {
    // ON COMPONENT MOUNT, FETCH ARTICLES and ARTICLE OF THE WEEK
    fetchTrends();
    fetchArticleOfTheWeek();
  }, []);
  if (!trends.length) return <p>Loading articles...</p>;
  return (
    <div>

      <div className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-md shadow-md">
        <span className="mb-2 text-lg font-medium text-gray-700">Search for articles:</span>
        <input
          type="text"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-64 p-2 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={searchArticles}
          className="px-4 py-2 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Search
        </button>
      </div>


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
