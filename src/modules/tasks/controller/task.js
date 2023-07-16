import { StatusCodes } from "http-status-codes";
import userModel from "../../../../DB/models/User.model.js";
import { asyncHandler } from "../../utilities/errorHandling.js";
import taskModel from "../../../../DB/models/Task.model.js";

export const addTask = asyncHandler(async (req, res, next) => {
  const { title, description, deadline, assignTo } = req.body;
  console.log({ title, description, deadline, assignTo });

  const currentDate = new Date();
  const deadlineDate = new Date(deadline);

  if (deadlineDate < currentDate) {
    return next(
      new Error("Enter a Valid Date", { cause: StatusCodes.BAD_REQUEST })
    );
  }

  const employee = await userModel.findById(assignTo);

  if (!employee) {
    return next(new Error("The employee doesn't exists", { cause: 404 }));
  }

  const task = await taskModel.create({
    title,
    description,
    deadline,
    assignTo,
    user_id: req.user.id,
  });

  return res.json({ message: "Task Assigned Successfully", task });
});

export const getAllTasks = asyncHandler(async (req, res, next) => {
  const tasks = await taskModel.find().populate({
    path: "user_id assignTo",
    select: "userName email",
  });

  return res.json({ message: "All tasks", tasks });
});

export const getAllCreatedTasks = asyncHandler(async (req, res, next) => {
  const tasks = await taskModel.find({ user_id: req.user.id }).populate({
    path: "user_id assignTo",
    select: "userName email",
  });

  return res.json({ message: "All created tasks", tasks });
});

export const getAllAssignTasks = asyncHandler(async (req, res, next) => {
  const tasks = await taskModel.find({ assignTo: req.user.id }).populate({
    path: "user_id assignTo",
    select: "userName email",
  });

  return res.json({ message: "All assigned tasks to you", tasks });
});

export const allLateTasks = asyncHandler(async (req, res, next) => {
  const currentDate = new Date();

  const allTasks = await taskModel.find({ assignTo: req.user._id }).populate({
    path: "user_id assignTo",
    select: "userName email",
  });

  if (!addTask) {
    return next(
      new Error("There is no assigned tasks to this user", {
        cause: StatusCodes.NOT_FOUND,
      })
    );
  }

  const lateTasks = allTasks.filter((task) => {
    return new Date(task.deadline) < currentDate;
  });

  console.log(lateTasks);

  return res.json({ message: "All Late assigned tasks to you", lateTasks });
});

export const getTasksAssignToAnyUser = asyncHandler(async (req, res, next) => {
  const { assignTo } = req.params;
  console.log({ assignTo });

  const employee = await userModel.findById(assignTo);

  if (!employee) {
    console.log("false");
    return next(
      new Error("Employee Not Found", { cause: StatusCodes.NOT_FOUND })
    );
  }

  const tasks = await taskModel.find({ assignTo }).populate({
    path: "user_id assignTo",
    select: "userName email",
  });

  if (!tasks.length) {
    return next(
      new Error("There is no assigned tasks to this employee", {
        cause: StatusCodes.NOT_FOUND,
      })
    );
  }

  return res.json({
    message: `All assigned tasks to ${tasks[0]?.assignTo?.userName}`,
    tasks,
  });
});

export const updateTask = asyncHandler(async (req, res, next) => {
  const { title, description, deadline, status, assignTo } = req.body;
  const { taskId } = req.params;
  console.log({ title, description, deadline, status, assignTo, taskId });

  const currentDate = new Date();
  const deadlineDate = new Date(deadline);

  if (deadlineDate < currentDate) {
    return next(
      new Error("Enter a Valid Date", { cause: StatusCodes.BAD_REQUEST })
    );
  }

  const task = await taskModel.findById(taskId);

  if (!task) {
    return next(new Error("Task Not Found", { cause: StatusCodes.NOT_FOUND }));
  }

  if (task.user_id.toString() !== req.user._id.toString()) {
    return next(
      new Error("You are not allowed to Update this task", {
        cause: StatusCodes.NOT_ACCEPTABLE,
      })
    );
  }

  const employee = await userModel.findById(assignTo);

  if (!employee) {
    return next(
      new Error("The user you want to assingn this task to not exists", {
        cause: StatusCodes.NOT_FOUND,
      })
    );
  }

  await taskModel.findByIdAndUpdate({ _id: taskId }, req.body);

  return res
    .status(StatusCodes.ACCEPTED)
    .json({ message: "Task Updated Successfully" });
});

export const deleteTask = asyncHandler(async (req, res, next) => {
  const { taskId } = req.params;
  console.log({ taskId });

  const task = await taskModel.findById(taskId);

  if (!task) {
    return next(new Error("Task Not Found", { cause: StatusCodes.NOT_FOUND }));
  }

  if (task.user_id.toString() !== req.user._id.toString()) {
    return next(
      new Error("You are not allowed to delete this task", {
        cause: StatusCodes.NOT_ACCEPTABLE,
      })
    );
  }

  await taskModel.findByIdAndDelete(taskId);

  return res
    .status(StatusCodes.ACCEPTED)
    .json({ message: "Task Deleted Successfully" });
});
