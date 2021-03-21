const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const postSchema = new Schema({
    description: {
        required: true,
        type: String,
    },
    comments: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User' 
        },
        commentOn: {
            type: Number,
            default: new Date().getTime()
        },
        detail: {
            type: String,
        }
    }],
    postOn: {
        type: Number,
        default: new Date().getTime(),
    },
    likes: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    isEdited: {
        type: Boolean,
        default: false
    },
    editedOn: {
        type: Number,
    }
})

module.exports = mongoose.model('Post', postSchema)