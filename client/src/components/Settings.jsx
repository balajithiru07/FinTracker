import React, { useState, useContext, useEffect } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { Save } from 'lucide-react';

const Settings = () => {
    const { settings, updateSettings, getSettings } = useContext(GlobalContext);

    const [monthlyLimit, setMonthlyLimit] = useState(0);
    const [dailyLimit, setDailyLimit] = useState(0);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        getSettings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (settings) {
            setMonthlyLimit(settings.monthlyLimit);
            setDailyLimit(settings.dailyLimit);
        }
    }, [settings]);

    const onSubmit = (e) => {
        e.preventDefault();
        updateSettings({
            monthlyLimit: +monthlyLimit,
            dailyLimit: +dailyLimit
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-6">Settings</h2>
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 max-w-2xl">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="font-semibold text-lg">Spending Limits</h3>
                    <p className="text-sm text-slate-500">Set your budget goals to track progress.</p>
                </div>
                <form onSubmit={onSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Monthly Spending Limit</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2 text-slate-400">₹</span>
                            <input
                                type="number"
                                value={monthlyLimit}
                                onChange={(e) => setMonthlyLimit(e.target.value)}
                                className="w-full pl-8 border rounded-lg p-2"
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Daily Spending Limit</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2 text-slate-400">₹</span>
                            <input
                                type="number"
                                value={dailyLimit}
                                onChange={(e) => setDailyLimit(e.target.value)}
                                className="w-full pl-8 border rounded-lg p-2"
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button type="submit" className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
                            <Save size={20} /> Save Changes
                        </button>
                        {saved && <span className="text-green-600 text-sm font-medium">Settings saved successfully!</span>}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Settings;
