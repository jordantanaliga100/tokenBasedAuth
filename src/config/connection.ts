import mongoose from "mongoose";

export const connectDB = async (connectionString: any) => {
  try {
    if (!connectionString) {
      throw new Error("MONGO_URL is undefined. Check your .env file.");
    }

    mongoose.set("strictQuery", true);
    await mongoose.connect(connectionString as string);
  } catch (error) {
    console.log("DB ERROR", error);
  }
};
