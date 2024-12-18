import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Article from "../../types/Article";
import { useAuth } from "../../context/userContext";
import { StarIcon } from "@heroicons/react/outline";
interface ArticlesPageProps {
  article: Article;
  isLive?: boolean;
}
const ArticlesPage: React.FC<ArticlesPageProps> = ({ article, isLive }) => {
  // CONTEXT
  const { isAuthenticated, user } = useAuth();
  // State
  const [toggleFavorite, setToggleFavorite] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  // Display
  const [articleId, setArticleId] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [publishedAt, setPublishedAt] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  useEffect(() => {
    const checkFavorite = async () => {
      if (!isAuthenticated || !user) return;
      if (isAuthenticated && user) {
        const response = await fetch(
          `http://localhost:3001/api/user/favorites/${user.id}`,
          {
            method: "GET",
            credentials: "include",
          },
        );
        if (response.ok) {
          const favorites = await response.json();
          // Check if the article ID is in the favorites list
          setToggleFavorite(favorites.articles.includes(article?.id));
        }
      }
    };
    const setFields = () => {
      // SET DISPLAY
      if (article) {
        setArticleId(article.id);
        setAuthor(article.author);
        setPublishedAt(new Date(article.publishedAt).toLocaleString());
        setTitle(article.title);
      }
    };
    // Set the article fields
    setFields();
    // Check if the article is a favorite already
    checkFavorite();
  }, [isAuthenticated, user, article?.id]);
  // HANDLE FAVORITE
  async function handleFavorite() {
    if (!isAuthenticated) return;
    setLoading(true);
    const articleId: string = article?.id;
    try {
      if (toggleFavorite) {
        const response = await fetch(
          `http://localhost:3001/api/article/favorite`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ articleId }),
          },
        );
        if (response.ok) {
          setToggleFavorite(false);
        }
      } else {
        const response = await fetch(
          `http://localhost:3001/api/article/favorite`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ articleId }),
          },
        );
        if (response.ok) {
          setToggleFavorite(true);
        }
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="flex justify-center items-center p-4 shadow-sm">
      <button
        onClick={handleFavorite}
        className={`ml-4 pr-6 ${
          loading ? "text-yellow" : toggleFavorite ? "text-yellow" : "text-gray"
        }`}
        disabled={loading}
      >
        <StarIcon className="h-6 w-6" aria-hidden="true" />
      </button>
      {/* LIVE ARTICLE CARD */}
      {isLive && (
        <Link
          to={`/live/${articleId}`}
          className="w-9/12 rounded-lg overflow-hidden shadow-lg m-4 transform transition-transform duration-200 
          hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 border-2 border-yellow"
        >
          <img
            className="w-full h-48 bg-cover bg-center mb-4"
            src={article?.image}
          />
          <div className="px-6 py-4">
            {publishedAt && (
              <span className="ml-2 text-gray text-base">{publishedAt}</span>
            )}
            <div className="font-bold text-xl mb-2">
              {title && <span>{title}</span>}
              {author && <span className="ml-2"> By: {author}</span>}
            </div>
            <p className="text-gray text-base">{article?.description}</p>
          </div>
        </Link>
      )}
      {!isLive && (
        <Link
          to={`/articles/${articleId}`}
          className="w-9/12 rounded-lg overflow-hidden shadow-lg m-4 transform transition-transform duration-200 
          hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2  border border-lightblue"
        >
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2 ">
              {title && <span>{title}</span>}
              {author && <span className="ml-2"> By: {author}</span>}
              {isLive && <span className="ml-2 text-red">LIVE</span>}
            </div>
            <p>
              {publishedAt && <span className="text-gray">{publishedAt}</span>}
            </p>
          </div>
        </Link>
      )}
    </div>
  );
};

export default ArticlesPage;
