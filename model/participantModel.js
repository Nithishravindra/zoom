const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  meetingID: {
    type: Number,
    ref: 'meetings',
    required: true
  },
  Name: {
    type: Number
  },
  joinTime: Date,
  leaveTime: Date,
  duration: {
    type: Number
  }
});

const Participant = mongoose.model('Participants', participantSchema);

module.exports = Participant;
