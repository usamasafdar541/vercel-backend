const Users = require("../modles/userModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
// const secretKey = "mySecretKey";
const bcrypt = require("bcrypt");

const createUser = asyncHandler(async (req, res) => {
  try {
    const { email, name, password, confirmPassword } = req.body;
    console.log(req.body);
    if (!email || !name || !password || !confirmPassword) {
      return res.status(400).json({
        message: "Fields are required",
      });
    }
    if (password != confirmPassword) {
      return res.status(400).json({
        status: false,
        message: "Password And confirm Password do not match",
      });
    }
    const userExist = await Users.findOne({ email });
    if (userExist) {
      return res.status(400).json({
        status: false,
        message: "User Already exist",
      });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await new Users({
      email,
      name,
      password: hash,
    });
    const result = await user.save();
    if (result) {
      return res.status(200).json({
        status: true,
        message: "User Created Successfully",
        data: result,
      });
    }
  } catch (error) {
    return res.status(409).json({
      status: false,
      message: "Error in creating User",
      error: error.message,
    });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "No User Found with this email",
      });
    }
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res.status(401).json({
        status: false,
        message: "Invalid Credentials",
      });
    }
    const tokenPayload = {
      user: { id: user.id, name: user.name, email: user.email },
    };
    console.log(tokenPayload, "Payload");
    const token = jwt.sign(tokenPayload, jwtSecret, {
      expiresIn: "1h",
    });
    return res.status(200).json({
      status: true,
      message: "Logged In  Successfully",
      payload: tokenPayload,
      token: token,
    });
    // console.log(token);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "error in Login",
      error: error.message,
    });
  }
});
const currentUser = asyncHandler(async (req, res) => {
  try {
    return res.json(req.user);
  } catch (error) {}
});

const singleUser = asyncHandler(async (req, res) => {
  try {
  } catch (error) {}
});
const addUser = asyncHandler(async (req, res) => {});
const updateUser = asyncHandler(async (req, res) => {});

const deleteUser = asyncHandler(async (req, res) => {
  try {
  } catch (error) {}
});
module.exports = {
  createUser,
  loginUser,
  currentUser,
  updateUser,
  deleteUser,
  singleUser,
};
