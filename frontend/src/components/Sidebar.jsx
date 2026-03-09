import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    UserPlus,
    Calendar,
    BarChart3,
    Settings,
    Home
} from 'lucide-react';

const Sidebar = () => {
    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Users, label: 'Leads', path: '/leads' },
        { icon: UserPlus, label: 'Add Lead', path: '/add-lead' },
        { icon: Calendar, label: 'Visits', path: '/visits' },
    ];

    return (
        <div className="w-64 h-screen bg-gharpayy-dark border-r border-white/10 flex flex-col p-6 fixed">
            <div className="flex items-center gap-3 mb-10 px-2">
                <div className="w-10 h-10 bg-gharpayy-yellow rounded-lg flex items-center justify-center">
                    <Home className="text-black" size={24} />
                </div>
                <h1 className="text-xl font-bold text-white tracking-tight">Gharpayy CRM</h1>
            </div>

            <nav className="flex-1 space-y-2">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                ? 'bg-gharpayy-yellow text-black font-semibold'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`
                        }
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-white/10 px-2">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">
                        AD
                    </div>
                    <div>
                        <p className="text-sm font-medium text-white">Admin User</p>
                        <p className="text-xs text-gray-500">Administrator</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
