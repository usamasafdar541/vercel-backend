const Users = require("../../modles/userModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
const otpService = require("../../services/otpService");
// const secretKey = "mySecretKey";
// const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

const {
  registerUserValidation,
  loginUserValidation,
  forgotPasswordValidation,
  resetPasswordValidations,
  updatePasswordValidation,
} = require("../../middleware/validator/validations");

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { error } = registerUserValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: false,
        message: error.details[0].message,
      });
    }
    const { email, name, password, confirmPassword } = req.body;
    const userExist = await Users.findOne({ email });

    if (userExist) {
      return res.status(400).json({
        status: false,
        message: "User already exists",
      });
    }
    // Password Hashing
    const hash = await bcrypt.hash(password, 10);
    const user = await new Users({
      email,
      name,
      password: hash,
      roles: ["employee"],
    });

    const result = await user.save();

    const payload = {
      userId: result._id,
      userEmail: result.email,
      userName: result.name,
      roles: result.roles,
    };

    return res.status(201).json({
      status: true,
      message: "User created successfully",
      data: payload,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error in creating user",
      error: error.message,
    });
  }
});
const loginUser = asyncHandler(async (req, res, next) => {
  try {
    const { error } = loginUserValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: false,
        message: error.details[0].message,
      });
    }
    const { email, password } = req.body;
    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "No user found with this email",
      });
    }

    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
      return res.status(401).json({
        status: false,
        message: "Invalid credentials",
      });
    }
    const isAdmin = user.roles.includes("admin");
    const tokenPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles,
      isAdmin: isAdmin,
    };
    //this is the changed version of my code
    const token = jwt.sign(tokenPayload, jwtSecret, {
      expiresIn: "1h",
    });

    const responseData = {
      status: true,
      message: "Logged in successfully",
      userType: isAdmin ? "admin" : "user",
      // ...tokenPayload,
      //  IFI DONT WANNA USE DATA:tokenPayload
      userData: tokenPayload,
      token: token,
    };
    return res.status(200).json(responseData);
  } catch (error) {
    next(error);
  }
});

const currentUser = asyncHandler(async (req, res) => {
  try {
    return res.json(req.user);
  } catch (error) {}
});

//forgot password middleware With Node Mailer

// const forgotPassword = asyncHandler(async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await Users.findOne({ email });

//     if (!user) {
//       return res.status(404).json({
//         status: false,
//         message: "No User Found with this email",
//       });
//     }

//     // Generate a reset token
//     const resetToken = jwt.sign(
//       {
//         userId: user._id,
//       },
//       // process.env.jwtSecret,
//       jwtSecret,
//       {
//         expiresIn: "1h",
//       }
//     );

//     // Set user properties for password reset
//     user.resetToken = resetToken;
//     user.resetTokenExpiration = Date.now() + 3600000; // 1 hour expiration
//     await user.save();

//     // Create the reset password link after generating the token
//     const resetPasswordLink = `http://your-app.com/reset-password/${resetToken}`;

//     // Setup the email transport configuration
//     const transporter = nodemailer.createTransport({
//       host: 'smtp.ethereal.email',
//       port: 587,
//       auth: {
//         user: 'carlie21@ethereal.email',
//         pass: 'UGzt3jXxQSgEvURb9u',
//       },
//     });

//     // Mail options with the reset password link
//     const mailOptions = {
//       from: "noreply@gmail.com",
//       to: "usamasafdar541@gmail.com",
//       subject: "Password Reset Link",
//       text: `Click the following link to reset your password: ${resetPasswordLink}`,
//     };

//     // Send the reset password email
//     await transporter.sendMail(mailOptions);

//     return res.status(200).json({
//       status: true,
//       message: "Reset Password email sent successfully",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: false,
//       message: "Error in Sending Email",
//       error: error.message,
//     });
//   }
// });

// Reset Password Node mailer

// const resetPassword = asyncHandler(async (req, res) => {
//   try {
//     const { resetToken, newPassword } = req.body;
//     const user = await Users.findOne({
//       resetToken,
//       resetTokenExpiration: { $gt: Date.now() },
//     });
//     if (!user) {
//       res.status(404).json({
//         status: false,
//         message: "Invalid or expired Reset Token",
//       });
//     }
// const hash = rawait bcrypt.hash(newPassword, 10);
//     user.password = hash;
//     user.resetToken = null;
//     user.resetTokenExpiration = null;

//     await user.save();
//     return res.status(200).json({
//       status: true,
//       message: "Password Reset Successfully ",
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       message: "Error in resetting Password",
//       error: error.message,
//     });
//   }
// });

//oTP MIDDLEwARE
const otpStorage = {};

const forgotPassword = asyncHandler(async (req, res) => {
  try {
    const { error } = forgotPasswordValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: false,
        message: error.details[0].message,
      });
    }
    const { email } = req.body;
    const user = await Users.findOne({ email });
    if (!user) {
      res.status(404).json({
        status: false,
        message: "No User Exist with this email",
      });
    }
    const otp = otpService.generateOtp();
    console.log(`OTP for user ${email} :${otp}`);
    otpStorage[email] = otp;
    console.log(`Stored OTP for user ${email}: ${otpStorage[email]}`);
    const payload = {
      name: user.name,
      email: user.email,
      password: user.password,
    };
    res.status(200).json({
      status: true,
      message: "Password Reset Request Successfull",
      otp: otp,
      data: payload,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "error In sending OTP",
      error: error.message,
    });
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  try {
    const { error } = resetPasswordValidations.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: false,
        message: error.details[0].message,
      });
    }
    const { email, otp, newPassword, confirmNewPassword } = req.body;
    console.log(`Received OTP for user ${email}: ${otp}`);
    console.log(`Stored OTP for user ${email}: ${otpStorage[email]}`);

    // if (!email || !otp || !newPassword) {
    //   res.status(401).json({
    //     status: "False",
    //     message: "All fields are Required ",
    //   });
    // }
    if (newPassword !== confirmNewPassword) {
      res.status(500).json({
        status: false,
        message: "Password Do not match",
      });
    }

    if (otp === otpStorage[email]) {
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      await Users.findOneAndUpdate({ email }, { password: hashedNewPassword });
      console.log(`password for user ${email} reset to: ${newPassword}`);
      delete otpStorage[email];
      return res.status(200).json({
        status: true,
        message: "Password reset successfully",
        // data: payload,
      });
    } else {
      return res.status(400).json({
        status: "error",
        message: "Invalid OTP. Password reset failed.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "error in resetting",
      error: error.message,
    });
  }
});

//allusres request
const getUser = asyncHandler(async (req, res) => {
  try {
    const result = await Users.find({ roles: { $ne: "admin" } });
    //roles:{$ne:"admin"} means Roles not equal to admin
    console.log(result, "result from the service");
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

const UpdatePassword = asyncHandler(async (req, res) => {
  try {
    const { error } = updatePasswordValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: false,
        message: error.details[0].message,
      });
    }
    const { oldPassword, newPassword } = req.body;
    // const id = req.params.id;
    const id = req.user.id;
    const user = await Users.findById(id);
    console.log(`user with this ${id} is ${user}`);
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "No User Found with this id",
      });
    }
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        status: false,
        message: "Invalid Current Password",
      });
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    await Users.findByIdAndUpdate(id, {
      password: hashed,
    });
    return res.status(200).json({
      status: true,
      message: "Password Update Successfull",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error In Updating Password",
      error: error.message,
    });
  }
});
module.exports = {
  registerUser,
  loginUser,
  currentUser,
  getUserById,
  forgotPassword,
  UpdatePassword,
  getUser,
  resetPassword,
};
