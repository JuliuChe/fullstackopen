const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
  },
  favoriteGenre: {
    type:String,
    required:true,
    minLength:4,
    lowercase:true,
    trim:true
  },
  // friends: [{ type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User'
  //  }],
})

module.exports = mongoose.model('User', schema)