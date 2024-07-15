import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwp from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

export const register = async (req, res) => {
  console.log("register request", req.body);
  const { username, email, password } = req.body;

  console.log("register request");

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ user, message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error: error, message: "Something went wrong" });
  }
};

export const login = async (req, res) => {
  const { username, email, password } = req.body;

  const login_name = username || email;

  try {
    if (!login_name || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            username: login_name,
          },
          {
            email: login_name,
          },
        ],
      },
    });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const expiresIn = 1000 * 60 * 60 * 24 * 7; // 7 days

    const token = jwp.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn,
    });

    const { password: userPassword, ...rest } = user;

    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: expiresIn,
      })
      .status(200)
      .json({ user: rest });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Something went wrong" });
  }
};

export const logout = async (req, res) => {
  res
    .clearCookie("token")
    .status(200)
    .json({ message: "Logged out successfully" });
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  const { credential } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const { sub, email, name, picture } = payload;

    let user;
    try {
      user = await prisma.user.findUnique({
        where: { email },
      });
    } catch (error) {
      console.log("DATA BASE URL", process.env.DATABASE_URL);
      console.log("error", error);
    }

    if (!user) {
      user = await prisma.user.create({
        data: {
          username: name, // or any other logic to create a username
          email,
          googleId: sub,
          avatar: picture, // Save the user's Google profile picture if you want
        },
      });
    } else {
      // Optionally update the user information
      user = await prisma.user.update({
        where: { email },
        data: { googleId: sub, username: name, avatar: picture },
      });
    }

    const userCreated = await prisma.user.findFirst({
      where: {
        OR: [
          {
            username: name,
          },
          {
            email: name,
          },
        ],
      },
    });

    if (!userCreated) {
      return res.status(400).json({ message: "User not found" });
    }

    const expiresIn = 1000 * 60 * 60 * 24 * 7; // 7 days

    const token = jwp.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn,
    });

    const { password: userPassword, ...rest } = userCreated;

    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: expiresIn,
      })
      .status(200)
      .json({ user: rest });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Something went wrong" });
  }
};
