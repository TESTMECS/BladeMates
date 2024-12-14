type apiArticleOfTheWeekResponse = {
  data: {
    _id: string;
    author: string;
    publishedAt: string; // ISO 8601 format
    content: string;
    description: string;
    source?: { id?: string, name?: string };
    tags: string[];
    title: string;
    url: string;
    urlToImage: string;
  }
}
export default apiArticleOfTheWeekResponse;
