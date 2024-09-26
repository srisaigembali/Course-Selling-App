const express = require("express");
const dotenv = require("dotenv");
const { userRouter } = require("./routes/userRoute");
const { courseRouter } = require("./routes/courseRoute");
const { adminRouter } = require("./routes/adminRoute");
const Connection = require("./db/db");
const app = express();

app.use(express.json());
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/course", courseRouter);

dotenv.config();
Connection(process.env.MONGODB_URL);

app.listen(3000, () => {
	console.log("Server is running...");
});
