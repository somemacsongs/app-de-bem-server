import express from "express";
import * as dotenv from "dotenv";
import { connect } from "./config/db.config.js";
import { userRouter } from "./routes/user.routes.js";
import { commentRouter } from "./routes/comment.routes.js"
import {communityRouter} from "./routes/community.routes.js"
import { feedRouter } from "./routes/feed.routes.js";
import { moodRouter } from "./routes/mood.routes.js";
import { replyRouter } from "./routes/reply.routes.js";

import cors from "cors";

dotenv.config();
connect();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/app-de-bem/users", userRouter);
app.use("/app-de-bem/comments", commentRouter);
app.use("/app-de-bem/communities", communityRouter);
app.use("/app-de-bem/feeds", feedRouter);
app.use("/app-de-bem/moods", moodRouter);
app.use("/app-de-bem/replies", replyRouter);

app.listen(Number(process.env.PORT), () => {
  console.log(`Server up and running at port ${process.env.PORT}`);
});
