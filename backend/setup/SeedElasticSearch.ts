// added mozilla readability, axios, jsdom, dotenv, and types as needed

import { Client } from '@elastic/elasticsearch';
import axios from 'axios';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import dotenv from 'dotenv';
dotenv.config({ path: `../../.env` }); //this is the path it would need from the dist folder. not current folder

interface Source {
    id: string | null;
    name: string;
}
// unsure if we'll be needing this

interface Article {
    source: Source;
    author: string;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    content: string | null;
}

interface NewsApiResponse {
    status: 'ok' | 'error';
    totalResults: number;
    articles: Article[];
}




async function requestAndExtract() {
    const apiKey = process.env.NEWSAPI_KEY;
    const url = `https://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=${apiKey}`;
    const response = await axios.get<NewsApiResponse>(url); //might have to try catch this in the event of a type error
    if (response.data.status !== 'ok') {
        console.error('Error getting news');
        return;
    }
    let result = await grabbingText(response.data);
    return result;
}


async function grabbingText(newsApiResponse: NewsApiResponse) {
    let resultDump: Article[] = [];
    let tempResponseIndiv
    for (let article of newsApiResponse.articles) {
        let articleUrl = article.url;
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

async function insertIntoIndex(ArticlesArray: Article[]) {
    const client = new Client({ node: 'http://localhost:9200' });
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


        // insert articles
        console.log('Inserting articles into index');
        for (let article of ArticlesArray) {
            await client.index({
                index: 'articles',
                body: article
            });
        }
    } catch (error) {
        console.error('Error during Elasticsearch operation:');
    }

}

async function fullAttempt() {
    const articles = await requestAndExtract();
    // console.log(articles);
    if (articles) {
        await insertIntoIndex(articles);
    } else {
        console.error('No articles to insert');
    }
}

fullAttempt();
// console.log(process.env);