// added mozilla readability, axios, jsdom, dotenv, and types as needed
// run this bad boy with ts-node .\tasks\seedElasticSearch.ts from the backend directory 
import { elasticConnection, closeElasticConnection } from '../src/config/elasticConnection';
import axios from 'axios';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import {
    NewsApiResponse,
    Article,
} from '../src/types/newsApiTypes';
import dotenv from 'dotenv';
import { articleSchema } from '../src/validation/newsApi';
import { tags } from '../src/utils/tagsData';
dotenv.config(); //this is the path it would need from the dist folder. not current folder


async function getArticlesWithFullContent() {
    const apiKey = process.env.NEWSAPI_KEY;
    const url = `https://newsapi.org/v2/everything?apiKey=${apiKey}&q="technology"&searchIn=title,description`;
    const response = await axios.get<NewsApiResponse>(url); //might have to try catch this in the event of a type error
    if (response.data.status !== 'ok') {
        console.error('Error getting news');
        return;
    }
    let result = await getFullContentForArticles(response.data);
    return result;
}

async function getFullContentForArticles(newsApiResponse: NewsApiResponse) {
    let resultDump: Article[] = [];

    for (let article of newsApiResponse.articles) {
        let articleUrl = article.url;
        let tempResponseIndiv;

        try {
            tempResponseIndiv = await axios.get(articleUrl);
        } catch (error) {
            console.error(`Error grabbing ${article.url}. not adding to resultDump`)
            continue;
        }

        let dom, readerArticle;

        try {
            dom = new JSDOM(tempResponseIndiv.data, { url: articleUrl });
            readerArticle = new Readability(dom.window.document).parse();
        } catch (error) {
            console.error(`Error parsing article ${article.url}`)
            continue;
        }

        if (!readerArticle || typeof readerArticle.textContent !== 'string') {
            console.error(`Error processing ${article.url}. not adding to resultDump`);
            continue;
        }

        let updatedArticle: Article = {
            source: article.source,
            author: article.author,
            title: article.title,
            description: article.description,
            url: article.url,
            urlToImage: article.urlToImage,
            publishedAt: article.publishedAt,
            content: readerArticle.textContent,
        };

        resultDump.push(updatedArticle);
    }

    return resultDump;
}

async function indexAndTagArticles(ArticlesArray: Article[]) {
    const client = await elasticConnection();
    try {
        // check if articles index exists
        const indexExists = await client.indices.exists({ index: 'articles' });
        console.log(indexExists);

        // if not, create it
        if (!indexExists) {
            console.log('Creating index');
            await client.indices.create({ index: 'articles' });
            console.log('Index created');
        } else {
            console.log('Index already exists');
        }

        for (let article of ArticlesArray) {
            const res = await articleSchema.spa(article);

            if (!res.success)
                continue;

            console.log('Inserting article:', article.title);

            await client.index({
                index: 'articles',
                document: { ...article, tags: [] }
            });

        }

        await client.indices.refresh({ index: 'articles' });

        console.log('Tagging articles');

        for (const tag in tags) {
            const queryString = tags[tag].map(
                (tagVal) => `(${tagVal})`
            ).join(' OR ');

            const result = await client.search({
                index: 'articles',
                query: {
                    multi_match: {
                        query: queryString,
                        fields: ['title', 'description', 'content']
                    }
                }
            });

            await client.updateByQuery({
                index: 'articles',
                refresh: true,
                script: {
                    source: 'ctx._source.tags.add(params.tag)',
                    params: { tag }
                },
                query: {
                    multi_match: {
                        query: queryString,
                        fields: ['title', 'description', 'content']
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error during Elasticsearch operation:', error);
    }

    await closeElasticConnection();
    console.log('ElasticSearch Connection closed!');
}

async function seedElasticSearch() {
    const articles = await getArticlesWithFullContent();

    if (articles) {
        await indexAndTagArticles(articles);
    } else {
        console.error('No articles to insert');
    }
}

await seedElasticSearch();