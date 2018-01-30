// Initialize Mongoose ODM
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define VoteSchema
const VoteSchema = new Schema({
  js: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    required: true
  }
});

// Create collection and add schema
module.exports = mongoose.model('Vote', VoteSchema);