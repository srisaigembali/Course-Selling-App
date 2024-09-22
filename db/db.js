const mongoose = require("mongoose");

const Connection = async (url) => {
	const URL = url;
	try {
		await mongoose.connect(URL, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
		});
		console.log("Database connected successfully...");
	} catch (error) {
		console.log("Error while connecting with the database ", error);
	}
};

module.exports = Connection;
