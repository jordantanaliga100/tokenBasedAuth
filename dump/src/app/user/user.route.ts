import express from "express";
import * as UserController from "./user.controller.js"; // auto-import lahat ng exports

const router = express.Router();

// Base route: /users
router
  .route("/")
  .get(UserController.GET_ALL) // GET all users
  .post(UserController.CREATE); // CREATE user

// With ID param: /users/:id
router
  .route("/:id")
  .get(UserController.GET) // GET user by ID
  .patch(UserController.UPDATE) // UPDATE user
  .delete(UserController.DELETE); // DELETE user

// Export the router
const UserRoutes = router;
export default UserRoutes;
