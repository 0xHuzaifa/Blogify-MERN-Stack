const isAdmin = async (req, res, next) => {
  try {
    const checkAdminRole = await req.userInfo;
    // console.log(checkAdminRole.payload.role);
    if (checkAdminRole.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: `You are unauthorized to access this page.`,
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Something went wrong please try again`,
    });
  }
};

export default isAdmin;
