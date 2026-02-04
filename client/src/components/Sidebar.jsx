import React from 'react';
import { LayoutDashboard, Wallet, PieChart, Settings, FileText } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
        { name: 'Expenses', icon: Wallet, path: '/expenses' },
        { name: 'Reports', icon: FileText, path: '/reports' },
        { name: 'Settings', icon: Settings, path: '/settings' },
    ];

    return (
        <aside className="w-64 bg-slate-900 text-white min-h-screen p-6 hidden md:block relative overflow-hidden">
            {/* Gradient Background Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-[#1e1b4b] to-[#0f172a] opacity-90 z-0"></div>

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-10 pl-2">
                    <div className="p-2 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-lg shadow-lg shadow-blue-500/30">
                        <PieChart className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        FinTrack
                    </h1>
                </div>
                <nav>
                    <ul className="space-y-3">
                        {navItems.map((item) => (
                            <li key={item.name}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 p-3.5 rounded-xl transition-all duration-300 group ${isActive
                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 translate-x-1'
                                            : 'text-slate-400 hover:bg-slate-800/50 hover:text-white hover:translate-x-1'
                                        }`
                                    }
                                >
                                    <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                                    <span className="font-medium">{item.name}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;
