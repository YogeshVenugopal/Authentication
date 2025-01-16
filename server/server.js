// import section //
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import router from "./routes/auth.route.js";
import mongoose from "mongoose";

// config the environment variables //
dotenv.config();

// initialize the express app //
const app = express();
const port = process.env.PORT || 8000;

// DB connection //
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.log(error);
})

// middlewares //
app.use(express.json());
app.use(cors({
    credentials: true,
}));
app.use(cookieParser());

// routes //
app.use("/", router);

// start the server //
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});