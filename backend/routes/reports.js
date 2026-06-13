import express from 'express';
import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';
import Appointment from '../models/Appointment.js';
import Expense from '../models/Expense.js';
import { protect, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Helper to filter data by type (daily, weekly, monthly, yearly)
const getFilteredData = async (type) => {
  const appointments = await Appointment.find({});
  const expenses = await Expense.find({});
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  let filterFn = () => false;
  let title = '';

  const getDaysAgo = (days) => {
    const d = new Date(today);
    d.setDate(today.getDate() - days);
    return d.toISOString().split('T')[0];
  };

  if (type === 'daily') {
    filterFn = (date) => date === todayStr;
    title = `Daily Financial Report - ${todayStr}`;
  } else if (type === 'weekly') {
    const start = getDaysAgo(7);
    filterFn = (date) => date >= start && date <= todayStr;
    title = `Weekly Financial Report (${start} to ${todayStr})`;
  } else if (type === 'monthly') {
    const start = getDaysAgo(30);
    filterFn = (date) => date >= start && date <= todayStr;
    title = `Monthly Financial Report (${start} to ${todayStr})`;
  } else {
    // Yearly
    const start = `${today.getFullYear()}-01-01`;
    filterFn = (date) => date >= start && date <= todayStr;
    title = `Yearly Financial Report - Calendar Year ${today.getFullYear()}`;
  }

  const completedAppts = appointments.filter(a => a.status === 'completed' && filterFn(a.date));
  const periodExpenses = expenses.filter(e => filterFn(e.date));

  return { completedAppts, periodExpenses, title };
};

// @desc    Export financial summary as PDF
// @route   GET /api/reports/pdf
// @access  Private (Owner or Manager)
router.get('/pdf', protect, authorizeRoles('owner', 'manager'), async (req, res) => {
  const { type } = req.query; // daily, weekly, monthly, yearly
  
  try {
    const { completedAppts, periodExpenses, title } = await getFilteredData(type || 'monthly');

    const totalRevenue = completedAppts.reduce((sum, a) => sum + a.price, 0);
    const totalExpenses = periodExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalProfit = totalRevenue - totalExpenses;

    // Set headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="rustik-${type}-report.pdf"`);

    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);

    // BRAND COLORS (Deep Forest Green and Luxury Gold)
    const FOREST = '#0F2E16';
    const GOLD = '#C8A96B';
    const CHARCOAL = '#333333';

    // Header / Branding
    doc.rect(0, 0, 612, 120).fill(FOREST);
    doc.fillColor('#FFFFFF').fontSize(24).font('Helvetica-Bold').text('RUSTIK ACADEMY', 50, 35);
    doc.fillColor(GOLD).fontSize(12).font('Helvetica').text('Lounge & Premium Barber Portfolio Platform', 50, 65);
    doc.fillColor('#FFFFFF').fontSize(10).text(`Generated: ${new Date().toLocaleString()}`, 400, 45);
    doc.text(`Audited By: ${req.user.name} (${req.user.role.toUpperCase()})`, 400, 65);

    // Body Title
    doc.moveDown(5);
    doc.fillColor(FOREST).fontSize(16).font('Helvetica-Bold').text(title, 50, 140);
    
    // Draw Gold Line
    doc.moveTo(50, 165).lineTo(562, 165).strokeColor(GOLD).lineWidth(2).stroke();

    // Financial Cards Grid
    doc.rect(50, 190, 150, 70).fill(FOREST);
    doc.rect(215, 190, 150, 70).fill('#B53A3A'); // Crimson for expenses
    doc.rect(380, 190, 182, 70).fill(totalProfit >= 0 ? '#1C4A28' : '#6A1B1B'); // Green/Red for profit

    doc.fillColor('#FFFFFF').fontSize(10).font('Helvetica').text('TOTAL REVENUE', 65, 205);
    doc.fontSize(16).font('Helvetica-Bold').text(`$${totalRevenue.toFixed(2)}`, 65, 225);

    doc.fontSize(10).font('Helvetica').text('TOTAL EXPENSES', 230, 205);
    doc.fontSize(16).font('Helvetica-Bold').text(`$${totalExpenses.toFixed(2)}`, 230, 225);

    doc.fontSize(10).font('Helvetica').text('NET PROFIT / LOSS', 395, 205);
    doc.fontSize(16).font('Helvetica-Bold').text(`$${totalProfit.toFixed(2)}`, 395, 225);

    // Stats breakdown
    doc.moveDown(7);
    doc.fillColor(CHARCOAL).fontSize(12).font('Helvetica-Bold').text('OPERATIONS BREAKDOWN', 50, 290);
    doc.moveTo(50, 305).lineTo(562, 305).strokeColor('#E0E0E0').lineWidth(1).stroke();

    doc.fillColor(CHARCOAL).fontSize(10).font('Helvetica')
       .text(`Total Customers Served: ${completedAppts.length}`, 50, 320)
       .text(`Average Ticket Value: $${completedAppts.length > 0 ? (totalRevenue / completedAppts.length).toFixed(2) : '0.00'}`, 50, 345)
       .text(`Total Expense Logs: ${periodExpenses.length}`, 300, 320)
       .text(`Operational Margin: ${totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : '0'}%`, 300, 345);

    // Render Transaction Summary Table (top 8)
    doc.moveDown(4);
    doc.fillColor(FOREST).fontSize(12).font('Helvetica-Bold').text('RECENT COMPLETED BOOKINGS', 50, 390);
    doc.moveTo(50, 405).lineTo(562, 405).strokeColor(GOLD).lineWidth(1.5).stroke();

    // Table Headers
    doc.fillColor(CHARCOAL).fontSize(9).font('Helvetica-Bold');
    doc.text('Date', 50, 415);
    doc.text('Customer', 110, 415);
    doc.text('Service', 220, 415);
    doc.text('Barber', 380, 415);
    doc.text('Price', 500, 415);
    doc.moveTo(50, 430).lineTo(562, 430).strokeColor('#CCCCCC').lineWidth(1).stroke();

    // Table Rows
    doc.font('Helvetica').fillColor('#555555');
    let y = 440;
    const itemsToShow = completedAppts.slice(0, 8);
    
    itemsToShow.forEach(a => {
      doc.text(a.date, 50, y);
      doc.text(a.customerName, 110, y, { width: 100, ellipsis: true });
      doc.text(a.serviceName, 220, y, { width: 150, ellipsis: true });
      doc.text(a.barberName, 380, y, { width: 110, ellipsis: true });
      doc.text(`$${a.price.toFixed(2)}`, 500, y);
      y += 20;
    });

    if (completedAppts.length > 8) {
      doc.font('Helvetica-Oblique').fillColor('#888888').text(`* Showing 8 of ${completedAppts.length} total completed appointments. Download full excel sheet for entire database.`, 50, y + 5);
    }

    // Footnote
    doc.rect(50, 720, 512, 1).fill(GOLD);
    doc.fillColor('#888888').fontSize(8).font('Helvetica').text('Rustik Academy Salon Management © 2026. Confidential Business Report.', 50, 730, { align: 'center' });

    doc.end();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Export financial details as Excel spreadsheet
// @route   GET /api/reports/excel
// @access  Private (Owner or Manager)
router.get('/excel', protect, authorizeRoles('owner', 'manager'), async (req, res) => {
  const { type } = req.query; // daily, weekly, monthly, yearly
  
  try {
    const { completedAppts, periodExpenses } = await getFilteredData(type || 'monthly');

    // Create Excel book
    const workbook = new ExcelJS.Workbook();
    
    // TAB 1: Appointments sheet
    const sheet1 = workbook.addWorksheet('Completed Bookings');
    sheet1.columns = [
      { header: 'ID', key: 'id', width: 15 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Time', key: 'time', width: 10 },
      { header: 'Customer Name', key: 'customerName', width: 22 },
      { header: 'Customer Phone', key: 'customerPhone', width: 18 },
      { header: 'Service Name', key: 'serviceName', width: 30 },
      { header: 'Barber Name', key: 'barberName', width: 22 },
      { header: 'Amount ($)', key: 'price', width: 12 },
      { header: 'Notes', key: 'notes', width: 25 }
    ];

    completedAppts.forEach(a => {
      sheet1.addRow({
        id: a._id.toString(),
        date: a.date,
        time: a.time,
        customerName: a.customerName,
        customerPhone: a.customerPhone,
        serviceName: a.serviceName,
        barberName: a.barberName,
        price: a.price,
        notes: a.notes || ''
      });
    });

    // Style sheet 1 Headers
    sheet1.getRow(1).eachCell((cell) => {
      cell.font = { name: 'Arial', bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF0F2E16' } // Forest Green
      };
    });

    // TAB 2: Expenses sheet
    const sheet2 = workbook.addWorksheet('Operational Expenses');
    sheet2.columns = [
      { header: 'ID', key: 'id', width: 15 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Category', key: 'category', width: 18 },
      { header: 'Amount ($)', key: 'amount', width: 12 },
      { header: 'Description', key: 'description', width: 35 }
    ];

    periodExpenses.forEach(e => {
      sheet2.addRow({
        id: e._id.toString(),
        date: e.date,
        category: e.category.toUpperCase(),
        amount: e.amount,
        description: e.description || ''
      });
    });

    // Style sheet 2 Headers
    sheet2.getRow(1).eachCell((cell) => {
      cell.font = { name: 'Arial', bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF962B2B' } // Dark Red for expenses
      };
    });

    // Set headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="rustik-${type}-report.xlsx"`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
export { getFilteredData };
