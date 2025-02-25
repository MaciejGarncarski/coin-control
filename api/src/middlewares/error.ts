import type { NextFunction, Request, Response } from "express";

import { isProd } from "../config/consatnts.js";

export function errorMiddleware(error: Error, _req: Request, res: Response, next: NextFunction) {
	const errorMessage = error.message || "Internal server error";

	if (isProd) {
		res.status(500).json({
			status: "Error",
			message: errorMessage,
		});
	}

	res.status(500).json({
		status: "Error",
		message: errorMessage,
		stack: error.stack,
	});

	next();
}
