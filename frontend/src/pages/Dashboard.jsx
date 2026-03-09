import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../api/client';
import { Link } from 'react-router-dom';
import {
    Users,
    Target,
    CalendarCheck,
    BadgeCheck,
    TrendingUp,
    ArrowUpRight
} from 'lucide-react';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, remindersRes] = await Promise.all([
                    dashboardAPI.getStats(),
                    dashboardAPI.getReminders()
                ]);
                setStats(statsRes.data);
                setReminders(remindersRes.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();

    }, []);

    if (loading) return <div className="p-8 text-center">Loading stats...</div>;

    const statusData = stats?.leadsByStatus.map(s => ({ name: s._id, value: s.count })) || [];
    const sourceData = stats?.leadsBySource.map(s => ({ name: s._id, value: s.count })) || [];

    const COLORS = ['#FFD700', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

    const statCards = [
        { label: 'Total Leads', value: stats?.totalLeads, icon: Users, color: 'text-blue-500' },
        { label: 'Scheduled Visits', value: stats?.scheduledVisits, icon: Target, color: 'text-yellow-500' },
        { label: 'Visits Completed', value: stats?.completedVisits, icon: CalendarCheck, color: 'text-green-500' },
        { label: 'Total Bookings', value: stats?.totalBookings, icon: BadgeCheck, color: 'text-purple-500' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <header className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Main Dashboard</h2>
                    <p className="text-gray-400 mt-1">Gharpayy Lead Performance Overview</p>
                </div>
                <div className="text-sm text-gray-500 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                    Last Updated: {new Date().toLocaleTimeString()}
                </div>
            </header>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
                    <div key={i} className="glass p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-400">{stat.label}</p>
                                <h3 className="text-3xl font-bold mt-2">{stat.value || 0}</h3>
                            </div>
                            <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-xs text-green-400">
                            <TrendingUp size={14} className="mr-1" />
                            <span>+12% from last week</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts & Reminders */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass p-8 rounded-2xl border border-white/10">
                    <h3 className="text-xl font-semibold mb-6">Leads by Status</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={statusData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="value" fill="#FFD700" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass p-8 rounded-2xl border border-white/10 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold">High Priority Follow-ups</h3>
                        <span className="bg-red-500/10 text-red-500 text-xs px-2 py-1 rounded-full border border-red-500/20">Needs Attention</span>
                    </div>
                    <div className="space-y-4 flex-1 overflow-auto">
                        {reminders.length > 0 ? reminders.map((lead) => (
                            <Link
                                to={`/leads/${lead._id}`}
                                key={lead._id}
                                className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-gharpayy-yellow/30 transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gharpayy-yellow/10 flex items-center justify-center text-gharpayy-yellow font-bold">
                                        {lead.name[0]}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm group-hover:text-gharpayy-yellow transition-colors">{lead.name}</p>
                                        <p className="text-xs text-gray-500">Last touch: {new Date(lead.lastInteraction).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-semibold text-gray-400">{lead.status}</p>
                                    <ArrowUpRight size={14} className="text-gray-600 inline-block mt-1 group-hover:text-gharpayy-yellow transition-colors" />
                                </div>
                            </Link>
                        )) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-500 text-sm py-10">
                                <BadgeCheck size={40} className="mb-2 opacity-20" />
                                <p>All caught up! No pending follow-ups.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="glass p-8 rounded-2xl border border-white/10 lg:col-span-2">
                    <h3 className="text-xl font-semibold mb-6">Source Analytics</h3>
                    <div className="h-80 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={sourceData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {sourceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="mt-4 flex flex-wrap gap-4 justify-center">
                            {sourceData.map((entry, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                    <span className="text-xs text-gray-400">{entry.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
