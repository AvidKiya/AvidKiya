// API Response Types

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
}

export interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
}

export interface SuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}