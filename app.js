const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const config = require("./config");
const jwt = require("jsonwebtoken");

const API_SECRET = config.ZOOM_API_SECRET;
const VERIFICATION_TOKEN = config.VERIFICATION_TOKEN;

// const token = jwt.sign(payload, API_SECRET);

app.post(
  "/participants",
  bodyParser.raw({ type: "application/json" }),
  (req, res) => {
    console.log(
      "-----------------------------------------------------------------------------"
    );
    let event;
    try {
      event = JSON.parse(req.body);
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (req.headers.authorization === VERIFICATION_TOKEN) {
      console.log(event);
      const meetingID = event.payload.object.id;
      console.log(meetingID);
      if (event.event === "meeting.participant_joined") {
        console.log("participant joined meeting");
      } else if (event.event === "meeting.participant_left") {
        console.log("participants left meeting");
      } else if (event.event === "meeting.started") {
        console.log("meeting started");
      } else if (event.event === "meeting.ended") {
        console.log("meeting ended");
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
