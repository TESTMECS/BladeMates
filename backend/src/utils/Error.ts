import axios from 'axios';

// Types
import { Response } from 'express';
import { Schema } from 'zod';

export class StatusError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export const errIfTrue =
  (errN: number) =>
    (condition: boolean, errMsg: string, ...msgDataArr: unknown[]) => {
      if (condition) {
        throw new StatusError(
          errN,
          `
          ${errMsg}
          ${msgDataArr.map((d) => `  ${d}\n`)}
        `
        );
      } else return true;
    };

export const handleRouteError = (e: unknown, res: Response) => {
  console.error(e);
  if (!res.status) return;
  if (e instanceof StatusError)
    return res.status(e.status).send({ error: e.message });
  else if (axios.isAxiosError(e)) {
    return res.status(e.status ?? 500).send({ error: e.message });
  } else {
    return res.status(500).send(e);
  }
};

export function validate(schema: Schema, unk: unknown, errStatus = 400) {
  const { data: inputData, error: inputError } = schema.safeParse(unk);
  // Check if there were any validation errors
  // Changed to better throw errors for Frontend. Use JSON.parse to convert from string.
  if (inputError) {
    const structuredErrors = inputError.errors.map((err) => ({
      field: err.path.join(' > '), // Error path (field name, for nested fields use >)
      message: err.message,         // The error message
      code: err.code || 'unknown',  // Error code (e.g., too_small, custom, etc.)
    }));
    // Throw a StatusError with the structured error information
    errIfTrue(errStatus)(
      true,
      JSON.stringify({
        status: errStatus,
        message: 'Invalid input provided',
        errors: structuredErrors,
      }, null, 2)
    );
  }
  return inputData;
}

export function validateWithType<T>(
  schema: Schema,
  unk: unknown,
  errStatus = 400
): T {
  return validate(schema, unk, errStatus) as T;
}
