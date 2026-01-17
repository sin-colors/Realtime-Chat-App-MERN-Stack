import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import connectToMongoDB from "./db/connectToMongoDB";

const app = express();
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api/auth", authRoutes);
dotenv.config();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server Running on port ${PORT}`);
});
