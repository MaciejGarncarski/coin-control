import { environment } from "@config/consatnts.js";
import { env } from "@config/env.js";
import { logger } from "@logger/logger.js";
import express from "express";

const PORT = env.PORT;
const app = express();
app.use(logger);

app.route("/").get((req, res) => {
  req.log.info("Hello world");
  res.send("Hello world");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
