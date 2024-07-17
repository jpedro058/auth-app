import express from "express";
import {
  register,
  display,
  edit,
  remove,
} from "../controller/taskController.js";
import authenticateToken from "../middleware/authenticateToken.js";

const router = express.Router();

router.post("/register", register);

router.get("/display/:type", authenticateToken, display);

router.put("/edit/:id", edit);

router.delete("/remove/:id", authenticateToken, remove);

export default router;
