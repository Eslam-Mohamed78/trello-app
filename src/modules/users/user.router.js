import { Router } from "express";
import * as userController from "./controller/user.js";

const router = Router();

router.put('/update', userController.update)

router.delete('/delete', userController.deleteUser)

router.patch('/softDelete', userController.softDelete)

export default router;
