import express from "express";
import { login, logout, register } from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Hello from auth route");
});
router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);

export default router;