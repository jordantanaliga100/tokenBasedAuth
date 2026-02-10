import { Request, Response } from "express";
import { CreatePostDto, UpdatePostDto } from "./post.dto.js";
import PostService from "./post.service.js";

export const GET_ALL = async (
  req: Request<{}, {}, {}, { page?: string; limit?: string; sort?: string }>,
  res: Response
) => {
  try {
    const { page, limit, sort } = req.query;
    const result = await PostService.getAll({ page, limit, sort });
    res.status(200).json({
      success: true,
      data: result.data,
      count: result.count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
      error: (error as Error).message,
    });
  }
};

export const GET = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const data = await PostService.getById(req.params.id);
    if (!data)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch post",
      error: (error as Error).message,
    });
  }
};

export const CREATE = async (
  req: Request<{}, {}, CreatePostDto>,
  res: Response
) => {
  try {
    const data = await PostService.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create post",
      error: (error as Error).message,
    });
  }
};

export const UPDATE = async (
  req: Request<{ id: string }, {}, UpdatePostDto>,
  res: Response
) => {
  try {
    const data = await PostService.update(req.params.id, req.body);
    if (!data)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update post",
      error: (error as Error).message,
    });
  }
};

export const DELETE = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const success = await PostService.delete(req.params.id);
    if (!success)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete post",
      error: (error as Error).message,
    });
  }
};
