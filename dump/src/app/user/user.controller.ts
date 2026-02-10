import { Request, Response } from "express";
import { CreateDto, UpdateDto } from "./user.dto.js";
import UserService from "./user.service.js";
// GET all users with optional query params (page, limit, sort)

export const GET_ALL = async (
  req: Request<{}, {}, {}, { page?: string; limit?: string; sort?: string }>,
  res: Response<{
    success: boolean;
    data?: any;
    count?: number;
    message?: string;
    error?: string;
  }>
) => {
  try {
    const { page, limit, sort } = req.query;
    const result = await UserService.getAll({ page, limit, sort });
    res.status(200).json({
      success: true,
      data: result.data,
      count: result.count,
    });
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: err.message,
    });
  }
};

// GET user by ID
export const GET = async (
  req: Request<{ id: string }, {}, {}, {}>,
  res: Response<{
    success: boolean;
    data?: any;
    message?: string;
    error?: string;
  }>
) => {
  try {
    const data = await UserService.getById(req.params.id);
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: err.message,
    });
  }
};

// CREATE user
export const CREATE = async (
  req: Request<{}, {}, CreateDto>,
  res: Response<{
    success: boolean;
    data?: any;
    message?: string;
    error?: string;
  }>
) => {
  try {
    const data = await UserService.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    res.status(400).json({
      success: false,
      message: "Failed to create user",
      error: err.message,
    });
  }
};

// UPDATE user by ID
export const UPDATE = async (
  req: Request<{ id: string }, {}, UpdateDto>,
  res: Response<{
    success: boolean;
    data?: any;
    message?: string;
    error?: string;
  }>
) => {
  try {
    const data = await UserService.update(req.params.id, req.body);
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    res.status(400).json({
      success: false,
      message: "Failed to update user",
      error: err.message,
    });
  }
};

// DELETE user by ID
export const DELETE = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response<{ success: boolean; message?: string; error?: string }>
) => {
  try {
    const success = await UserService.delete(req.params.id);
    if (!success) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(204).send();
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: err.message,
    });
  }
};
