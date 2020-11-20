const fs = require('fs');
const PDFDocument = require('pdfkit');
const sgMail = require('@sendgrid/mail');
const config = require('./config');
sgMail.setApiKey(config.SENDGRID_API_KEY);

async function sendMail(path) {
  const pathToAttachment = `${__dirname}/${path}`;
  const attachment = await fs.readFileSync(pathToAttachment).toString('base64');
  const msg = {
    to: [
      'nithishr.1rn17cs060@gmail.com',
      'poojadotm702@gmail.com',
      'nithishravindra8@gmail.com'
    ],
    from: 'me@nithishravindra.com',
    subject: 'Zoom Participants',
    text: 'Attendes for your class',
    attachments: [
      {
        content: attachment,
        filename: 'zoomAttendes.pdf',
        type: 'application/pdf',
        disposition: 'attachment'
      }
    ]
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log('Mail Sent.');
      return 200;
    })
    .catch((err) => {
      console.log('Error sending mail.');
      console.log(err);
      console.log(err.response.body);
    });
}

async function createPDF(meeting, finalParticipantsDetails, path) {
  let doc = new PDFDocument({ size: 'A4', margin: 50, bufferPages: true });

  generateHeader(doc);
  generateMeetingInformation(doc, meeting[0]);
  generateParticipantsTable(doc, finalParticipantsDetails);

  doc.end();
  await doc.pipe(fs.createWriteStream(path));

  try {
    if (fs.existsSync(path)) {
      return await sendMail(path);
    }
  } catch (e) {
    console.log(e);
    return 400;
  }
}

function generateHeader(doc) {
  doc.fontSize(20).text('Zoom Attendees.', 50, 25).fontSize(10).moveDown();
  generateHr(doc, 120);
}

function generateMeetingInformation(doc, meeting) {
  doc
    .fontSize(10)
    .font('Helvetica')
    .text(`Meeting: ${meeting.meetingID}`, 50)
    .text(`Duration: ${meeting.duration}`, 50)
    .text(`Topic : ${meeting.topic}`, 50)
    .text(`Start Time : ${meeting.startTime}`, 50)
    .text(`Leave Time : ${meeting.endTime}`, 50)
    .moveDown();
}

function generateParticipantsTable(doc, participants) {
  let align = 0,
    firstPageCount = 0,
    otherPageCount = 0,
    tableTop = 140;

  doc.font('Helvetica-Bold');
  generateTableRow(doc, tableTop, 'Name', 'Join Time', 'Leave Time', 'Duration');
  generateHr(doc, tableTop + 20);
  doc.font('Helvetica');

  participants.forEach((item) => {
    const position = tableTop + (align + 1) * 30;

    generateTableRow(
      doc,
      position,
      item.name,
      item.joinTime,
      item.leaveTime,
      item.duration
    );

    align++;
    firstPageCount++;
    otherPageCount++;

    if (firstPageCount === 21 || otherPageCount % 25 === 0) {
      doc.addPage();
      tableTop = 0;
      align = 0;
      otherPageCount = 0;
    }
  });
}

function generateTableRow(doc, y, name, joinTime, leaveTime, duration) {
  doc
    .fontSize(10)
    .text(name, 50, y)
    .text(joinTime, 200, y)
    .text(leaveTime, 320, y)
    .text(duration, 400, y, { width: 90, align: 'right' });
}

function generateHr(doc, y) {
  doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

module.exports = {
  createPDF
};
