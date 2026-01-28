import mongoose, { InferSchemaType } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

export type UserType = InferSchemaType<typeof userSchema> & {
  _id: mongoose.Types.ObjectId;
};

const User = mongoose.model("User", userSchema);

export default User;
