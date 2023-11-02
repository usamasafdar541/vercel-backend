const Users = require("../../modles/userModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const multerMiddleware = require("../../middleware/fileupload/fileUpload");
const multer = require("multer");
const jwtSecret = process.env.JWT_SECRET;
const bcrypt = require("bcrypt");
const addAdmin = asyncHandler(async (req, res) => {
  try {
    const { email, name, password, roles } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({
        status: false,
        message: "All Credentials Are Required",
      });
    }
    const adminExist = await Users.findOne({ email, roles: ["admin"] });
    if (adminExist) {
      return res.status(400).json({
        status: false,
        message: "Admin already exists",
      });
    }

    // Password Hashing
    const hash = await bcrypt.hash(password, 10);
    const adminUser = new Users({
      email: "Admin23@gmail.com",
      name: "Admin",
      password: hash, // Store the hashed password
      roles: ["admin"],
    });

    await adminUser.save();

    res.status(201).json({
      status: true,
      message: "Admin created successfully",
      data: adminUser,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Cannot create Admin",
      error: error.message,
    });
  }
});
const createNewUser = asyncHandler(async (req, res) => {
  try {
    // Check if the user has admin role
    if (req?.user?.roles.includes("admin")) {
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
        !address ||
        !req.file
      ) {
        return res.status(400).json({
          status: false,
          message: "All fields are required",
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
        avatar: req.file.path, // Access req.file after Multer middleware
      });

      // Save the user to the database
      const result = await user.save();

      return res.status(201).json({
        status: true,
        message: "User created successfully",
        data: result,
      });
    } else {
      return res.status(403).json({
        status: false,
        message: "Unauthorized, Admin access required",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error in creating user",
      error: error.message,
    });
  }
});

const deactivateUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await Users.findById(userId);
    if (!user) {
      res.status(404).json({
        status: false,
        message: "No USer found with this id ",
      });
    }
    user.status = "deactivated";
    await user.save();
    res.status(201).json({
      status: true,
      message: "User Is Deactivated",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error in account deactivation",
      error: error.message,
    });
  }
});
const activateUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await Users.findById(userId);
    if (!user) {
      res.status(404).json({
        status: false,
        message: "No USer found with this id ",
      });
    }
    user.status = "activated";
    await user.save();
    res.status(201).json({
      status: true,
      message: "User Is activated",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error in account activation",
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
  addAdmin,
  activateUser,
  deactivateUser,
  deleteUser,
  updateUser,
  createNewUser,
};
