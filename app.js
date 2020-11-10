const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config');

const app = express();
const VERIFICATION_TOKEN = config.VERIFICATION_TOKEN;
const zoomRoutes = require('./Routes/zoomRoutes');

(async function () {
  try {
    await mongoose
      .connect(config.DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
      })
      .then((res) => {
        console.log('Connected to DB'), (DB = res);
      });
  } catch (err) {
    console.log('Error connecting to DB', err);
  }
})();

app.post(
  '/participants',
  bodyParser.raw({ type: 'application/json' }),
  (req, res) => {
    console.log(
      '-----------------------------------------------------------------------------'
    );
    let eventObj;
    try {
      eventObj = JSON.parse(req.body);
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
    if (req.headers.authorization === VERIFICATION_TOKEN) {
      const meetingID = eventObj.payload.object.id;
      console.log(meetingID);
      if (eventObj.event === 'meeting.participant_joined') {
        console.log('participant joined meeting');
        let participant = eventObj.payload.object.participant;
        let participantJoinDetails = {
          meetingID: meetingID,
          name: participant.user_name,
          joinTime: participant.join_time
        };

        // console.log(participantJoinDetails);
      } else if (eventObj.event === 'meeting.participant_left') {
        console.log('participant left meeting');
        let participant = eventObj.payload.object.participant;

        let participantLeftDetails = {
          meetingID: meetingID,
          name: participant.user_name,
          leaveTime: participant.leave_time
        };
        // calculate the duration of the meeting
        // console.log(participantLeftDetails);
      } else if (eventObj.event === 'meeting.started') {
        let meetingObj = {
          topic: eventObj.payload.object.topic,
          startTime: eventObj.payload.object.start_time,
          meetingID: meetingID
        };
        zoomRoutes.meetingStarted(meetingObj);
      } else if (eventObj.event === 'meeting.ended') {
        let meetingObj = {
          topic: eventObj.payload.object.topic,
          leaveTime: eventObj.payload.object.end_time,
          startTime: eventObj.payload.object.start_time,
          meetingID: meetingID
        };
        zoomRoutes.meetingEnded(meetingObj);
      }
    } else {
      res.status(403).end('Access forbidden');
      console.log('Invalid Post Request.');
    }
  }
);

const port = 5000;

app.listen(port, () => {
  console.log(`App running on port ${port} ...`);
});