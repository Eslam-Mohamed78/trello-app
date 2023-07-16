import mongoose from "mongoose";

const connectDB = async () => {
  return await mongoose
    .connect(
      `mongodb://127.0.0.1:27017/trello-app`
      // {serverSelectionTimeoutMS: 5000}
    )
    .then((result) => {
      console.log(`Connected to DB....`);
      //   console.log(result);
    })
    .catch((err) => {
      console.log(`Fail to connect DB....${err}`);
    });
};

export default connectDB