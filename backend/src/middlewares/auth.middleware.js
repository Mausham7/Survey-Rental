import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    // console.log(token);
    if (!token) {
      console.log("Unauthorized to access");
      throw new ApiError(401, "Unauthorized to access");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decodedToken);
    const user = await User.findById(decodedToken?.id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    // console.log("yeh! boy");

    next();
  } catch (error) {
    throw new ApiError(401, error.message || "Invalid Access Token");
  }
});
