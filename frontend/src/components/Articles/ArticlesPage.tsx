import { useEffect, useState } from 'react';
import Article from '../../types/Article';
import { useParams } from 'react-router-dom';
import apiArticlePageResponse from '../../types/apiArticlePageResponse';
import Comments from './comments/Comments';

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
            method: 'GET',
            credentials: 'include',
          }
        );
        if (!res.ok) alert('Article not found.');
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
        console.error('Error fetching article:', error);
      }
    };
    fetchArticle();
  }, []);
  if (!article) return <div>Loading article...</div>;
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 h-fit">
      <div className="rounded-lg shadow-lg p-8 pt-6 border border-lightblue">
        {article && (
          <div>
            <div>
              <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
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
                target="_blank"
              >
                {article.url}
              </a>
            </div>
            <div className="p-[1px] border border-black/0 rounded-lg bg-black/10 dark:bg-white/10 my-8"></div>
            <Comments articleId={article.id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticlesPage;
