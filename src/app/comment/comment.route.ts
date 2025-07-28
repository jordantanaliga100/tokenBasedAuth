import express from "express";
import * as CommentController from "./comment.controller.js";

const router = express.Router();

router
  .route("/")
  .get(CommentController.GET_ALL) // GET all comments
  .post(CommentController.CREATE); // CREATE comment

router
  .route("/:id")
  .get(CommentController.GET) // GET comment by ID
  .patch(CommentController.UPDATE) // UPDATE comment
  .delete(CommentController.DELETE); // DELETE comment

const CommentRoutes = router;
export default CommentRoutes;
