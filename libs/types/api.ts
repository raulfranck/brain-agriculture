// Tipos para respostas da API
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  error: string;
  statusCode: number;
}

// Health check
export interface HealthResponse {
  status: string;
  timestamp: string;
  uptime: number;
} 