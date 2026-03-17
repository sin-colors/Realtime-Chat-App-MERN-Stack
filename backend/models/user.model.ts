import mongoose, { Document, InferSchemaType } from "mongoose";

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

// type UserSchemaType = InferSchemaType<typeof userSchema>;

// export interface UserDocument extends Document, Omit<UserSchemaType, "_id"> {
//   _id: mongoose.Types.ObjectId;
// }

export type UserType = InferSchemaType<typeof userSchema> & {
  _id: mongoose.Types.ObjectId;
};

const User = mongoose.model("User", userSchema);
// const User = mongoose.model<UserDocument>("User", userSchema);

export default User;
