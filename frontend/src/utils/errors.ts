export type userIdResponse = {
  userId: string;
}

export type customError = {
  message: string;
  status: number;
  errors: [
    {
      field: string;
      message: string;
      code: string;
    }
  ];
}
export type thrownError = {
  error: string
}
export function isCustomError(error: any): error is customError {
  return error && typeof error.message === 'string' && Array.isArray(error.errors);
}

// Type guard to check if the error is a thrownError
export function isThrownError(error: any): error is thrownError {
  return error && typeof error.error === 'string';
}
export function isUserIdResponse(error: any): error is userIdResponse {
  return error && typeof error.userId === 'string';
}

export function createErrorDisplay(customError: any): string[] {
  let errorDisplay: string = "";
  customError.errors.forEach((error: any) => {
    errorDisplay += `${error.field}: ${error.message}.`;
  })
  const errorMessages: string[] = errorDisplay
    .split(".")
    .map((err) => err.trim())
    .filter((err) => err.length > 0);
  return errorMessages;

}
