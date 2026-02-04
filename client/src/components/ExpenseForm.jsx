import React, { useState, useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { X } from 'lucide-react';

const ExpenseForm = ({ onClose }) => {
    const { addExpense } = useContext(GlobalContext);

    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Food');
    const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [description, setDescription] = useState('');

    const onSubmit = (e) => {
        e.preventDefault();

        const newExpense = {
            title,
            amount: +amount,
            category,
            date,
            paymentMethod,
            description
        };

        addExpense(newExpense);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
                <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-bold text-xl text-slate-800">New Transaction</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition"><X size={20} className="text-slate-500" /></button>
                </div>
                <form onSubmit={onSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Title</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            placeholder="e.g. Grocery Shopping" />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Amount</label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-slate-400">₹</span>
                                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-8 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition font-semibold"
                                    placeholder="0.00" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Date</label>
                            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category</label>
                            <select value={category} onChange={(e) => setCategory(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition appearance-none cursor-pointer">
                                <option value="Food">Food 🍔</option>
                                <option value="Rent">Rent 🏠</option>
                                <option value="Transport">Transport 🚌</option>
                                <option value="Petrol">Petrol ⛽</option>
                                <option value="Entertainment">Entertainment 🎬</option>
                                <option value="Utilities">Utilities 💡</option>
                                <option value="Health">Health 🏥</option>
                                <option value="Other">Other 📦</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Payment</label>
                            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition appearance-none cursor-pointer">
                                <option value="Cash">Cash 💵</option>
                                <option value="Credit Card">Credit Card 💳</option>
                                <option value="Debit Card">Debit Card 💳</option>
                                <option value="UPI">UPI 📱</option>
                                <option value="Other">Other 🧾</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description <span className="text-slate-400 font-normal normal-case">(Optional)</span></label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
                            rows="2"></textarea>
                    </div>
                    <button type="submit"
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5 transition-all active:translate-y-0">
                        Add Expense
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ExpenseForm;
