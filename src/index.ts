// src/index.ts
import express, { Request, Response } from "express";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";
import cors from "cors";

const app: express.Application = express();
const port = 3000;

app.use(express.text());
app.use(bodyParser.json());
app.use(cors());
app.listen(port, () => {
  console.log(`server is listening on ${port}`);
});
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Gmail's SMTP server
  port: 465, // Secure port for SSL
  secure: true, // Use SSL
  service: "gmail", // You can use other email services like Yahoo, Outlook, etc.
  auth: {
    user: process.env.SENDER_EMAIL, // Replace with your email
    pass: process.env.SENDER_PASSWORD, // Replace with your email password or app-specific password
  },
});

app.post("/send-email", (req: Request, res: Response): void => {
  const {
    subject,
    message,
    phone,
    email,
    name,
  }: {
    subject: string;
    message: string;
    phone: number;
    email: string;
    name: string;
  } = req.body;

  // Validation for required fields
  if (!subject || !message || !phone || !email || !name) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  // Validate email format
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Invalid email format" });
    return;
  }

  const mailOptions = {
    from: email, // sender address
    to: "manishgandotra@icloud.com", // recipient address
    subject: `${name} wants to connect`, // subject line
    text: `${message}\n\nContact Details:\nName: ${name}\nPhone: ${phone}\nEmail: ${email}`, // Plain text body
  };

  // Send email
  transporter.sendMail(
    mailOptions,
    (error: Error | null, info: nodemailer.SentMessageInfo) => {
      if (error) {
        console.log(error);
        res.status(500).json({ message: "Error sending email", error });
        return;
      }
      console.log("Email sent: " + info.response);
      res.status(200).json({ message: "Email sent successfully", info });
    }
  );
});

app.get("/", (req: Request, res: Response): void => {
  res.send("Welcome to Manish Gandotra testing domain");
});
