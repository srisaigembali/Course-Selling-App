const mongoose = require("mongoose");

const Connection = async (url) => {
	try {
		await mongoose.connect(url);
		console.log("Database connected successfully...");
	} catch (error) {
		console.log("Error while connecting with the database ", error);
	}
};

module.exports = Connection;
