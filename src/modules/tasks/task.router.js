import { Router } from "express";
import * as taskController from "./controller/task.js";
import { authentication } from "../../middleware/authentication.js";

const router = Router();

router.post("/addTask", authentication, taskController.addTask);

router.get("/getAllTasks", taskController.getAllTasks);

router.get(
  "/getAllCreatedTasks",
  authentication,
  taskController.getAllCreatedTasks
);

router.get(
  "/getAllAssignTasks",
  authentication,
  taskController.getAllAssignTasks
);

router.get("/allLateTasks", authentication, taskController.allLateTasks);

router.get(
  "/getTasksAssignToAnyUser/:assignTo",
  authentication,
  taskController.getTasksAssignToAnyUser
);

router.put("/updateTask/:taskId", authentication, taskController.updateTask);

router.delete("/deleteTask/:taskId", authentication, taskController.deleteTask);

export default router;
