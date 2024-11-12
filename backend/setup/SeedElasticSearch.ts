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
    const url = `https://newsapi.org/v2/everything?apiKey=${apiKey}&q="technology"&searchIn=title,description`;
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

function validateArticle(article: Article): boolean {
    if (!article.source || !article.source.name || article.source.name === "[Removed]") {
        return false;
    }
    if (!article.title || article.title === "[Removed]") {
        return false;
    }
    if (!article.description || article.description === "[Removed]") {
        return false;
    }
    if (!article.url || article.url === "https://removed.com") {
        return false;
    }
    if (!article.urlToImage || article.urlToImage === null) {
        return false;
    }
    if (!article.author || article.author === null) {
        return false;
    }


    return true;
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
            if (!validateArticle(article)) {
                continue
            }
            await client.index({
                index: 'articles',
                body: article
            });
        }
    } catch (error) {
        console.error('Error during Elasticsearch operation:');
    }

}

function addTagsToArticle(article: Article): String[] {
    // todo: this function takes in the article, returns a string of tags that could be in the article
    // adjust the insertIntoIndex function to take request tags from this function and add it to the document before inserting into index
    let possibleTags = ["video games", "artificial intelligence", "cryptocurrency", "cybersecurity", "samsung", "google", "metaverse", "facebook", "facial recognition", "microsoft", "blockchain", "internet of things"]
    let tags: String[] = [];
    for (let tag of possibleTags) {
        if (article.content && article.title && article.description) {
            if (article.content.toLowerCase().includes(tag) || article.title.toLowerCase().includes(tag) || article.description.toLowerCase().includes(tag)) {
                tags.push(tag);
            }
        }
    }
    return tags;
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