import mongoose from "mongoose";

export const connectDB = async (URL: string) => {
  try {
    await mongoose.connect(URL);
    return;
  } catch (error) {
    console.log("DB ERROR", error);
  }
};
