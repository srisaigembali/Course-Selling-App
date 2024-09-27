const { Router } = require("express");
const userModel = require("../models/userModel");
const purchaseModel = require("../models/purchaseModel");
const zod = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userMiddleware = require("../middlewares/userMiddleware");

const userRouter = Router();
const UserSchema = zod.object({
	email: zod.string().email({ message: "Invalid email address" }),
	password: zod.string().min(8, {
		message: "Password must be 8 or more characters long",
	}),
	firstName: zod.string().min(1, { message: "First name is required" }),
	lastName: zod.string().min(1, { message: "Last name is required" }),
});

userRouter.post("/signup", async (req, res) => {
	try {
		const user = req.body;

		UserSchema.parse(user);
		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(user.password, saltRounds);

		await userModel.create({
			email: user.email,
			password: hashedPassword,
			firstName: user.firstName,
			lastName: user.lastName,
		});

		res.status(200).json({
			message: "User signup successful",
		});
	} catch (error) {
		res.status(500).json({
			message: "Error while signing up...",
			error,
		});
	}
});

userRouter.post("/signin", async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await userModel.findOne({ email });
		if (!user) {
			return res.status(404).json({
				message: "User does not exists",
			});
		}

		const matchPassword = await bcrypt.compare(password, user.password);
		if (!matchPassword) {
			return res.status(200).json({
				message: "Invalid password",
			});
		}
		const token = jwt.sign(
			{
				id: user._id,
			},
			process.env.JWT_USER_PASSWORD
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

userRouter.get("/purchases", userMiddleware, async (req, res) => {
	try {
		const userId = req.userId;
		const purchasedCourses = await purchaseModel.find({ userId });
		res.status(200).json({
			courses: purchasedCourses,
		});
	} catch (error) {
		res.status(500).json({
			message: "Error while getting purcahsed courses...",
			error,
		});
	}
});

module.exports = {
	userRouter: userRouter,
};
