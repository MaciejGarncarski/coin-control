import { Router } from "express";

import { authRoutes } from "./auth/auth.route.js";

export const router = () => {
	const app = Router();

	authRoutes(app);

	return app;
};
