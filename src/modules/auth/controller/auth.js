import { StatusCodes } from "http-status-codes";
import userModel from "../../../../DB/models/User.model.js";
import { asyncHandler } from "../../utilities/errorHandling.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Cryptr from "cryptr";
const cryptr = new Cryptr("trelloAppbyEslamMohamed456");

export const signUp = asyncHandler(async (req, res, next) => {
  const { userName, email, password, cPassword, phone, gender, age } = req.body;
  console.log({ userName, email, password, cPassword, phone, gender, age });

  if (password !== cPassword) {
    return next(new Error("password mis-matches cPassowrd"), {
      cause: StatusCodes.FORBIDDEN,
    });
  }

  const checkUser = await userModel.findOne({
    $or: [{ userName }, { email }, { password }],
  });
  console.log(checkUser);

  if (checkUser) {
    return next(new Error("User Already Exists"), {
      cause: StatusCodes.CONFLICT,
    });
  }

  const hashPassword = bcrypt.hashSync(password, 8);

  // const encryptedPhone = cryptr.encrypt(phone);

  const user = await userModel.create({
    userName,
    email,
    password: hashPassword,
    phone,
    gender,
    age,
  });

  return res
    .status(StatusCodes.CREATED)
    .json({ message: "User Added Successfully", user });
});

export const logIn = asyncHandler(async (req, res, next) => {
  const { searchKey, password } = req.body;
  console.log({ searchKey, password });

  // const encryptedString = cryptr.encrypt(searchKey)
  // console.log({encryptedString: encryptedString});

  const checkUser = await userModel.findOne({
    $or: [{ userName: searchKey }, { email: searchKey }, { phone: searchKey }],
  });

  if (!checkUser) {
    return next(new Error("Invalid-Login-Data"), {
      cause: StatusCodes.NOT_FOUND,
    });
  }

  const match = bcrypt.compareSync(password, checkUser.password);

  if (!match) {
    return next(new Error("Invalid-Login-Data"), {
      cause: StatusCodes.UNAUTHORIZED,
    });
  }

  await userModel.findByIdAndUpdate(
    { _id: checkUser._id },
    { isOnline: "true", isDeleted: "false" }
  );

  const token = jwt.sign(
    { userName: checkUser.userName, id: checkUser._id, isOnline: true },
    "trelloAppbyEslamMohamed456"
  );

  return res.json({ message: "LoggedIn Successfully", token });
});

export const changePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword, cPassword } = req.body;
  console.log({ oldPassword, newPassword, cPassword });

  if (newPassword !== cPassword) {
    return next(
      new Error("newPassword miss matches cPassword", {
        cause: StatusCodes.BAD_REQUEST,
      })
    );
  }

  const match = bcrypt.compareSync(oldPassword, req.user.password);

  if (!match) {
    return next(new Error("Old password miss matches your password"));
  }

  const hashPassword = bcrypt.hashSync(newPassword, 8);

  await userModel.findByIdAndUpdate(
    { _id: req.user.id },
    { password: hashPassword }
  );

  return res.json({ message: "Password Changed Successfully" });
});

export const logOut = asyncHandler(async (req, res, next) => {
  if (req.user.isOnline === "false") {
    return next(new Error("User Already Logged Out"));
  }

  await userModel.findByIdAndUpdate(
    { _id: req.user.id },
    { isOnline: "false" }
  );

  return res.json({ message: "User Loged Out Successfully" });
});
