
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;


const userSchema = new Schema({
  username: String,
  password: String,
  jump: {
    type: [{type: Schema.Types.ObjectId, ref: 'Jump'}]
  },
  favorites:{ 
    type: [{type: Schema.Types.ObjectId, ref: 'Jump'}]
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;