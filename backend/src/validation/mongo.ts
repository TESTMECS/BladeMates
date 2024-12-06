import { ObjectId } from 'mongodb';
import { z } from 'zod';

export const stringObjectIdSchema = z
  .string()
  .trim()
  .refine((id) => ObjectId.isValid(id), { message: 'Invalid Object Id' });

export const objectIdSchema = z.any().refine((id) => ObjectId.isValid(id), {
  message: 'Invalid Object Id',
});

export const coercedObjectIdSchema = z
  .any()
  .refine((id) => ObjectId.isValid(id), {
    message: 'Invalid Object Id',
  })
  .transform((id) => id.toString());
