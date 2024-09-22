const { Router } = require("express");

const courseRouter = Router();

courseRouter.post("/purchase", (req, res) => {
	res.json({
		message: "course purchased",
	});
});

courseRouter.get("/courses", (req, res) => {
	res.json({
		message: "courses",
	});
});

module.exports = {
	courseRouter: courseRouter,
};
