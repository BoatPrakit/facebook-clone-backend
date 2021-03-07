const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AllPostSchema = new Schema({
    postBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    allPost: [{
        postId: {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }
    }],
})


module.exports = mongoose.model('AllPost', AllPostSchema);