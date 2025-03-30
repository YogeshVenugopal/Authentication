import express from "express";
import { isAuth, login, logout, register, resetOtp, resetPassword, verifyEmail, verifyOtp } from "../controllers/auth.controller.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Hello from auth route");
});
router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.post("/verify-otp", userAuth, verifyOtp);
router.post("/verify-email", userAuth, verifyEmail);
router.post("/is-auth", userAuth, isAuth);
router.post("/reset-password", resetPassword);
router.post("/send-restpassword-otp", resetOtp);

export default router;