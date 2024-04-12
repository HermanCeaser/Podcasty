import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      return true;
    }
    if (process.env.NODE_ENV === "production" && process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("Connected to MongoDB");
      return true;
    } else {
      await mongoose.connect("mongodb://127.0.0.1:27017/podcasty");
      console.log("Connected to MongoDB");
      return true;
    }
  } catch (err) {
    console.log(err);
  }
};

export default connectDB;
