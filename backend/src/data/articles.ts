import { elasticConnection, closeElasticConnection } from "../config/elasticConnection";
import { ObjectId } from "mongodb";


// query articles published within last 5 daysday
async function getArticlesPast5Days() {
    const client = await elasticConnection();
    try {
        const result = await client.search({
            index: 'articles',
            body: {
            query: {
                range: {
                publishedAt: { //elasticsearch's intuitive support for date ranges is MAGIC i tell you
                    gte: "now-5d/d",
                    lte: "now/d"
                }
                }
            }
            }
        });
        console.log(result.hits.hits.map((hit: any) => hit._source.title));
        return result.hits.hits.map((hit: any) => hit._source);
    } catch (error) {
        console.error('Error during Elasticsearch operation:', error);
    }
    await closeElasticConnection();
}


async function getArticlesDaysAgoRange(daysAgoStart: number, daysAgoEnd: number) {
    const client = await elasticConnection();
    try {
        const result = await client.search({
            index: 'articles',
            body: {
            query: {
                range: {
                publishedAt: {
                    gte: `now-${daysAgoStart}d/d`,
                    lte: `now-${daysAgoEnd}d/d`
                }
                }
            }
            }
        });
        console.log(result.hits.hits.map((hit: any) => hit._source.title));
        return result.hits.hits.map((hit: any) => hit._source);
    } catch (error) {
        console.error('Error during Elasticsearch operation:', error);
    }
    await closeElasticConnection();
}

async function getArticlesPastDay() {
    const client = await elasticConnection();
    try {
        const result = await client.search({
            index: 'articles',
            body: {
            query: {
                range: {
                publishedAt: {
                    gte: "now-1d/d",
                    lte: "now/d"
                }
                }
            }
            }
        });
        console.log(result.hits.hits.map((hit: any) => hit._source.title));
        return result.hits.hits.map((hit: any) => hit._source);
    } catch (error) {
        console.error('Error during Elasticsearch operation:', error);
    }
    await closeElasticConnection();
}

async function searchHeadlines(query: string) {
    const client = await elasticConnection();
    try {
        const result = await client.search({
            index: 'articles',
            body: {
            query: {
                match: {
                title: query
                }
            }
            }
        });
        console.log(result.hits.hits.map((hit: any) => hit._source.title));
        return result.hits.hits.map((hit: any) => hit._source);
    } catch (error) {
        console.error('Error during Elasticsearch operation:', error);
    }
    await closeElasticConnection();

}

async function searchHeadlinesAndDesc(query: string) {
    const client = await elasticConnection();
    try {
        const result = await client.search({
            index: 'articles',
            body: {
            query: {
                multi_match: {
                query: query,
                fields: ['title', 'description']
                }
            }
            }
        });
        console.log(result.hits.hits.map((hit: any) => hit._source.title));
        return result.hits.hits.map((hit: any) => hit._source);
    } catch (error) {
        console.error('Error during Elasticsearch operation:', error);
    }
    await closeElasticConnection();
}



// options field is an array that can contain any of the following strings:
// title, description, content
// if options is empty, searchAcrossFields will search only the title field

/**
 * 
 * @param {string} query - the search query
 * @param {string[]} fields - the fields to search in. array can contain: title, description, content
 */

async function searchAcrossFields(query: string, fields: string[]) {
    const client = await elasticConnection();

    const validFields = ['title', 'description', 'content'];
    fields = fields.filter(field => validFields.includes(field));
    try {
        const result = await client.search({
            index: 'articles',
            body: {
            query: {
                multi_match: {
                query: query,
                fields: fields
                }
            }
            }
        });
        console.log(result.hits.hits.map((hit: any) => hit._source.title));
        return result.hits.hits.map((hit: any) => hit._source);
    } catch (error) {
        console.error('Error during Elasticsearch operation:', error);
    }
    await closeElasticConnection();
}

// ID could be an objectID or a string
async function getDocumentByID(id: string) {
    const client = await elasticConnection();
    try {
        const result = await client.get({
            index: 'articles',
            id: id
        });
        // throws an error if nothing found. possibly consult if we want this behaior?
        // console.log(result._source.title);
        return result._source;
    } catch (error) {
        console.error('Error during Elasticsearch operation:', error);
    }
    await closeElasticConnection();
    
}


// async function test() {
//     // let doc = getArticlesPast5Days();
//     // let doc = getArticlesDaysAgoRange(10, 5);
//     // let doc = getArticlesPastDay();
//     // let doc = searchHeadlines("AI");
//     // let doc = searchHeadlinesAndDesc("AI");
//     // let doc = searchAcrossFields("Apple", ["title", "description"]);
//     let doc = await getDocumentByID("Ujv3KJMB7K6Xl8-Q8UXs");
//     console.log(doc);
// }

// test();

export default { getArticlesPast5Days, getArticlesDaysAgoRange, getArticlesPastDay, getDocumentByID, searchHeadlines, searchHeadlinesAndDesc, searchAcrossFields };