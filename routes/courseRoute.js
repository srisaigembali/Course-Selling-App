const { Router } = require("express");
const userMiddleware = require("../middlewares/userMiddleware");
const purchaseModel = require("../models/purchaseModel");
const courseModel = require("../models/courseModel");

const courseRouter = Router();

courseRouter.post("/purchase", userMiddleware, async (req, res) => {
	try {
		const userId = req.userId;
		const { courseId } = req.body;

		// expect user to pay for the course

		const purchasedCourse = await purchaseModel.findOne({
			userId: userId,
			courseId: courseId,
		});

		if (purchasedCourse) {
			return res.json({
				message: "Course already purchased by the user",
			});
		}

		await purchaseModel.create({
			courseId,
			userId,
		});
		res.status(200).json({
			message: "Course purchased successfully",
		});
	} catch (error) {
		res.status(500).json({
			message: "Error while purchase course...",
			error: error.message,
		});
	}
});

courseRouter.get("/preview", async (req, res) => {
	try {
		const courses = await courseModel.find();
		res.status(200).json({
			courses,
		});
	} catch (error) {
		res.status(500).json({
			message: "Error while getting courses...",
			error,
		});
	}
});

module.exports = {
	courseRouter: courseRouter,
};
