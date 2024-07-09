import bcryptjs from "bcryptjs";

export const failureResponseWithError = (res, status, message) => {
  return res.status(status).json({
    statusCode: status || 500,
    success: false,
    error: message.replace(/"/g, "") || "Somthing went wrong",
  });
};

export const successResponseWithData = (res, status, message, data) => {
  return res.status(status).json({
    statusCode: status || 200,
    success: true,
    message: message || "Data retrieved successfully",
    data: data,
  });
};

export const successResponse = (res, status, message) => {
  return res.status(status).json({
    statusCode: status || 200,
    success: true,
    message: message || "Data retrieved successfully",
  });
};

//PASSWORD HASHING
export const hashConvertPassword = async (password) => {
  const salt = bcryptjs.genSaltSync(10);
  const hashPassword = await bcryptjs.hash(password, salt);
  return hashPassword;
};

export const convertPassword = async (newPassword, password) => {
  try {
    return await bcryptjs.compare(newPassword, password);
  } catch (error) {
    console.log("HASHING PASSWORD ERROR: ", error);
    return false;
  }
};
