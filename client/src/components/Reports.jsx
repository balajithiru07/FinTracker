import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Download } from 'lucide-react';

const Reports = () => {
    const { expenses } = useContext(GlobalContext);

    const exportPDF = () => {
        const doc = new jsPDF();
        doc.text("Expense Report", 20, 10);

        const tableColumn = ["Date", "Title", "Category", "Amount", "Payment Method"];
        const tableRows = [];

        expenses.forEach(expense => {
            const expenseData = [
                new Date(expense.date).toLocaleDateString(),
                expense.title,
                expense.category,
                expense.amount.toFixed(2),
                expense.paymentMethod
            ];
            tableRows.push(expenseData);
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20
        });

        const total = expenses.reduce((acc, item) => acc + item.amount, 0);
        doc.text(`Total Expenses: ${total.toFixed(2)}`, 20, doc.lastAutoTable.finalY + 10);

        doc.save("expense_report.pdf");
    };

    const exportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(expenses.map(e => ({
            Date: new Date(e.date).toLocaleDateString(),
            Title: e.title,
            Category: e.category,
            Amount: e.amount,
            PaymentMethod: e.paymentMethod,
            Description: e.description
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");
        XLSX.writeFile(workbook, "expense_report.xlsx");
    };

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-6">Reports</h2>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-6">
                <p className="mb-4 text-slate-600">Export your expense data for analysis.</p>
                <div className="flex gap-4">
                    <button onClick={exportPDF} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
                        <Download size={20} /> Download PDF
                    </button>
                    <button onClick={exportExcel} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                        <Download size={20} /> Download Excel
                    </button>
                </div>
            </div>
            {/* Future: Advanced charts comparison could go here */}
        </div>
    );
};

export default Reports;
