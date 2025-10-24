// types/Api.ts
export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
  timestamp: string;
}

// For lists
export interface ListApiResponse<T> {
  status: string;
  message: string;
  data: T[];
  timestamp: string;
}