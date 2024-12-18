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
      if (data.length === 0) {
        alert("No articles found");
      } else {
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
  };

  useEffect(() => {
    // ON COMPONENT MOUNT, FETCH ARTICLES and ARTICLE OF THE WEEK
    fetchTrends();
    fetchArticleOfTheWeek();
  }, []);
  if (!trends.length) return <p>Loading articles...</p>;
  return (
    <div>
      <div className="flex items-center justify-center p-4 rounded-md shadow-md space-x-4">
        <span className="text-lg font-medium text-black dark:text-white">
          Search for articles:
        </span>
        <input
          type="text"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-64 p-2 border bg-lightpink dark:bg-purple dark:text-black hover:bg-lightblue text-white border-lightblue rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-darkblue"
        />
        <button
          onClick={searchArticles}
          className="px-4 py-2 font-bold text-white bg-lightpink hover:bg-lightblue dark:bg-purple dark:hover:bg-green dark:text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-darkblue"
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
