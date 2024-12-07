export function validateUserInput(input: string): boolean {
  // Check if the input is not empty
  // If the input is null, undefined, or only contains whitespace, return false
  if (!input || input.trim().length === 0) {
    return false;
  }

  // minimum and maximum length for the input
  const minLength = 3;
  const maxLength = 20;

  // allows only alphanumeric characters
  const validPattern = /^[a-zA-Z0-9]+$/;

  if (input.length < minLength || input.length > maxLength) {
    return false;
  }

  if (!validPattern.test(input)) {
    return false;
  }

  return true;
}
