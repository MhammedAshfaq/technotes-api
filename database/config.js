import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGOURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Data Base Connected`.bgCyan.black.bold);
  } catch (error) {
    console.log(`Database connection error ${error.message}`.bgRed.white.bold);
  }
};

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGOURL, {
//       useNewUrlParser: true, // Optional, as this is no longer required
//       useUnifiedTopology: true, // Optional, as this is no longer required
//     });
//     console.log("Connected to the database".green.bold);
//   } catch (err) {
//     console.error("Database connection error".red.bold, err);
//     process.exit(1); // Exit process with failure
//   }
// };

// export default connectDB;
