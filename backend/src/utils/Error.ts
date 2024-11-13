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
  errIfTrue(errStatus)(
    inputError ? true : false,
    `Error: Invalid input provided for schema: ${JSON.stringify(
      schema,
      undefined,
      2
    )}.\n${inputError}`
  );
  return inputData;
}
