import express from "express";
import userAuth from "../middleware/userAuth.js";
import { getUserData } from "../controllers/user.controller.js";


const router = express.Router();

router.get("/userData", userAuth, getUserData)


export default router ;