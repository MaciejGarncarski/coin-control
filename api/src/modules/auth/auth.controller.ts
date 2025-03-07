import type { RequestHandler } from "express";

export const postLoginHandler: RequestHandler = (req, res) => {
	res.status(200).json({
		siemano: "ko2lanooo",
	});
};
