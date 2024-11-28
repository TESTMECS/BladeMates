import { z } from 'zod';

export const articleSchema = z.object({
    source: z.object({
        id: z.string().nullable(),
        name: z.string().trim(),
    }),
    author: z.string().trim(),
    title: z.string().trim(),
    description: z.string().trim(),
    url: z.string().trim(),
    urlToImage: z.string().trim(),
    publishedAt: z.string().trim(),
    content: z.string().trim().nullable(),
})
.refine(article => {
    if (article.source.name === "[Removed]") return false;
    if (article.title === "[Removed]") return false;
    if (article.description === "[Removed]") return false;
    if (article.url === "https://removed.com") return false;

    return true;
});