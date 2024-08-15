require("dotenv").config();
const { Router } = require("express");
const router = Router();
const zod = require("zod");
const { User, Account } = require("../db");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("../middleware");
const token = process.env.JWT_SECRET;

const signupBody = zod.object({
  username: zod.string().email(),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string(),
});

router.post("/signup", async (req, res) => {
  const payLoad = req.body;
  const success = signupBody.safeParse(payLoad);
  if (!success) {
    return res.status(411).json({
      message: "Email already taken / Incorrect inputs",
    });
  }
  const existingUser = await User.findOne({ username: payLoad.username });
  if (existingUser) {
    return res.status(411).json({
      message: "Email already taken / Incorrect inputs",
    });
  }
  const dbUser = await User.create(payLoad);
  const userId = dbUser._id;
  await Account.create({
    userId,
    balance: 1 + Math.random() * 10000,
  });
  const jwttoken = jwt.sign(
    {
      userId,
    },
    token
  );
  return res.json({
    message: "User created successfully",
    token: jwttoken,
  });
});

const signinBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});

router.post("/signin", async (req, res) => {
  const payLoad = req.body;
  const success = signinBody.safeParse(payLoad);
  if (!success) {
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }
  const user = await User.findOne({
    username: payLoad.username,
    password: payLoad.password,
  });
  if (user) {
    const tokenn = jwt.sign(
      {
        userId: user._id,
      },
      token
    );

    return res.status(200).json({
      token: tokenn,
    });
  }
});

const updateBody = zod.object({
  password: zod.string().optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});

router.put("/", authMiddleware, async (req, res) => {
  const body = req.body();
  const { success } = updateBody.safeParse(body);
  if (!success) {
    res.status(411).json({
      message: "Error while updating information",
    });
  }
  const user = User.findOneAndUpdate({ _id: req.userId }, { body });
  return res.json({
    message: "Updated successfully",
  });
});

router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";

  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
        },
      },
      {
        lastName: {
          $regex: filter,
        },
      },
    ],
  });

  res.json({
    user: users.map((user) => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
});

module.exports = router;
