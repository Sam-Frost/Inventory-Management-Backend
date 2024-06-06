export interface DatabaseResponse<T> {
    code: number;
    data: T | { message: string};
  }