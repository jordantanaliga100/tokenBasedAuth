import { Request, Response } from "express";
import { CreateCommentDto, UpdateCommentDto } from "./comment.dto.js";
import CommentService from "./comment.service.js";

export const GET_ALL = async (
  req: Request<{}, {}, {}, { page?: string; limit?: string; sort?: string }>,
  res: Response
) => {
  try {
    const { page, limit, sort } = req.query;
    const result = await CommentService.getAll({ page, limit, sort });
    res.status(200).json({
      success: true,
      data: result.data,
      count: result.count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch comments",
      error: (error as Error).message,
    });
  }
};

export const GET = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const data = await CommentService.getById(req.params.id);
    if (!data)
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch comment",
      error: (error as Error).message,
    });
  }
};

export const CREATE = async (
  req: Request<{}, {}, CreateCommentDto>,
  res: Response
) => {
  try {
    const data = await CommentService.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create comment",
      error: (error as Error).message,
    });
  }
};

export const UPDATE = async (
  req: Request<{ id: string }, {}, UpdateCommentDto>,
  res: Response
) => {
  try {
    const data = await CommentService.update(req.params.id, req.body);
    if (!data)
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update comment",
      error: (error as Error).message,
    });
  }
};

export const DELETE = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const success = await CommentService.delete(req.params.id);
    if (!success)
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete comment",
      error: (error as Error).message,
    });
  }
};
