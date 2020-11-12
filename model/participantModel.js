const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  meetingID: {
    type: Number,
    ref: 'meetings',
    required: true
  },
  userID: {
    type: Number,
    unique: true
  },
  name: String,
  joinTime: Date,
  leaveTime: Date,
  duration: Number
});

const Participant = mongoose.model('Participants', participantSchema);

module.exports = Participant;
