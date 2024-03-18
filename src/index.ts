import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database-config";
import errorHandlerMiddleware from "./utills/error/error.middleware";
import requestMappings from "./map";

const app: Express = express();

dotenv.config();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE"], // Include the PATCH method here
    optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
  })
);

requestMappings(app);
app.use(errorHandlerMiddleware);

const start = async () => {
  const port = process.env.PORT || 5000;
  try {
    app.listen(port, () => {
      console.log(`SERVER IS LISTENING ON PORT ${port}..!`);
      connectDB();
    });
  } catch (e) {
    console.log(e);
  }
};

start();
