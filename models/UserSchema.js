import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String },
  photo: { type: String },
  role: {
    type: String,
    enum: ["patient", "admin"],
    default: "patient",
  },
  status: { type: Number, enum: [0, 1], default: 1 },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  bloodType: { type: String },
  appointments: [{ type: mongoose.Types.ObjectId, ref: "Appointment" }],
});

// UserSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     return next();
//   }

//   try {
//     const hashPasswoed = await bcryptjs.hash(this.password, 10);
//     this.password = hashPasswoed;
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// Compare Password
// UserSchema.methods.comparePassword = async function (password) {
//   try {
//     return await bcryptjs.compareSync(password, this.password);
//   } catch (error) {
//     return false;
//   }
// };

export default mongoose.model("User", UserSchema);
