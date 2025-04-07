import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${process.env.DB_NAMES}`
    );
    console.log(
      `\nApp is listening on port ${process.env.PORT} ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB connection error ", error);
    process.exit(1);
  }
};

// Function to get admin data after the promise resolves
export { connectDB };
