const Excel = require('exceljs');
let workbook = new Excel.Workbook();
let data = [
  {
    // _id: 5fb371eae695d08dcd0e20da,
    meetingID: 74182735820,
    name: '1RN17CS060 Nithish R',
    joinTime: '2020-11-17T06:47:53.000Z',
    userID: 16778240,
    __v: 0,
    duration: 8,
    leaveTime: '2020-11-17T06:56:04.000Z'
  },
  {
    // _id: 5fb3738bf322978e7e08dda6,
    meetingID: 74182735820,
    name: 'Buj',
    joinTime: '2020-11-17T06:54:43.000Z',
    userID: 16780288,
    __v: 0,
    duration: 2,
    leaveTime: '2020-11-17T06:56:20.000Z'
  }
];

exports.makeExcelMail = (data) => {
  let worksheet = workbook.addWorksheet('Participants');
  worksheet.columns = [
    { header: 'Name', key: 'name' },
    { header: 'MeetingID', key: 'meetingID' },
    { header: 'JoinTime', key: 'joinTime' },
    { header: 'LeaveTime', key: 'leaveTime' },
    { header: 'Duration', key: 'duration' }
  ];

  worksheet.columns.forEach((column) => {
    column.width = column.header.length < 24 ? 24 : column.header.length;
  });
  worksheet.getRow(1).font = { bold: true };

  data.forEach((e) => {
    worksheet.addRow({
      ...e
    });
  });

  workbook.xlsx.writeFile('participants.xlsx');
};
