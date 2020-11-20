// const sgMail = require('@sendgrid/mail');
// const config = require('./config');
// sgMail.setApiKey(config.SENDGRID_API_KEY);
// console.log(config.SENDGRID_API_KEY);

// const fs = require('fs');

// pathToAttachment = `${__dirname}/participants.xlsx`;
// attachment = fs.readFileSync(pathToAttachment).toString('base64');

// const msg = {
//   to: [
//     'nithishr.1rn17cs060@gmail.com',
//     'poojadotm702@gmail.com',
//     'nithishravindra8@gmail.com'
//   ],
//   from: 'me@nithishravindra.com',
//   subject: 'Zoom Participants',
//   text: 'Attendes for your class',
//   attachments: [
//     {
//       content: attachment,
//       filename: 'participants.xlsx',
//       type: 'application/pdf',
//       disposition: 'attachment'
//     }
//   ]
// };
// sgMail
//   .send(msg)
//   .then((c) => console.log(c))
//   .catch((err) => {
//     console.log(err);
//     console.log(err.response.body);
//   });
