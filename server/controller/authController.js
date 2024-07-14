import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwp from "jsonwebtoken";

export const register = async (req, res) => {
  console.log("register request", req.body);
  const { username, email, password } = req.body;

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
    res.status(500).json({ message: "Something went wrong" });
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
