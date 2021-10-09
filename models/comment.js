const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    message: String,
    author: {
        id: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    postId:{ type: Schema.Types.ObjectId }
});

module.exports = mongoose.model('Comment', CommentSchema);