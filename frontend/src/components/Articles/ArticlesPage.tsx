import { useEffect, useState } from "react";
import Article from "../../types/Article";
import { useParams } from "react-router-dom";

const ArticlesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  useEffect(() => {
    const fetchArticle = async () => {
      const res = await fetch(`http://localhost:8000/articles/${id}`);
      const data = await res.json();
      setArticle(data);
    };
    fetchArticle();
  }, []);

  if (!article) return <div>Loading article...</div>;
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {article.title}
        </h1>
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-auto mb-4"
        />
        <p className="text-lg text-gray-600">{article.content}</p>
      </div>
    </div>
  );
};

export default ArticlesPage;
