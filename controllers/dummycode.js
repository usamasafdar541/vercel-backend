const addAdmin = asyncHandler(async (req, res) => {
  try {
    const adminUser = await new Users({
      email: "Admin@gmail.com",
      name: "Admin",
      password: "Admin12345",
      roles: ["admin"],
    });
    await adminUser.save(); // Use await to make sure the save operation is completed before responding
    res.status(200).json({
      status: true,
      message: "Admin created Successfully",
      data: adminUser,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Cannot Create Admin",
      error: error.message,
    });
  }
});

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

    console.log("Password received in request:", password);
    console.log("Password from user document:", user.password);

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
        roles: user.roles,
      },
    };

    const isAdmin = user.roles.includes("admin"); // Adjusted for better handling of multiple roles
    const token = jwt.sign(tokenPayload, jwtSecret, {
      expiresIn: "1h",
    });

    const responseData = {
      status: true,
      message: "Logged In Successfully",
      payload: {
        ...tokenPayload,
        isAdmin: isAdmin,
      },
      token: token,
    };

    return res.status(200).json(responseData);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error in Login",
      error: error.message,
    });
  }
});