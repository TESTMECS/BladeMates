import { useEffect, useState } from "react";
import Article from "../../types/Article";
import { useParams } from "react-router-dom";
import apiArticlePageResponse from "../../types/apiArticlePageResponse";
import Comments from "./comments/Comments";
const ArticlesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article>();
  useEffect(() => {
    if (!id) return;
    const fetchArticle = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/api/global/article/${id}`,
          {
            method: "GET",
            credentials: "include",
          },
        );
        if (!res.ok) alert("Article not found.");
        const data: apiArticlePageResponse = await res.json();
        const article: Article = {
          id,
          author: data.author,
          publishedAt: data.publishedAt,
          title: data.title,
          description: data.description,
          url: data.url,
          image: data.imageUrl,
        };
        setArticle(article);
      } catch (error) {
        console.error("Error fetching article:", error);
      }
    };
    fetchArticle();
  }, []);
  if (!article) return <div>Loading article...</div>;
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="rounded-lg shadow-lg p-8 pt-10 border border-lightblue">
        {article && (
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-2/3">
              <h1 className="text-4xl font-extrabold mb-6 text-black dark:text-white">
                {article.title}
              </h1>
              <p className="text-lg text-gray dark:text-white mb-2">
                By <span className="font-semibold">{article.author}</span>
              </p>
              <p className="text-md text-gray dark:text-white mb-4">
                {new Date(article.publishedAt).toLocaleDateString()}
              </p>
              <p className="text-lg text-gray dark:text-white mb-6">
                {article.description}
              </p>
              <a
                className="mb-4 text-2xl font-bold underline text-lightblue hover:text-lightpink dark:text-green dark:hover:text-purple"
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {article.url}
              </a>
            </div>
            <div className="lg:w-1/3 lg:pl-8">
              <img
                src={article.image}
                alt={article.title}
                className="border border-lightblue rounded mb-4 w-full h-64 object-cover"
              />
            </div>
          </div>
        )}
        <Comments articleId={article.id} />
      </div>
    </div>
  );
};
export default ArticlesPage;
