export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export type SortOrder = "asc" | "desc";

export interface Location {
  city: string;
  state: string;
  country: string;
  zip?: string;
}

export interface Image {
  id: string;
  url: string;
  alt: string;
  width?: number;
  height?: number;
  isPrimary?: boolean;
}
