import express from "express";
import dotenv from "dotenv";

const app = express();
app.get("/", (req, res) => {
  res.send("Hello World!");
});
dotenv.config();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server Running on port ${PORT}`));
