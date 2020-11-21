const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config');

const app = express();
const VERIFICATION_TOKEN = config.VERIFICATION_TOKEN;
const zoomRoutes = require('./zoom');

(async function () {
  try {
    await mongoose
      .connect(config.DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
      })
      .then(() => console.log('Connected to DB'));
  } catch (err) {
    console.log('Error connecting to DB', err);
  }
})();

app.post('/participants', bodyParser.raw({ type: 'application/json' }), (req, res) => {
  function Response(statusCode, msg) {
    console.log(statusCode, msg);
    return res.status(statusCode).send(msg);
  }

  let eventObj;
  try {
    eventObj = JSON.parse(req.body);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (req.headers.authorization === VERIFICATION_TOKEN) {
    const meetingID = eventObj.payload.object.id;

    if (eventObj.event === 'meeting.participant_joined') {
      console.log('participant joined meeting');
      let participant = eventObj.payload.object.participant;
      let participantJoinDetails = {
        meetingID: meetingID,
        name: participant.user_name,
        joinTime: participant.join_time,
        userID: participant.user_id
      };

      const result = zoomRoutes.participantJoined(participantJoinDetails);

      if (result === 200) Response(200, 'Participant Joined');
      else Response(400, 'Error occurred at Participant.Joined');
    } else if (eventObj.event === 'meeting.participant_left') {
      console.log('participant left meeting');
      let participant = eventObj.payload.object.participant;

      let participantLeftDetails = {
        meetingID: meetingID,
        name: participant.user_name,
        leaveTime: participant.leave_time,
        userID: participant.user_id
      };

      const result = zoomRoutes.participantLeft(participantLeftDetails);

      if (result === 200) Response(200, 'Participant Left');
      else Response(400, 'Error occurred at Participant.Left');
    } else if (eventObj.event === 'meeting.started') {
      console.log('meeting started');
      let meetingObj = {
        topic: eventObj.payload.object.topic,
        startTime: eventObj.payload.object.start_time,
        meetingID: meetingID
      };

      const result = zoomRoutes.meetingStarted(meetingObj);

      if (result === 200) Response(200, 'Meeting Started');
      else Response(400, 'Error occurred at Meeting.Started');
    } else if (eventObj.event === 'meeting.ended') {
      let meetingObj = {
        leaveTime: eventObj.payload.object.end_time,
        startTime: eventObj.payload.object.start_time,
        meetingID: meetingID
      };

      const result = zoomRoutes.meetingEnded(meetingObj);

      if (result === 200) Response(200, 'Meeting Ended');
      else Response(400, 'Error occurred at Meeting.Ended');
    }
  } else {
    res.status(403).end('Access forbidden');
    console.log('Invalid Post Request.');
  }
});

const port = 5000;

app.listen(port, () => {
  console.log(`App running on port ${port} ...`);
});
