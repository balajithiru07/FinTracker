import React, { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { IndianRupee, Trash2, Calendar, Plus } from 'lucide-react';
import ExpenseForm from './ExpenseForm';

const ExpenseList = () => {
    const { expenses, getExpenses, deleteExpense } = useContext(GlobalContext);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [filterCategory, setFilterCategory] = useState('All');

    useEffect(() => {
        getExpenses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filteredExpenses = filterCategory === 'All'
        ? expenses
        : expenses.filter(exp => exp.category === filterCategory);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-slate-800 pl-1">Expenses</h2>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-200 flex items-center gap-2 hover:bg-indigo-700 transition transform hover:-translate-y-0.5 active:translate-y-0"
                >
                    <Plus size={20} /> <span className="font-semibold">Add Expense</span>
                </button>
            </div>

            <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {['All', 'Food', 'Rent', 'Transport', 'Entertainment', 'Petrol', 'Utilities', 'Health', 'Other'].map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilterCategory(cat)}
                        className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 whitespace-nowrap ${filterCategory === cat
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                            : 'bg-white text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto relative">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                            <tr>
                                <th className="p-5 font-bold text-slate-500 text-sm tracking-wider uppercase">Date</th>
                                <th className="p-5 font-bold text-slate-500 text-sm tracking-wider uppercase">Title</th>
                                <th className="p-5 font-bold text-slate-500 text-sm tracking-wider uppercase">Category</th>
                                <th className="p-5 font-bold text-slate-500 text-sm tracking-wider uppercase">Amount</th>
                                <th className="p-5 font-bold text-slate-500 text-sm tracking-wider uppercase">Payment</th>
                                <th className="p-5 font-bold text-slate-500 text-sm tracking-wider uppercase text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredExpenses.map(expense => (
                                <tr key={expense._id} className="hover:bg-indigo-50/30 transition duration-200">
                                    <td className="p-5 text-slate-500 text-sm whitespace-nowrap">
                                        <div className="flex items-center gap-2 font-medium">
                                            <Calendar size={16} className="text-indigo-400" />
                                            {new Date(expense.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </div>
                                    </td>
                                    <td className="p-5 font-semibold text-slate-700">{expense.title}</td>
                                    <td className="p-5">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide 
                                            ${expense.category === 'Food' ? 'bg-orange-100 text-orange-600' :
                                                expense.category === 'Rent' ? 'bg-purple-100 text-purple-600' :
                                                    expense.category === 'Transport' ? 'bg-blue-100 text-blue-600' :
                                                        expense.category === 'Petrol' ? 'bg-yellow-100 text-yellow-700' :
                                                            expense.category === 'Entertainment' ? 'bg-pink-100 text-pink-600' :
                                                                'bg-slate-100 text-slate-600'
                                            }`}>
                                            {expense.category}
                                        </span>
                                    </td>
                                    <td className="p-5 font-bold text-slate-800 flex items-center gap-1">
                                        <IndianRupee size={15} className="text-slate-400" />
                                        {expense.amount.toFixed(2)}
                                    </td>
                                    <td className="p-5 text-slate-500 text-sm font-medium">{expense.paymentMethod}</td>
                                    <td className="p-5 text-right">
                                        <button
                                            onClick={() => deleteExpense(expense._id)}
                                            className="text-slate-400 p-2 hover:bg-red-50 hover:text-red-500 rounded-lg transition"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredExpenses.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="p-16 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400">
                                            <div className="bg-slate-50 p-4 rounded-full mb-3">
                                                <Calendar size={32} className="text-slate-300" />
                                            </div>
                                            <p className="text-lg font-medium text-slate-500">No expenses found</p>
                                            <p className="text-sm">Add a new expense to get started!</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isFormOpen && <ExpenseForm onClose={() => setIsFormOpen(false)} />}
        </div>
    );
};

export default ExpenseList;
