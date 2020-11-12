const Meeting = require('../model/meetingModel');
const Participant = require('../model/participantModel');

function calculateTimedifference(d1, d2) {
  const diff = (d2.getTime() - d1.getTime()) / 1000;
  if (diff < 10) return 0;

  const durationInMins = Math.round(diff / 60);
  return durationInMins;
}

exports.meetingStarted = async (meetingObj) => {
  await Meeting.create({
    meetingID: meetingObj.meetingID,
    topic: meetingObj.topic,
    startTime: meetingObj.startTime
  });
};

exports.participantJoined = async (participantDetails) => {
  await Participant.create({
    meetingID: participantDetails.meetingID,
    name: participantDetails.name,
    joinTime: participantDetails.joinTime,
    userID: participantDetails.userID
  });
};

exports.participantLeft = async (participantDetails) => {
  let attendee = await Participant.find({
    userID: participantDetails.userID,
    meetindID: participantDetails.meetindID
  });

  const d1 = new Date(attendee[0].joinTime);
  const d2 = new Date(participantDetails.leaveTime);

  const res = calculateTimedifference(d1, d2);

  if (res === 0) return;

  const filterObj = {
    userID: participantDetails.userID
  };
  const updateObj = {
    leaveTime: participantDetails.leaveTime,
    duration: res
  };

  await Participant.findOneAndUpdate(filterObj, updateObj, {
    new: true
  });
};

exports.meetingEnded = async (meetingObj) => {
  console.log(meetingObj);
  const d1 = new Date(meetingObj.startTime);
  const d2 = new Date(meetingObj.leaveTime);

  const res = calculateTimedifference(d1, d2);

  if (res === 0) return;

  const filterObj = { meetindID: meetingObj.meetindID };
  const updateObj = {
    endTime: meetingObj.leaveTime,
    duration: res
  };

  await Meeting.findOneAndUpdate(filterObj, updateObj, {
    new: true
  });

  const query = { meetingID: meetingObj.meetingID };
  const finalMeetingDetails = Participant.find(query);

  console.log(meet);
  console.log(finalMeetingDetails);

  console.log('Meeting endededed');
};
