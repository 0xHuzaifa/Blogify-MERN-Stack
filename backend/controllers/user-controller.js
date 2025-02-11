import User from "../models/User.js";

export const userProfile = async (req, res) => {
  try {
    const user = req.userInfo;
    if (!user) {
      return res.json({
        success: false,
        message: "No user found",
      });
    }
    const profile = await User.findById(req.userInfo.id).select("-password");
    if (!profile) {
      return res.json({
        success: false,
        message: "User not exist with this id",
      });
    }
    delete profile.password;
    res.status(200).json({
      success: true,
      user: profile,
    });
  } catch (error) {
    console.error(`Error Message`, error.message);

    res.status(500).json({
      success: false,
      message: `Something went wrong please try again`,
    });
  }
};
