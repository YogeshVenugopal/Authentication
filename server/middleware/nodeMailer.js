import nodeMailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const transporter = nodeMailer.createTransport({
    host:"smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMPT_USER,
        pass: process.env.SMPT_PASS
    },
    // debug: true, 
    // logger: true
});

export default transporter;

