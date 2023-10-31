// forgotPassword
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

    // Generate a TOTP
    const totp = otpService.generateTotp();
    console.log(`TOTP for user ${email} :${totp}`);

    // Store the TOTP in the database
    await Users.findOneAndUpdate({ email }, { totp });

    // Send the TOTP to the user via email
    // ...

    return res.status(200).json({
      status: true,
      message: "Password Reset Request Successfull",
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "error In sending OTP",
      error: error.message,
    });
  }
});

// resetPassword
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

    // Get the TOTP from the database
    const user = await Users.findOne({ email });
    const totp = user.totp;

    // Check if the TOTP has expired
    const isTotpExpired = otpService.isTotpExpired(totp);
    if (isTotpExpired) {
      return res.status(400).json({
        status: false,
        message: "OTP has expired",
      });
    }

    // Check if the OTP is valid
    const isTotpValid = otpService.verifyTotp(totp, otp);
    if (!isTotpValid) {
      return res.status(400).json({
        status: false,
        message: "Invalid OTP",
      });
    }

    // Reset the user's password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await Users.findOneAndUpdate({ email }, { password: hashedNewPassword });

    // Delete the TOTP from the database
    await Users.findOneAndUpdate({ email }, { totp: null });

    return res.status(200).json({
      status: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "error in resetting",
      error: error.message,
    });
  }
});
