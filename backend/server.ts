import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import messageRoutes from "./routes/message.routes";
import userRoutes from "./routes/user.routes";
import connectToMongoDB from "./db/connectToMongoDB";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server Running on port ${PORT}`);
});
