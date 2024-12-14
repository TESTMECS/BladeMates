export type Source = {
  id: string | null;
  name: string;
}

export type Article = {
  _id?: string;
  source: Source;
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content?: string;
}

export type NewsApiResponse = {
  status: 'ok' | 'error';
  totalResults: number;
  articles: Article[];
}
