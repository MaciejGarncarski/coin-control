import { Router } from "express";

import { authRoutes } from "./auth/auth.route.js";

export const router = () => {
	const app = Router();
	app.get("/", (req, res) => {
		throw new Error("test");
	});

	authRoutes(app);

	return app;
};
