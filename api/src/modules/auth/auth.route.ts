import { Router } from "express";

const route = Router();

export const authRoutes = (app: Router) => {
	app.use("/auth", route);

	route.get("/login", (req, res) => {
		res.send("Login");
	});
};
