export type CreateDTO<T> = Omit<T, "id" | "created_at" | "updated_at">;
export type UpdateDTO<T> = Partial<Omit<T, "id">>;

export type ResponseDTO<T, Extra = {}> = {
  success?: boolean;
  status?: number;
  message?: string;
  count?: number;
  data?: Omit<T, "password" | "deletedAt"> & Extra;
};
