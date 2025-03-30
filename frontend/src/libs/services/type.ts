export type BaseResponse<T = Record<string, string>> = {
  success: boolean;
  message: string;
  data: T;
  metadata?: {
    current_page: number;
    total_page: number;
  };
};
