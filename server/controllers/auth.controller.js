import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../middleware/nodeMailer.js";
import dotenv from "dotenv";
dotenv.config();

export const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcryptjs.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });


        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: process.env.NODE_ENV === "development" ? "strict" : "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        await user.save();
        if (!process.env.SMPT_USER || !process.env.SMPT_PASS) {
            console.error('SMTP credentials are missing');
            process.exit(1);
        }
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email.trim(),
            subject: "Welcome to the website",
            text: `Welcome to our website your account has been created with email : ${email}`
        }
        try {
            await transporter.sendMail(mailOptions);
            console.log("Email sent successfully");
            return res.status(201).json({ message: "User registered successfully", user });

        } catch (error) {
            console.log("Failed to send email");
        }

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }
        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: process.env.NODE_ENV === "development" ? "strict" : "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.status(200).json({ message: "User logged in successfully", user });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: error.message });
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: process.env.NODE_ENV === "development" ? "strict" : "none",
        });
        return res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}


export const verifyOpt = async (req, res) => {
    const { userId } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }
        if(user.isAccountVerified){
            return res.status(400).json({ message: "User is already verified" });
        }
        const opt = String(Math.floor(100000 + Math.random() * 900000));
        user.verifyOtp = opt;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
        await user.save();
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email.trim(),
            subject: "Verify your email",
            text: `Your OTP is : ${opt}`
        }
        await transporter.sendMail(mailOptions);
    
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: error.message });
    }

}

export const verifyOtp = async (req, res) => {
    const { userId, otp } = req.body;
    if(!userId || !otp){
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }
        if(user.isAccountVerified){
            return res.status(400).json({ message: "User is already verified" });
        }
        if (user.verifyOtpExpireAt < Date.now()) {
            return res.status(400).json({ message: "OTP has expired" });
        }
        if (user.verifyOtp !== otp || user.verifyOtp === "") {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        user.isAccountVerified = true;
        user.verifyOtp = "";
        user.verifyOtpExpireAt = 0; 
        await user.save();
        return res.status(200).json({ message: "User verified successfully" });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: error.message });
    }
}