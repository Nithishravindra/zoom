const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  meetingID: {
    type: Number,
    required: true,
    unique: true
  },
  participants: {
    type: Number
  },
  class: {
    type: String,
    default: '7 B'
  },
  topic: {
    type: String
  },
  duration: Number,
  startTime: Date,
  endTime: Date
});

const Meeting = mongoose.model('Meetings', meetingSchema);

module.exports = Meeting;
