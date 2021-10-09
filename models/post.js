const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const postSchema=new Schema({
    title: String,
	description: String,
	created: {type: Date, default: Date.now},
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
});

module.exports=mongoose.model('Post',postSchema);