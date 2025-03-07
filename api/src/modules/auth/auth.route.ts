import { Router } from "express";

import { postLoginHandler } from "./auth.controller.js";

const route = Router();

export const authRoutes = (app: Router) => {
	app.use("/auth", route);
	route.post("/login", postLoginHandler);
};
