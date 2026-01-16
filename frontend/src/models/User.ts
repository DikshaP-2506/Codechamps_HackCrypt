import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: "patient" | "doctor" | "admin" | "caretaker" | "lab_reporter" | "nurse";
  dateOfBirth?: Date;
  gender?: "male" | "female" | "other";
  photoUrl?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    firstName: String,
    lastName: String,
    phone: {
      type: String,
      sparse: true,
    },
    role: {
      type: String,
      enum: ["patient", "doctor", "admin", "caretaker", "lab_reporter", "nurse"],
      default: "patient",
      required: true,
    },
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    photoUrl: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: Date,
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation during hot-reload in development
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
