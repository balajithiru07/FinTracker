import React, { useContext, useEffect } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { IndianRupee, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

const Dashboard = () => {
    const { expenses, getExpenses, settings, getSettings } = useContext(GlobalContext);

    useEffect(() => {
        getExpenses();
        getSettings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const totalExpenses = expenses.reduce((acc, item) => (acc += item.amount), 0);

    // Monthly calculations
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyExpenses = expenses.filter(expense => {
        const date = new Date(expense.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }).reduce((acc, item) => (acc += item.amount), 0);

    // Available Balance Calculation
    const monthlyLimit = settings.monthlyLimit || 0;
    const availableBalance = monthlyLimit - monthlyExpenses;
    const isOverBudget = availableBalance < 0;

    // Daily calculations
    const today = new Date().toDateString();
    const dailyExpenses = expenses.filter(expense => {
        return new Date(expense.date).toDateString() === today;
    }).reduce((acc, item) => (acc += item.amount), 0);

    // Chart Data Preparation
    const categoryData = [];
    expenses.forEach(expense => {
        const existing = categoryData.find(item => item.name === expense.category);
        if (existing) {
            existing.value += expense.amount;
        } else {
            categoryData.push({ name: expense.category, value: expense.amount });
        }
    });

    const COLORS = ['#F472B6', '#38BDF8', '#A78BFA', '#FBBF24', '#34D399', '#FB7185'];

    // Progress
    const monthlyProgress = settings.monthlyLimit > 0 ? (monthlyExpenses / settings.monthlyLimit) * 100 : 0;

    // Custom Tooltip for Recharts
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-800 text-white p-2 rounded-lg shadow-xl border border-slate-700 text-xs">
                    <p>{`${payload[0].name} : ₹${payload[0].value}`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-3xl font-bold mb-6 text-slate-800 pl-1">Overview</h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Card */}
                <div className="p-6 rounded-2xl shadow-lg shadow-indigo-200 card-gradient-1 text-white relative overflow-hidden transition-transform hover:-translate-y-1 duration-300">
                    <div className="absolute top-0 right-0 p-4 opacity-20"><Wallet size={60} /></div>
                    <p className="text-indigo-100 font-medium mb-1 relative z-10">Total Expenses</p>
                    <h3 className="text-3xl font-bold flex items-center relative z-10 mt-2">
                        <IndianRupee size={28} className="mr-1" /> {totalExpenses.toFixed(2)}
                    </h3>
                </div>

                {/* Monthly Card */}
                <div className="p-6 rounded-2xl shadow-lg shadow-emerald-200 card-gradient-2 text-white relative overflow-hidden transition-transform hover:-translate-y-1 duration-300">
                    <div className="absolute top-0 right-0 p-4 opacity-20"><TrendingUp size={60} /></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-emerald-50 font-medium mb-1">Monthly Spending</p>
                                <h3 className="text-3xl font-bold flex items-center mt-1">
                                    <IndianRupee size={24} className="mr-1" /> {monthlyExpenses.toFixed(2)}
                                </h3>
                            </div>
                            <div className="text-right">
                                <p className="text-emerald-50 text-xs mb-1">Available</p>
                                <p className={`font-bold text-lg bg-black/20 px-2 py-0.5 rounded-lg flex items-center ${isOverBudget ? 'text-red-200' : 'text-emerald-50'}`}>
                                    <IndianRupee size={14} className="mr-1" /> {availableBalance.toFixed(2)}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="flex justify-between text-xs text-emerald-100 mb-2 font-medium">
                                <span>{monthlyProgress.toFixed(0)}% Used</span>
                                <span>Limit: ₹{monthlyLimit}</span>
                            </div>
                            <div className="w-full bg-black/20 h-3 rounded-full overflow-hidden backdrop-blur-sm">
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 ${monthlyProgress > 100 ? 'bg-red-400' : 'bg-white'}`}
                                    style={{ width: `${Math.min(monthlyProgress, 100)}%` }}
                                ></div>
                            </div>
                            {isOverBudget && (
                                <p className="text-xs text-red-100 mt-2 font-semibold bg-red-500/20 inline-block px-2 py-1 rounded">
                                    ⚠️ You have exceeded your monthly limit!
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Daily Card */}
                <div className="p-6 rounded-2xl shadow-lg shadow-pink-200 card-gradient-3 text-white relative overflow-hidden transition-transform hover:-translate-y-1 duration-300">
                    <div className="absolute top-0 right-0 p-4 opacity-20"><TrendingDown size={60} /></div>
                    <div className="relative z-10">
                        <p className="text-pink-600 font-medium mb-1">Today's Spending</p>
                        <h3 className="text-3xl font-bold flex items-center mt-2 text-slate-800">
                            <IndianRupee size={28} className="mr-1" /> {dailyExpenses.toFixed(2)}
                        </h3>
                        <p className="text-sm text-slate-500 mt-2 bg-white/50 inline-block px-2 py-1 rounded-lg">
                            Daily Limit: ₹{settings.dailyLimit}
                        </p>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-semibold text-lg text-slate-700 mb-6 pl-2 border-l-4 border-indigo-500">Expenses by Category</h3>
                    <div className="h-72 w-full" style={{ minHeight: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                    cornerRadius={6}
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap gap-3 justify-center mt-2">
                        {categoryData.map((entry, index) => (
                            <div key={index} className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                <span className="text-xs font-medium text-slate-600">{entry.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-semibold text-lg text-slate-700 mb-6 pl-2 border-l-4 border-emerald-500">Spending Overview</h3>
                    <div className="h-72 w-full" style={{ minHeight: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <XAxis dataKey="name" hide />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                <Tooltip cursor={{ fill: '#f1f5f9' }} content={<CustomTooltip />} />
                                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
