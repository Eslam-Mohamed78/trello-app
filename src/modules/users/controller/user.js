import jwt from "jsonwebtoken";
import { asyncHandler } from "./../../utilities/errorHandling.js";
import userModel from "../../../../DB/models/User.model.js";
import { StatusCodes } from "http-status-codes";

export const update = asyncHandler(async (req, res, next) => {
  const { token } = req.headers;
  const { userName, age, phone } = req.body;
  console.log({ token, userName, age, phone });

  const decodedToken = jwt.decode(token);
  console.log({ decodedToken: decodedToken });

  if (!decodedToken) {
    return next(new Error("Invalid Token", { cause: StatusCodes.BAD_REQUEST }));
  }

  const checkUser = await userModel.findById(decodedToken.id);
  if (!checkUser) {
    return next(new Error("User Not Exists"));
  }

  if (checkUser.isOnline === "false") {
    return next(new Error("User must be logged in first"));
  }

  if (checkUser.isDeleted === "true") {
    return next(
      new Error("User is soft deleted login again to reUse the account")
    );
  }

  const user = await userModel.findByIdAndUpdate(
    { _id: decodedToken.id },
    req.body
  );

  return res.json({ message: "User Data Updated Successfully", user });
});

export const deleteUser = asyncHandler(async (req, res, next) => {
  const { token } = req.headers;
  console.log(token);

  const decodedToken = jwt.decode(token);
  console.log({ decodedToken: decodedToken });

  if (!decodedToken) {
    return next(new Error("Invalid Token", { cause: StatusCodes.BAD_REQUEST }));
  }

  const checkUser = await userModel.findById(decodedToken.id);
  if (!checkUser) {
    return next(new Error("User Not Exists"));
  }

  if (checkUser.isOnline === "false") {
    return next(new Error("User must be logged in first"));
  }

  if (checkUser.isDeleted === "true") {
    return next(new Error("User is soft deleted login to reUse the account"));
  }

  const user = await userModel.deleteOne({ _id: decodedToken.id });

  return res.json({ message: "User Deleted Successfully", user });
});

export const softDelete = asyncHandler(async (req, res, next) => {
  const { token } = req.headers;
  console.log(token);

  const decodedToken = jwt.decode(token);
  console.log({ decodedToken: decodedToken });

  if (!decodedToken) {
    return next(new Error("Invalid Token", { cause: StatusCodes.BAD_REQUEST }));
  }

  const checkUser = await userModel.findById(decodedToken.id);
  if (!checkUser) {
    return next(new Error("User Not Exists"));
  }

  if (checkUser.isOnline === "false") {
    return next(new Error("User must be logged in first"));
  }

  if (checkUser.isDeleted === "true") {
    return next(new Error("User Already soft deleted"));
  }

  await userModel.findByIdAndUpdate(
    { _id: decodedToken.id },
    { isDeleted: "true" }
  );

  return res.json({ message: "User Soft Deleted Successfuly" });
});
