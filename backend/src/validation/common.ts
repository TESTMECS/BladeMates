import { z } from 'zod';
import validator from 'validator';

export const stringSchema = z.string().trim().min(2); // Generic String Schema

export const titleSchema = z
  .string()
  .trim()
  .min(2)
  .max(50)
  .refine((str) => /[a-zA-Z]/.test(str)); // Checks if there is at least one alphabet letter

export const paragraphSchema = z
  .string()
  .trim()
  .min(2)
  .max(500)
  .refine((str) => /[a-zA-Z]/.test(str)); // Checks if there is at least one alphabet letter

export const nameSchema = z
  .string()
  .trim()
  .min(2)
  .max(25)
  .refine((name) => /^[a-z A-Z-0-9]+$/.test(name)); // Checks if the name contains only letters, numbers, spaces and dashes

export const usernameSchema = z
  .string()
  .min(2)
  .max(20)
  .refine((name) => /^[a-zA-Z0-9]+$/.test(name)); // Checks if the username contains only letters and numbers

export const integerSchema = z.number().int();

export const nonNegativeIntegerSchema = z.number().int().gte(0);

export const positiveIntegerSchema = z.number().int().gte(1);

export const arraySchema = z.array(z.any());

export const coercedNumberSchema = z.coerce.number();

export const coercedIntegerSchema = z.coerce.number().int();

export const coercedNonNegativeIntegerSchema = z.coerce.number().int().gte(0);

const dateValidator = (
  str: string,
  format: string = 'MM/DD/YYYY',
  delimiters: string[] = ['/']
) => validator.isDate(str, { format, strictMode: true, delimiters });

export const dateSchema = z.string().trim().date(); // YYYY-MM-DD

export const customDateSchema1 = z.string().refine((str) => dateValidator(str)); // MM/DD/YYYY

export const customDateSchema2 = z
  .string()
  .refine((str) => dateValidator(str, 'DD/MM/YYYY')); // DD/MM/YYYY

export const urlSchema = z.string().url();
