import Comment from "./Comment";

type Article = {
  id: string;
  author: string;
  publishedAt: string;
  title: string;
  content?: string;
  image?: string;
  summary?: string;
  comments?: Comment[];
  description?: string;
  url?: string;
};
export default Article;
