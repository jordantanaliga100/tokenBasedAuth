import express from "express";
import * as PostController from "./post.controller.js";

const router = express.Router();

router
  .route("/")
  .get(PostController.GET_ALL) // GET all posts
  .post(PostController.CREATE); // CREATE post

router
  .route("/:id")
  .get(PostController.GET) // GET post by ID
  .patch(PostController.UPDATE) // UPDATE post
  .delete(PostController.DELETE); // DELETE post

const PostRoutes = router;
export default PostRoutes;
