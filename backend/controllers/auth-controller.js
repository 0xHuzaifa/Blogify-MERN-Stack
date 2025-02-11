import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerController = async (req, res) => {
  const { username, email, password, phone, dob, gender, role } = req.body;

  try {
    const checkUserExist = await User.findOne({
      $or: [{ username: username }, { email: email }],
    });

    if (checkUserExist) {
      return res.status(409).json({
        success: false,
        message: `User Already Exist`,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      email,
      password: hashPassword,
      phone,
      dob,
      gender,
      role: role || "user",
    });

    if (newUser) {
      res.status(201).json({
        success: true,
        message: "User Register Successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Unable to register user! please try again.",
      });
    }
  } catch (error) {
    console.error(`Error Message`, error.message);

    res.status(500).json({
      success: false,
      message: `Something went wrong please try again`,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    // find user by email
    const user = await User.findOne({ email });

    // check if the user exist
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User doesn't exist",
      });
    }

    // check if the password is correct or not
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Password is incorrect!",
      });
    }

    // console.log(user);

    const accessToken = jwt.sign(
      { id: user._id, role: user.role, username: user.username },
      process.env.JWT_PRIVATE_KEY,
      {
        expiresIn: "30m",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login Successfully",
      token: accessToken,
    });
  } catch (error) {
    console.error(`Error Message`, error.message);

    res.status(500).json({
      success: false,
      message: `Something went wrong please try again`,
    });
  }
};
