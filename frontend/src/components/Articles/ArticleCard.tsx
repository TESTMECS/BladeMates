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
  const [toggleFavorite, setToggleFavorite] = useState<boolean>(false);
  const { isAuthenticated, user } = useAuth(); // Make sure you have user info
  const [loading, setLoading] = useState<boolean>(false);
  // On component mount, check if the article is already a favorite
  useEffect(() => {
    const checkFavorite = async () => {
      if (isAuthenticated && user) {
        const response = await fetch(
          `http://localhost:3001/api/user/favorites/${user.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const favorites = await response.json();
          // console.log(favorites);
          // Check if the article ID is in the favorites list 
          setToggleFavorite(favorites.articles.includes(article.id));
        }

      }
    };

    checkFavorite();

  }, [isAuthenticated, user, article.id]);

  async function handleFavorite() {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      if (toggleFavorite) {
        const response = await fetch(
          `http://localhost:3001/api/article/favorite`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ articleId: article.id }),
          }
        );
        if (response.ok) {
          // console.log("Favorite removed successfully");
          setToggleFavorite(false);
        }
        // console.log(response);
      } else {
        // console.log("Article ID:", article.id);
        const response = await fetch(
          `http://localhost:3001/api/article/favorite`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ articleId: article.id }),
          }
        );
        if (response.ok) {
          // console.log("Favorite added successfully");
          setToggleFavorite(true);
        }
        // console.log(response);
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
        className={`ml-4 pr-6 ${loading ? "text-yellow" : toggleFavorite ? "text-yellow" : "text-gray"
          }`}
        disabled={loading}
      >
        <StarIcon className="h-6 w-6" aria-hidden="true" />
      </button>
      {isLive && <Link to={`/live/${article.id}`} className="w-9/12 rounded-lg overflow-hidden shadow-lg m-4 transform transition-transform duration-200 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 border-2 border-yellow">
        <div className="w-full h-48 bg-cover bg-center mb-4" style={{ backgroundImage: `url(${article.image})` }} aria-label={article.title}></div>
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">{article.title}</div>
          <p className="text-gray text-base">{article.summary}</p>
        </div>
      </Link>
      }
      {!isLive &&
        <Link
          to={`/articles/${article.id}`}
          className="w-9/12 rounded-lg overflow-hidden shadow-lg m-4 transform transition-transform duration-200 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2  border border-lightblue">
          <div
            className="w-full h-48 bg-cover bg-center mb-4"
            style={{ backgroundImage: `url(${article.image})` }}
            aria-label={article.title}
          ></div>
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2 ">
              {article.title}
              {isLive && <span className="ml-2 text-red-500">LIVE</span>}
            </div>
            <p className="text-gray text-base">{article.summary}</p>
          </div>
        </Link>
      }
    </div>
  );
};

export default ArticlesPage;
