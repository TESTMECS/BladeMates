import { z } from 'zod';
import { stringSchema } from './common';
import { stringObjectIdSchema } from './mongo';

export const addNewCommentSchema = z.object({
  articleId: stringSchema,
  content: z.string().trim().min(1),
});

export const editCommentSchema = z.object({
  commentId: stringObjectIdSchema,
  content: z.string().trim().min(1),
});
