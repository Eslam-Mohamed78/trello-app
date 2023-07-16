import { Router } from "express";
import * as authController from "./controller/auth.js";
import { authentication } from "../../middleware/authentication.js";

const router = Router();

router.post("/signUp", authController.signUp);

router.post("/logIn", authController.logIn);

router.patch("/changePassword",authentication , authController.changePassword);

router.patch("/logOut",authentication , authController.logOut);

export default router;
