const Excel = require('exceljs');
let workbook = new Excel.Workbook();

const sgMail = require('@sendgrid/mail');
const config = require('./config');
sgMail.setApiKey(config.SENDGRID_API_KEY);

const fs = require('fs');

exports.makeExcelMail = async (participantsData, meeting) => {
  let worksheet = workbook.addWorksheet('Participants');
  console.log(meeting);

  worksheet.columns = [
    { header: 'Name', key: 'name' },
    { header: 'JoinTime', key: 'joinTime' },
    { header: 'LeaveTime', key: 'leaveTime' },
    { header: 'Duration', key: 'duration' }
  ];

  worksheet.columns.forEach((column) => {
    column.width = column.header.length < 24 ? 24 : column.header.length;
  });
  worksheet.getRow(1).font = { bold: true };

  participantsData.forEach((e) => {
    worksheet.addRow({
      ...e
    });
  });

  worksheet.addRows(meeting);

  await workbook.xlsx.writeFile('participants.xlsx');
  // file created

  // sendgrid attachements
  pathToAttachment = `${__dirname}/participants.xlsx`;
  attachment = fs.readFileSync(pathToAttachment).toString('base64');

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
        filename: 'participants.xlsx',
        type: 'application/pdf',
        disposition: 'attachment'
      }
    ]
  };
  // await sgMail.send(msg).catch((err) => {
  //   console.log(err);
  //   console.log(err.response.body);
  // });
};
