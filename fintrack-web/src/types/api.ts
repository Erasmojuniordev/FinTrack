export interface ApiError {
  error: string;
  status?: number;
}

export interface ProblemDetails {
  title: string;
  detail?: string;
  status: number;
  instance?: string;
}
