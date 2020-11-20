const fs = require('fs');
const PDFDocument = require('pdfkit');

function createInvoice(invoice, path) {
  let doc = new PDFDocument({ size: 'A4', margin: 50, bufferPages: true });

  generateHeader(doc);
  generateMeetingInformation(doc, invoice);
  generateParticipantsTable(doc, invoice);

  doc.end();
  doc.pipe(fs.createWriteStream(path));
}

function generateHeader(doc) {
  doc.fontSize(20).text('Zoom Attendees.', 50, 25).fontSize(10).moveDown();
  generateHr(doc, 120);
}

const data2 = [
  {
    meetingID: 71239134627,
    topic: "1RN17CS060 Nithish R's Zoom Meeting",
    startTime: '2020-11-17T12:52:08.000Z',
    duration: 104,
    endTime: '2020-11-17T14:35:38.000Z'
  }
];

const data1 = [
  {
    name: '1RN17CS060 Nithish R',
    duration: 103,
    joinTime: '12:52:08:000+0000',
    leaveTime: '14:35:37:000+0000'
  },
  {
    name: ' Ran',
    duration: 70,
    joinTime: '12:54:00:000+0000',
    leaveTime: '14:04:18:000+0000'
  }
];
function generateMeetingInformation(doc, invoice) {
  const info = data2[0];
  doc
    .fontSize(10)
    .font('Helvetica')
    .text(`Meeting: ${info.meetingID}`, 50)
    .text(`Duration: ${info.duration}`, 50)
    .text(`Topic : ${info.topic}`, 50)
    .text(`Start Time : ${info.startTime}`, 50)
    .text(`Leave Time : ${info.leaveTime}`, 50)
    .moveDown();
}

function generateParticipantsTable(doc, invoice) {
  let i = 0,
    first = 0,
    rest = 0;
  let invoiceTableTop = 140;

  doc.font('Helvetica-Bold');
  generateTableRow(doc, invoiceTableTop, 'Name', 'Join Time', 'Leave Time', 'Duration');
  generateHr(doc, invoiceTableTop + 20);
  doc.font('Helvetica');

  data1.forEach((item) => {
    const position = invoiceTableTop + (i + 1) * 30;
    console.log('position', position, 'i = ', i);
    generateTableRow(
      doc,
      position,
      item.name,
      item.joinTime,
      item.leaveTime,
      item.duration
    );
    i++;
    first++;
    rest++;
    if (first === 21 || rest % 25 === 0) {
      doc.addPage();
      invoiceTableTop = 0;
      i = 0;
      rest = 0;
      console.log('HELLO');
    }
  });
}

function generateTableRow(doc, y, name, joinTime, leaveTime, duration) {
  doc
    .fontSize(10)
    .text(name, 50, y)
    .text(joinTime, 200, y)
    .text(leaveTime, 300, y, { width: 90, align: 'right' })
    .text(duration, 400, y, { width: 90, align: 'right' });
}

function generateHr(doc, y) {
  doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

createInvoice();
