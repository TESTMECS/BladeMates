import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Article from "../../types/Article";
import { useAuth } from "../../context/userContext";
import { StarIcon } from "@heroicons/react/outline";
interface ArticlesPageProps {
  article?: Article;
  isLive?: boolean;
}
const ArticlesPage: React.FC<ArticlesPageProps> = ({ article, isLive }) => {
  const [toggleFavorite, setToggleFavorite] = useState<boolean>(false);
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  // Fields to display
  const [articleId, setArticleId] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [publishedAt, setPublishedAt] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  // On component mount, check if the article is already a favorite
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
    setFields();
    checkFavorite();
  }, [isAuthenticated, user, article?.id]);
  // HANDLE FAVORITE
  async function handleFavorite() {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      if (toggleFavorite) {
        // console.log("deleting favorite", article?.id);
        const response = await fetch(
          `http://localhost:3001/api/article/favorite`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ articleId: article?.id }),
          },
        );
        if (response.ok) {
          // console.log("Favorite removed successfully");
          setToggleFavorite(false);
        }
        // console.log("this is the response from DELETE /api/article/favorite", response);
      } else {
        // console.log("posting favorite", article?.id);
        const response = await fetch(
          `http://localhost:3001/api/article/favorite`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ articleId: article?.id }),
          },
        );
        if (response.ok) {
          // console.log("Favorite added successfully");
          setToggleFavorite(true);
        }
        // console.log("this is the response from POST /api/article/favorite", response);
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
            <div className="font-bold text-xl mb-2">
              {title && <span>{title}</span>}
              {author && <span className="ml-2">{author}</span>}
              {publishedAt && <span className="ml-2">{publishedAt}</span>}
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
              {author && <span className="ml-2">{author}</span>}
              {isLive && <span className="ml-2 text-red-500">LIVE</span>}
            </div>
            <p>{publishedAt && <span>{publishedAt}</span>}</p>
          </div>
        </Link>
      )}
    </div>
  );
};

export default ArticlesPage;
