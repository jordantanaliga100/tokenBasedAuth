export interface CreatePostDto {
  title: string;
  content: string;
  authorId: number;
}

export interface UpdatePostDto {
  title?: string;
  content?: string;
  authorId?: number;
}
