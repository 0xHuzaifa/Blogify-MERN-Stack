import jwt from "jsonwebtoken";

const isLogin = async (req, res, next) => {
  const headerToken = req.headers["authorization"];
  const token = headerToken && headerToken.split(" ")[1];
  // console.log(token);
  if (!token) {
    return res.status(401).json({
      success: false,
      message: `You are not loggedIn. Please Login First`,
    });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    // console.log("decode token info", decode);

    req.userInfo = decode;
    next();
  } catch (error) {
    console.error(`Error Message`, error.message);

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid or Expired. Please login again.",
      });
    }

    return res.status(500).json({
      success: false,
      message: `Something went wrong please try again`,
    });
  }
};

export default isLogin;
