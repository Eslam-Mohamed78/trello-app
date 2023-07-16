import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../modules/utilities/errorHandling.js";
import jwt from "jsonwebtoken";
import userModel from "../../DB/models/User.model.js";

export const authentication = asyncHandler(async (req, res, next) => {
  const { token } = req.headers;
  console.log({ token: token });

  if (!token) {
    return next(
      new Error("user token is required", { cause: StatusCodes.UNAUTHORIZED })
    );
  }

  const decodedToken = jwt.verify(token, "trelloAppbyEslamMohamed456");

  if (!decodedToken?.id) {
    return next(
      new Error("Invalid token payload", { cause: StatusCodes.BAD_REQUEST })
    );
  }

  const user = await userModel.findById(decodedToken.id);

  if (!user) {
    return next(
      new Error("Not registered account", { cause: StatusCodes.NOT_FOUND })
    );
  }

  console.log(user);
  
  if (user.isDeleted === "true") {
    return next(new Error("User is soft deleted login to reUse the account"));
  }

  req.user = user;

  return next();
});
