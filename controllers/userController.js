const Users = require("../modles/userModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
// const secretKey = "mySecretKey";
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const { token } = require("morgan");

const createUser = asyncHandler(async (req, res) => {
  try {
    const { email, name, password, confirmPassword, roles } = req.body;
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
    if (password.length < 7) {
      res.status(400).json({
        message: "Password Must be more than 7 charachters Long",
      });
    }
    const userExist = await Users.findOne({ email });
    if (userExist) {
      return res.status(400).json({
        status: false,
        message: "User Already exist",
      });
    }
    //password HAshing
    const hash = await bcrypt.hash(password, 10);
    let user;
    // if (roles === "superadmin") {
    // const requestingUser = req.user;
    // if (!requestingUser || requestingUser.roles !== "superadmin") {
    //   res.status(403).json({
    //     status: false,
    //     message: "ONLY SUPERADMIN CAN CREATE AN ADMIN",
    //   });
    //   user = await new Users({
    //     email,
    //     name,
    //     password: hash,
    //     roles: ["admin"],
    //   });
    // }
    // } else {
    user = await new Users({
      email,
      name,
      password: hash,
      roles: ["employee"],
    });
    // }
    const result = await user.save();
    const payload = {
      userId: result._id,
      userEmail: result.email,
      userName: result.name,
      roles: result.roles,
    };
    if (result) {
      return res.status(200).json({
        status: true,
        message: "User Created Successfully",
        data: payload,
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
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        // roles: user.roles,
      },
    };

    // const isAdmin = user.roles === "admin";
    // const redirectURL = isAdmin ? "/admin-dashboard" : "/employee-dashboard";

    const token = jwt.sign(tokenPayload, jwtSecret, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      status: true,
      message: "Logged In Successfully",
      payload: {
        ...tokenPayload,
        // isAdmin: isAdmin,
      },
      token: token,
      // redirectURL: redirectURL,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error in Login",
      error: error.message,
    });
  }
});

const currentUser = asyncHandler(async (req, res) => {
  try {
    return res.json(req.user);
  } catch (error) {}
});
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "usamasafdar541@gmail.com",
    pass: "Shampy@78689",
  },
});
//forgot password middleware

const forgotPassword = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "No User Found with this email",
      });
    }
    const resetToken = jwt.sign(
      {
        userId: user._id,
      },
      process.env.jwtSecret,
      {
        expiresIn: "1h",
      }
    );
    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 3600000;
    await user.save();
    //send the reset password
    const resetPasswordLink = `http://your-app.com/reset-password/${resetToken}`;
    const mailOptions = {
      from: "noreply@gmail.com",
      to: email,
      subject: "Password Reset",
      text: `Click the following link to reset your password: ${resetPasswordLink}`,
    };
    await transporter.sendMail(mailOptions);
    return res.status(200).json({
      status: true,
      message: "Reset Password email send Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error in Sending Email",
      error: error.message,
    });
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    const user = await Users.findOne({
      resetToken,
      resetTokenExpiration: { $gt: Date.now() },
    });
    if (!user) {
      res.status(404).json({
        status: false,
        message: "Invalid or expired Reset Token",
      });
    }
    const hash = await bcrypt.hash(newPassword, 10);
    user.password = hash;
    user.resetToken = null;
    user.resetTokenExpiration = null;

    await user.save();
    return res.status(200).json({
      status: true,
      message: "Password Reset Successfully ",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error in resetting Password",
      error: error.message,
    });
  }
});

const createNewUser = asyncHandler(async (req, res) => {
  try {
    // Check if the user has admin role
    // if (req?.Users?.roles === "admin") {
    const {
      name,
      email,
      designation,
      department,
      gender,
      phone,
      cnic,
      address,
    } = req.body;

    // Check if required fields are present
    if (
      !name ||
      !email ||
      !designation ||
      !department ||
      !gender ||
      !phone ||
      !cnic ||
      !address
    ) {
      return res.status(404).json({
        status: false,
        message: "All fields are required",
      });
    }

    // Check if the email already exists
    const emailExist = await Users.findOne({ email });
    if (emailExist) {
      return res.status(404).json({
        status: false,
        message: "Email already exists",
      });
    }

    // Check if the CNIC already exists
    const cnicExist = await Users.findOne({ cnic });
    if (cnicExist) {
      return res.status(404).json({
        status: false,
        message: "CNIC already exists",
      });
    }

    // Create a new user
    const user = new Users({
      name,
      email,
      designation,
      department,
      gender,
      phone,
      cnic,
      address,
    });

    // Save the user to the database
    const result = await user.save();

    return res.status(200).json({
      status: true,
      message: "User created successfully",
      data: result,
    });
    // } else {
    // If the user doesn't have admin role, return unauthorized
    return res.status(404).json({
      status: false,
      message: "UNAUTHORIZED, Admin access required",
    });
    // }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error in creating user",
      error: error.message,
    });
  }
});
//allusres request
const getUser = asyncHandler(async (req, res) => {
  try {
    const result = await Users.find();
    if (result) {
      res.status(200).json({
        status: true,
        message: "All users are fetched",
        data: result,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "No users found",
      error: error.message,
    });
  }
});

const getUserById = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Users.findById(id);
    if (result) {
      res.status(200).json({
        status: true,
        message: "User Found Successfully with this id",
        data: result,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "No user exists with this id ",
      error: error.message,
    });
  }
});
const updateUser = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const {
      name,
      email,
      designation,
      department,
      gender,
      phone,
      cnic,
      address,
    } = req.body;

    const result = await Users.findByIdAndUpdate(
      id,
      { name, email, designation, department, gender, phone, cnic, address },
      { new: true }
    );
    return res.status(200).json({
      status: true,
      message: "User Updated Successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error in updating User",
      error: error.message,
    });
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Users.findByIdAndDelete(id);
    if (result) {
      res.status(200).json({
        status: true,
        message: "User with this id is Deleted Successfully",
        data: result,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error in deleting User ",
      error: error.message,
    });
  }
});
module.exports = {
  createUser,
  loginUser,
  currentUser,
  updateUser,
  deleteUser,
  createNewUser,
  getUserById,
  forgotPassword,
  getUser,
  resetPassword,
};
