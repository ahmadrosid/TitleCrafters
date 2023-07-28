export type Result<T> = Error | T;

export function isError(result: Result<any>): result is Error {
  return result instanceof Error;
}
