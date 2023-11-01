const express = require("express");
const mongoose = require("mongoose");
// const Users = require("../modles/userModel");
const Checks = require("../modles/checkInOutModel");
const asyncHandler = require("express-async-handler");

const checkInUser = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.body;
    console.log(userId, "user id provided ");

    const currentDate = new Date().toISOString().split("T")[0];

    // Check if the user has already checked in today
    const existingCheckIn = await Checks.findOne({
      userId,
      checkOutTime: null,
      checkInTime: { $gte: new Date(currentDate) },
    });

    if (existingCheckIn) {
      console.log("User has already checked in today:", existingCheckIn);
      return res.status(200).json({
        status: false,
        message: "User has already checked in today",
      });
    }

    // Find an existing check-in record for the user
    let checkIn = await Checks.findOne({
      userId,
      checkInTime: { $gte: new Date(currentDate) },
    });

    if (!checkIn) {
      // If no existing check-in record, create a new one
      checkIn = new Checks({ userId, checkInTime: new Date() });
      console.log("User is checked in:", checkIn);
      await checkIn.save();
      return res.status(200).json({
        status: true,
        message: "Successfully Checked In",
        data: checkIn,
      });
    }
    // } else {
    //   console.log("User is already checked in:", checkIn);
    //   return res.status(200).json({
    //     status: false,
    //     message: "User is already checked in",
    //     data: checkIn,
    //   });
    // }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error in Checking In",
      error: error.message,
    });
  }
});

const checkOutuser = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.body;

    // Validate userId format
    // if (!mongoose.Types.ObjectId.isValid(userId)) {
    //   return res.status(400).json({
    //     status: false,
    //     message: "Invalid userId format",
    //   });
    // }
    const currentDate = new Date().toISOString().split("T")[0];
    const checkOutTime = new Date();
    const existingCheckOut = await Checks.findOne({
      userId,
      checkOutTime: { $gte: new Date(currentDate) },
    });

    if (existingCheckOut) {
      return res.status(200).json({
        status: false,
        message: "User has already checked out today",
      });
    }
    const checkOut = await Checks.findOne({ userId, checkOutTime: null });
    console.log("checkout User details", checkOut);

    if (!checkOut) {
      return res.status(400).json({
        status: false,
        message: "User Has Not Checked In",
      });
    }

    checkOut.checkOutTime = checkOutTime;
    await checkOut.save();

    return res.status(200).json({
      status: true,
      message: "Successfully Checked Out",
      data: checkOut,
      id: checkOut.id,
    });
  } catch (error) {
    console.error("Error in Checking Out:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

const timeLogged = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(userId, "Fetched User ID ");
    const userRecords = await Checks.find({ userId });

    if (!userRecords || userRecords.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No time logged for user ",
      });
    }
    const totalTimeLogged = userRecords.reduce((total, record) => {
      const checkOutTime = record.checkOutTime || new Date();
      const timeDifference = checkOutTime - record.checkInTime;
      return total + timeDifference;
    }, 0);
    const hours = Math.floor(totalTimeLogged / 360000);
    const minutes = Math.floor((totalTimeLogged % 360000) / 60000);
    return res.status(200).json({
      status: true,
      message: `${hours} Hours and ${minutes} minutes logged for this ${userId}`,
      data: userRecords,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

module.exports = {
  checkInUser,
  checkOutuser,
  timeLogged,
};
