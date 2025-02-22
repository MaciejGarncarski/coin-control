import { styleText } from "node:util";

import { env } from "@config/env.js";
import { httpLogger } from "@logger/logger.js";
import express from "express";

const app = express();

app.use(httpLogger);

app.route("/").get((req, res) => {
	res.send(`elo elo 320`);
});

app.listen(Number(env.PORT), env.HOST, (error) => {
	if (error) {
		httpLogger.logger.error("API server failed to start");
		throw new Error("API server failed to start");
	}

	const hashes = styleText("greenBright", "########################################");
	const message = styleText(
		"greenBright",
		` Server running on ${styleText(["bgWhite", "black"], `http://${env.HOST}:${env.PORT}`)}`,
	);

	console.log(hashes);
	console.log(message);
	console.log(hashes);
	console.log("\n");
});
