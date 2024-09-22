const { Router } = require("express");
const adminModel = require("../models/adminModel");

const adminRouter = Router();

adminRouter.post("/signup", (req, res) => {
	res.json({
		message: "signup",
	});
});

adminRouter.post("/signin", (req, res) => {
	res.json({
		message: "signin",
	});
});

adminRouter.post("/course", (req, res) => {
	res.json({
		message: "create course",
	});
});

adminRouter.put("/course", (req, res) => {
	res.json({
		message: "update course",
	});
});

adminRouter.get("/courses", (req, res) => {
	res.json({
		message: "courses",
	});
});

module.exports = {
	adminRouter: adminRouter,
};
