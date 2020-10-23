const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const config = require("./config");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");

const API_SECRET = config.ZOOM_API_SECRET;
const VERIFICATION_TOKEN = config.VERIFICATION_TOKEN;

let connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "zoom",
  multipleStatements: true,
});

connection.connect(function (error) {
  if (error) {
    console.log(
      "error connectiong to db " + JSON.stringify(error, undefined, 2)
    );
  } else {
    console.log("Connected");
  }
});

// const token = jwt.sign(payload, API_SECRET);

app.post(
  "/participants",
  bodyParser.raw({ type: "application/json" }),
  (req, res) => {
    console.log(
      "-----------------------------------------------------------------------------"
    );
    let eventObj;
    try {
      eventObj = JSON.parse(req.body);
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (req.headers.authorization === VERIFICATION_TOKEN) {
      // console.log(eventObj);
      const meetingID = eventObj.payload.object.id;
      console.log(meetingID);
      if (eventObj.event === "meeting.participant_joined") {
        console.log("participant joined meeting");
        let participant = eventObj.payload.object.participant;
        let participantJoinDetails = {
          meetingID: meetingID,
          name: participant.user_name,
          joinTime: participant.join_time,
        };
        // take the participant count from meeting and add 1

        console.log(participantJoinDetails);
      } else if (eventObj.event === "meeting.participant_left") {
        console.log("participant left meeting");
        let participant = eventObj.payload.object.participant;

        let participantLeftDetails = {
          meetingID: meetingID,
          name: participant.user_name,
          leaveTime: participant.leave_time,
        };
        // calculate the duration of the meeting
        console.log(participantLeftDetails);
      } else if (eventObj.event === "meeting.started") {
        console.log("meeting started");
        let meetingObj = {
          topic: eventObj.payload.object.topic,
          date: eventObj.payload.object.start_time,
          meetingID: meetingID,
        };
        console.log(meetingObj);
      } else if (eventObj.event === "meeting.ended") {
        console.log("meeting ended");
        // update participant count only if the duration is greater than 70%
      }
    } else {
      res.status(403).end("Access forbidden");
      console.log("Invalid Post Request.");
    }
  }
);

app.listen(5000, () => {
  console.log("Server is up and running on port 5000.");
});
