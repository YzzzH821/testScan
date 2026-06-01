import * as ExcelJS from 'exceljs';
import { Workbook } from 'exceljs';

const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet('Sheet1');

worksheet.columns = [
  { header: 'ID', key: 'id', width: 10 },
  { header: '姓名', key: 'name', width: 20 }
];

// 添加数据
worksheet.addRow({ id: 1, name: '张三' });

// 设置单元格样式（如背景色、字体）
worksheet.getCell('A1').fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FFFF0000' } // 红色
};

// 保存文件
await workbook.xlsx.writeFile('output.xlsx');


// const workbook = new ExcelJS.Workbook();
// await workbook.xlsx.readFile('input.xlsx');

// const worksheet = workbook.worksheets[0];
// worksheet.eachRow((row, rowIndex) => {
//   console.log(`Row ${rowIndex}:`, row.values);
// });
