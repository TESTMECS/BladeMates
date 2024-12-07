import Comment from "./Comment";

type Article = {
  id: string;
  title: string;
  content: string;
  image: string;
  summary?: string;
  comments: Comment[];
  isLive?: boolean;
};
export default Article;
