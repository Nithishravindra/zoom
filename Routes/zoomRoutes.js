const Meeting = require('../model/meetingModel');
const Participant = require('../model/participantModel');

exports.meetingStarted = async (meetingObj) => {
  console.log('Meeting started');
  const res = await Meeting.create({
    meetingID: meetingObj.meetingID,
    topic: meetingObj.topic,
    startTime: meetingObj.startTime
  });

  console.log('Posted to DB!');
  console.log(res);
};

exports.participantJoined = async () => {};

exports.participantLeft = async () => {};

exports.meetingEnded = async (meetingObj) => {
  console.log('Meeting ended');
  const d1 = new Date(meetingObj.startTime);
  const d2 = new Date(meetingObj.leaveTime);
  const diff = (d2.getTime() - d1.getTime()) / 1000;
  const durationInMins = Math.round(diff / 60);

  const filterObj = { meetindID: meetingObj.meetindID };
  const updateObj = {
    endTime: meetingObj.leaveTime,
    duration: durationInMins
  };

  const meet = await Meeting.findOneAndUpdate(filterObj, updateObj, {
    new: true
  });
  console.log(meet);
  console.log('Meeting endededed');
};
