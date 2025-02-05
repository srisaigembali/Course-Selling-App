const { Router } = require("express");
const adminModel = require("../models/adminModel");
const courseModel = require("../models/courseModel");
const zod = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const adminMiddleware = require("../middlewares/adminMiddleware");

const adminRouter = Router();
const AdminSchema = zod.object({
	email: zod.string().email({ message: "Invalid email address" }),
	password: zod.string().min(8, {
		message: "Password must be 8 or more characters long",
	}),
	firstName: zod.string().min(1, { message: "First name is required" }),
	lastName: zod.string().min(1, { message: "Last name is required" }),
});

adminRouter.post("/signup", async (req, res) => {
	try {
		const admin = req.body;

		AdminSchema.parse(admin);
		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(admin.password, saltRounds);

		await adminModel.create({
			email: admin.email,
			password: hashedPassword,
			firstName: admin.firstName,
			lastName: admin.lastName,
		});

		res.status(200).json({
			message: "Admin signup successful",
		});
	} catch (error) {
		res.status(500).json({
			message: "Error while signing up...",
			error,
		});
	}
});

adminRouter.post("/signin", async (req, res) => {
	try {
		const { email, password } = req.body;

		const admin = await adminModel.findOne({ email });
		if (!admin) {
			return res.status(404).json({
				message: "Admin does not exists",
			});
		}

		const matchPassword = await bcrypt.compare(password, admin.password);
		if (!matchPassword) {
			return res.status(200).json({
				message: "Invalid password",
			});
		}
		const token = jwt.sign(
			{
				id: admin._id,
			},
			process.env.JWT_ADMIN_PASSWORD
		);

		res.status(200).json({
			message: "signin successful",
			token: "Bearer " + token,
		});
	} catch (error) {
		res.status(500).json({
			message: "Error while signing in...",
			error,
		});
	}
});

adminRouter.post("/course", adminMiddleware, async (req, res) => {
	try {
		const adminId = req.adminId;
		const { title, description, imageUrl, price } = req.body;

		// creating web3 saas for image upload in 6 hours harkirat video
		const course = await courseModel.create({
			title,
			description,
			imageUrl,
			price,
			creatorId: adminId,
		});
		res.status(200).json({
			message: "Course created successfully",
			courseId: course._id,
		});
	} catch (error) {
		res.status(500).json({
			message: "Error while creating course...",
			error,
		});
	}
});

adminRouter.put("/course", adminMiddleware, async (req, res) => {
	try {
		const adminId = req.adminId;
		const { title, description, imageUrl, price, courseId } = req.body;

		await courseModel.updateOne(
			{ _id: courseId, creatorId: adminId },
			{
				title,
				description,
				imageUrl,
				price,
			}
		);
		res.status(200).json({
			message: "Course updated successfully",
		});
	} catch (error) {
		res.status(500).json({
			message: "Error while updating course...",
			error,
		});
	}
});

adminRouter.get("/courses", adminMiddleware, async (req, res) => {
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
	adminRouter: adminRouter,
};
