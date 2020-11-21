# Zoom - Track Attendes of Meeting

An application that tracks the movement of Attendees in the Zoom Meeting using webhook events. A PDF document is created and mail to a recipient. This app is built using NodeJS, MongoDB, and SendGrid API.

### Prerequisites

- Node JS
- MongoDB
- Zoom Account
- SendGrid Email API
- ngrok

### Run Locally

1. Clone this repository.
2. Run `npm install`
3. Create a [Webhook-onlyApp] (https://marketplace.zoom.us/docs/guides/build/webhook-only-app). Under Event types choose `Meetings` and subscribe to following events `Start Meeting`, `End Meeting`, `Participant/Host joined meeting`, `Participant/Host Left meeting`.
4. For the **Event notification endpoint URL**, use [ngrok](https://ngrok.com/download) generate HTTP tunnel and Run `./ngrok http 5000`. Provide the generated url starting with "https" as your Event notification endpoint URL. Click on "Continue". Grab a **Verification Token**.
5. Get a connection string from [MongoDB](https://docs.mongodb.com/manual/reference/connection-string/).
6. Create a free trial [SendGrid Twilio](https://sendgrid.com/pricing/) account. Login to your account, visit their [integration page](https://app.sendgrid.com/guide/integrate/langs/nodejs) and create an **API Key**.
7. Create `.env` file under zoom directory. Fill the corresponding values:

```
VERIFICATION_TOKEN=**Your zoom verification token**
DB=**Mongo connection string with username and password**
SENDGRID_API_KEY=** SendGrid Email API **
```

8. Add an email recipient in .env file.

```
emailID1="example1@gmail.com"
emailID2="example2@gmail.com"
emailID3="example3@gmail.com"
```

9. Start the app by running `nodemon app.js`.
10. PDF file will be generated in zoom directory which will be named after `zoomAttendee_MEETINGID`.
<!-- 11. The PDF will contain  -->
