const Excel = require('exceljs');
let workbook = new Excel.Workbook();

exports.makeExcelMail = async (data) => {
  let worksheet = workbook.addWorksheet('Participants');
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

  data.forEach((e) => {
    worksheet.addRow({
      ...e
    });
  });

  await workbook.xlsx.writeFile('participants.xlsx');
};
