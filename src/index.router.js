import authRouter from "./modules/auth/auth.router.js";
import userRouter from "./modules/users/user.router.js";
import taskRouter from "./modules/tasks/task.router.js";
import connectDB from "./../DB/connection.js";
import { globalErrorHandling } from "./modules/utilities/errorHandling.js";

const bootstrap = (app, express) => {
  app.use(express.json());

  app.use("/auth", authRouter);

  app.use("/user", userRouter);

  app.use("/task", taskRouter);

  app.use("*", (req, res, next) => {
    return res.json({ message: "Invalid Routing" });
  });

  app.use(globalErrorHandling);

  connectDB();
};

export default bootstrap;
