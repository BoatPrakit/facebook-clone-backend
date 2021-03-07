const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const postSchema = new Schema({
    description: {
        required: true,
        type: String,
    },
    comments: Array,
    postOn: {
        type: Number,
        default: new Date().getTime(),
        required: true
    },
    likes: Number
})

module.exports = mongoose.model('Post', postSchema)