import express from "express";
import {
  googleLogin,
  login,
  logout,
  register,
} from "../controller/authController.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout", logout);

router.post("/google-login", googleLogin);

export default router;
