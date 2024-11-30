import { boolean, z } from 'zod';
import { stringSchema, usernameSchema } from './common';
import { objectIdSchema } from './mongo';

// Password Complexity: https://forum.codewithmosh.com/t/password-complexity-for-zod/23622
// Minimum, 1 uppercase, 1 lowercase, 1 number, 1 special character

export const notificationSchema = z.object({
  _id: objectIdSchema,
  friendId: objectIdSchema,
  articleId: objectIdSchema,
  read: z.boolean(),
});

export const userSchema = z.object({
  _id: objectIdSchema,
  username: usernameSchema,
  hashedPassword: stringSchema,

  comments: z.array(objectIdSchema),
  favoriteArticles: z.array(objectIdSchema),
  friends: z.array(
    z.object({
      _id: objectIdSchema,
      name: usernameSchema,
    })
  ),
  trends: z.array(stringSchema),
  notifications: z.array(notificationSchema),
});

// export type User = z.infer<typeof userSchema>;
// export type Notification = z.infer<typeof notificationSchema>;
