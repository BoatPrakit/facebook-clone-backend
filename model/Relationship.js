
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const RelationshipSchema = new Schema({
      ownerRelation: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
      },
      friends: [{
        friendOn: {
            type: Number,
            default: new Date().getTime()
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        }
      }],
      blacklist: [{
          userId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
          }
      }],
      pending: [{
          userId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
          },
          pendingOn: {
            type: Number,
            default: new Date().getTime()
          }
      }],

}); 

module.exports = mongoose.model('Relationship',RelationshipSchema);