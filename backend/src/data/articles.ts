import { elasticConnection } from "../config/elasticConnection";
import { Article } from "../types/newsApiTypes";
import seedrandom from "seedrandom";
// query articles published within last 5 daysday
export async function getArticlesPast5Days() {
  const client = elasticConnection();
  try {
    const result = await client.search<Article>({
      index: "articles",
      body: {
        query: {
          range: {
            publishedAt: {
              //elasticsearch's intuitive support for date ranges is MAGIC i tell you
              gte: "now-5d/d",
              lte: "now/d",
            },
          },
        },
      },
    });
    return result.hits.hits.map((hit) => hit._source);
  } catch (error) {
    console.error("Error during Elasticsearch operation:", error);
  }
}
export async function getArticlesDaysAgoRange(
  daysAgoStart: number,
  daysAgoEnd: number,
) {
  const client = elasticConnection();
  try {
    const result = await client.search<Article>({
      index: "articles",
      body: {
        query: {
          range: {
            publishedAt: {
              gte: `now-${daysAgoStart}d/d`,
              lte: `now-${daysAgoEnd}d/d`,
            },
          },
        },
      },
    });
    return result.hits.hits.map((hit) => hit._source);
  } catch (error) {
    console.error("Error during Elasticsearch operation:", error);
  }
}
export async function getArticlesPastDay() {
  const client = elasticConnection();
  try {
    const result = await client.search<Article>({
      index: "articles",
      body: {
        query: {
          range: {
            publishedAt: {
              gte: "now-1d/d",
              lte: "now/d",
            },
          },
        },
      },
    });

    return result.hits.hits.map((hit) => hit._source);
  } catch (error) {
    console.error("Error during Elasticsearch operation:", error);
  }
}
export async function searchHeadlines(query: string) {
  const client = elasticConnection();
  try {
    const result = await client.search<Article>({
      index: "articles",
      body: {
        query: {
          match: {
            title: query,
          },
        },
      },
    });
    return result.hits.hits.map((hit) => hit._source);
  } catch (error) {
    console.error("Error during Elasticsearch operation:", error);
  }
}
export async function searchHeadlinesAndDesc(query: string) {
  const client = elasticConnection();
  try {
    const result = await client.search<Article>({
      index: "articles",
      body: {
      query: {
        bool: {
        must: query.split(" ").map((word) => ({
          multi_match: {
          query: word,
          fields: ["title", "description"],
          },
        })),
        },
      },
      },
    });
    return result.hits.hits.map((hit) => ({
      _id: hit._id,
      title: hit._source?.title,
      author: hit._source?.author,
      publishedAt: hit._source?.publishedAt,
    }));
  } catch (error) {
    console.error("Error during Elasticsearch operation:", error);
  }
}
/**
 * @param {string} query - the search query
 * @param {string[]} fields - the fields to search in. array can contain: title, description, content
 */
export async function searchAcrossFields(query: string, fields: string[]) {
  const client = elasticConnection();

  const validFields = ["title", "description", "content"];
  fields = fields.filter((field) => validFields.includes(field));

  try {
    const result = await client.search<Article>({
      index: "articles",
      body: {
        query: {
          multi_match: {
            query: query,
            fields: fields,
          },
        },
      },
    });
    return result.hits.hits.map((hit) => hit._source);
  } catch (error) {
    console.error("Error during Elasticsearch operation:", error);
  }
}
// ID could be an objectID or a string
export async function getDocumentByID(id: string) {
  const client = elasticConnection();
  try {
    const result = await client.get<Article>({
      index: "articles",
      id: id,
    });
    return {
      title: result._source?.title,
      author: result._source?.author,
      publishedAt: result._source?.publishedAt,
      description: result._source?.description,
      url: result._source?.url,
      imageUrl: result._source?.urlToImage,
      sourceName: result._source?.source.name,
    };
  } catch (error) {
    console.error("Error during Elasticsearch operation:", error);
  }
}
export async function getAllDocuments() {
  const client = elasticConnection();
  try {
    const result = await client.search<Article>({
      index: "articles",
      body: {
        query: {
          match_all: {},
        },
      },
      size: 1000,
    });
    return result.hits.hits.map((hit) => ({
      _id: hit._id,
      title: hit._source?.title,
      author: hit._source?.author,
      publishedAt: hit._source?.publishedAt,
    }));
  } catch (error) {
    console.error("Error during Elasticsearch operation:", error);
  }
}
export async function getArticlesByTag(tag: string) {
  const client = elasticConnection();
  try {
    const result = await client.search<Article>({
      index: "articles",
      body: {
        query: {
          match: {
            tags: tag,
          },
        },
      },
    });
    return result.hits.hits.map((hit) => hit._source);
  } catch (error) {
    console.error("Error during Elasticsearch operation:", error);
  }
}
export async function getArticlesByTags(tags: string[]) {
  const client = elasticConnection();
  try {
    const result = await client.search<Article>({
      index: "articles",
      body: {
        query: {
          terms: {
            tags: tags,
          },
        },
        sort: {
          publishedAt: {
            order: 'desc'
          }
        }
      }
    })
    // console.log('Elasticsearch query result:', result.hits.hits);
    return result.hits.hits.map(hit => {
      if (hit._source) {
        return {
          _id: hit._id,
          title: hit._source.title,
          author: hit._source.author,
          publishedAt: hit._source.publishedAt,
          url: hit._source.url,
          imageUrl: hit._source.urlToImage,
          sourceName: hit._source.source.name,
          tags: (hit._source as any).tags,
          description: hit._source.description,
        };
      }
    });
  } catch (error) {
    console.error("Error during Elasticsearch operation:", error);
  }
}
export async function getArticlesBetweenMondays(): Promise<any> {
  const client = elasticConnection();
  // this SHOULD get articles published between last Monday and this Monday
  try {
    const result = await client.search<Article>({
      index: "articles",
      body: {
        query: {
          range: {
            publishedAt: {
              gte: "now/w-7d",
              lte: "now/w",
            },
          },
        },
        sort: {
          publishedAt: {
            order: "desc",
          },
        },
      },
    });
    return result.hits.hits.map((hit) => {
      return {
        _id: hit._id,
        title: hit._source?.title,
        author: hit._source?.author,
        publishedAt: hit._source?.publishedAt,
        description: hit._source?.description,
        url: hit._source?.url,
        urlToImage: hit._source?.urlToImage,
        source: hit._source?.source.name,
      };
    });
  } catch (error) {
    console.error("Error during Elasticsearch operation:", error);
    return [];
  }
}
export async function getArticleOfTheWeek() {
  const seed =
    "Don't let yourself get attached to anything you are not willing to walk out on in 30 seconds flat if you feel the heat around the corne";
  const rng = seedrandom(seed);
  const THE_RANDOM_NUMBER = rng();
  const weekArticles = await getArticlesBetweenMondays();
  const randomIndex = Math.floor(THE_RANDOM_NUMBER * weekArticles.length);
  return weekArticles[randomIndex];
}
