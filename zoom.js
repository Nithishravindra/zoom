const Meeting = require('./model/meetingModel');
const Participant = require('./model/participantModel');
const pdfnMail = require('./generatePDF');

function calculateTimedifference(d1, d2) {
  const diff = (d2.getTime() - d1.getTime()) / 1000;

  if (diff < 0) return 0;

  const durationInMins = Math.round(diff / 60);

  return durationInMins;
}

exports.meetingStarted = async (meetingObj) => {
  try {
    await Meeting.create({
      meetingID: meetingObj.meetingID,
      topic: meetingObj.topic,
      startTime: meetingObj.startTime
    }).then(() => {
      return 200;
    });
  } catch (e) {
    console.log('Error posting meeting', e);
    console.log(meetingObj);
    return 400;
  }
};

exports.participantJoined = async (participantDetails) => {
  try {
    await Participant.create({
      meetingID: participantDetails.meetingID,
      name: participantDetails.name,
      joinTime: participantDetails.joinTime,
      userID: participantDetails.userID
    }).then(() => {
      return 200;
    });
  } catch (e) {
    console.log('Error in participant.joined', e);
    console.log(participantDetails);
    return 400;
  }
};

exports.participantLeft = async (participantDetails) => {
  try {
    let attendee = await Participant.find({
      userID: participantDetails.userID,
      meetindID: participantDetails.meetindID
    });

    if (attendee.length == 0) return;

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

    return 200;
  } catch (e) {
    console.log('Error in participant.left', e);
    console.log(participantDetails);
    return 400;
  }
};

exports.meetingEnded = async (meetingObj) => {
  try {
    const d1 = new Date(meetingObj.startTime);
    const d2 = new Date(meetingObj.leaveTime);
    const meetingID = meetingObj.meetingID;

    const res = calculateTimedifference(d1, d2);

    if (res === 0) return;

    const filterObj = { meetingID: meetingID };
    const updateObj = {
      endTime: meetingObj.leaveTime,
      duration: res
    };

    await Meeting.findOneAndUpdate(filterObj, updateObj, {
      new: true
    });

    const finalParticipantsDetails = await Participant.aggregate([
      {
        $match: { meetingID: meetingID }
      },
      {
        $project: {
          _id: 0,
          name: 1,
          duration: 1,
          joinTime: {
            $dateToString: { format: '%H:%M:%S:%L%z', date: '$joinTime' }
          },
          leaveTime: {
            $dateToString: { format: '%H:%M:%S:%L%z', date: '$leaveTime' }
          }
        }
      }
    ]);

    const meeting = await Meeting.find(
      { meetingID: meetingID },
      {
        _id: 0,
        __v: 0
      }
    );

    const fileName = `zoomAttendee_${meetingID}.pdf`;
    const resMail = await pdfnMail.createPDF(meeting, finalParticipantsDetails, fileName);

    console.log(resMail);
    if (resMail === 200) {
      const meetingDoc = await Meeting.deleteOne({ meetingID: meetingID });
      const participantDoc = await Participant.deleteMany({ meetingID: meetingID });

      if (meetingDoc.deletedCount === 1 && participantDoc.deletedCount >= 1) {
        console.log('App worked. Woho!');
        return 200;
      }
    }
  } catch (e) {
    console.log('Error in Meeting.ended', e);
    console.log(meetingObj);
    return 400;
  }
};
