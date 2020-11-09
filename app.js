const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const config = require('./config');

const API_SECRET = config.ZOOM_API_SECRET;
const VERIFICATION_TOKEN = config.VERIFICATION_TOKEN;

const zoomRoutes = require('./Routes/zoomRoutes');

// const token = jwt.sign(payload, API_SECRET);

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

    // console.log(eventObj);
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
        // take the participant count from meeting and add 1

        console.log(participantJoinDetails);
      } else if (eventObj.event === 'meeting.participant_left') {
        console.log('participant left meeting');
        let participant = eventObj.payload.object.participant;

        let participantLeftDetails = {
          meetingID: meetingID,
          name: participant.user_name,
          leaveTime: participant.leave_time
        };
        // calculate the duration of the meeting
        console.log(participantLeftDetails);
      } else if (eventObj.event === 'meeting.started') {
        console.log('meeting started');
        let meetingObj = {
          topic: eventObj.payload.object.topic,
          date: eventObj.payload.object.start_time,
          meetingID: meetingID
        };
        console.log(meetingObj);
      } else if (eventObj.event === 'meeting.ended') {
        let meetingObj = {
          topic: eventObj.payload.object.topic,
          date: eventObj.payload.object.start_time,
          meetingID: meetingID
        };
        console.log('meeting ended');
        console.log(meetingObj);
        // update participant count only if the duration is greater than 70%
      }
    } else {
      res.status(403).end('Access forbidden');
      console.log('Invalid Post Request.');
    }
  }
);

module.exports = app;
