const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const purchaseSchema = new Schema({
	courseId: ObjectId,
	userId: ObjectId,
});

const purchaseModel = mongoose.model("purchase", purchaseSchema);

module.exports = purchaseModel;
