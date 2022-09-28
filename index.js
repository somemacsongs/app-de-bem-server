import express from "express";
import * as dotenv from "dotenv";
import { connect } from "./config/db.config.js";
import { userRouter } from "./routes/user.routes.js";
import cors from "cors";

dotenv.config();
connect();

const app = express();

app.use(cors());
app.use(express.json());

const API_VERSION = "1.0";

app.use(`/api/${API_VERSION}/user`, userRouter);

app.listen(Number(process.env.PORT), () => {
  console.log(`Server up and running at port ${process.env.PORT}`);
});
