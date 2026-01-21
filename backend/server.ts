import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import connectToMongoDB from "./db/connectToMongoDB";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/api/auth", authRoutes);

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server Running on port ${PORT}`);
});
