import { useEffect, useState } from "react";
import Article from "../../types/Article";
import { useParams } from "react-router-dom";
type apiArticlePageResponse = {
  title: string
  author: string
  publishedAt: string
  description: string
  url: string
  imageUrl: string
  sourceName: string
}
const ArticlesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article>();
  useEffect(() => {
    console.log("This is the id from params", id);
    if (!id) return;
    const fetchArticle = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/global/article/${id}`, {
          method: "GET",
          credentials: 'include',
        });
        if (!res.ok) alert("Article not found.");
        const data: apiArticlePageResponse = await res.json();
        console.log("This is the article data in page component.", data);
        const article: Article = {
          id,
          author: data.author,
          publishedAt: data.publishedAt,
          title: data.title,
          description: data.description,
          url: data.url,
          image: data.imageUrl
        }
        setArticle(article);
      } catch (error) {
        console.error("Error fetching article:", error);
      }
    };
    fetchArticle();
  }, []);

  if (!article) return <div>Loading article...</div>;
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 h-full">
      <div className="rounded-lg shadow-lg p-8 border border-lightblue">
        {article && (
          <div>
            <h1
              className="text-3xl font-bold mb-4">
              {article.title}
            </h1>
            <p>
              By {article.author}
              Published: {article.publishedAt}
            </p>
            <p className="mb-4">{article.description}</p>
            <img
              src={article.image}
              alt={article.title}
              className="border border-lightblue rounded mb-4 w-full h-auto"
            />
            <a
              className="mb-4 text-3xl font-bold underline pointer text-lightblue"
              href={article.url}
              target="_blank">
              {article.url}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticlesPage;
