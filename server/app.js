import express from "express";
import authRoute from "./routes/auth.js";
import userRoute from "./routes/user.js";
import taskRoute from "./routes/task.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";

const cspOptions = {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "https://accounts.google.com"], // Add other sources if needed
    styleSrc: ["'self'", "https://accounts.google.com"],
    imgSrc: ["'self'", "data:", "https://lh3.googleusercontent.com"],
    connectSrc: ["'self'", "http://localhost:8800"], // Allow API calls to your backend
    fontSrc: ["'self'"],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: [],
  },
};

const app = express();

app.use(helmet.contentSecurityPolicy(cspOptions));
app.use(cors({ origin: process.env.WEB_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/task", taskRoute);

app.listen(8800, () => {
  console.log("Server is running on port 8800");
});
