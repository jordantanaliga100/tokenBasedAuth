export interface CreateCommentDto {
  text: string;
  postId: number;
  authorId: number;
}

export interface UpdateCommentDto {
  text?: string;
  postId?: number;
  authorId?: number;
}
