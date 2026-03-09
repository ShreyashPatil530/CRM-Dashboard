import React, { useState, useEffect } from 'react';
import { leadAPI } from '../api/client';
import {
    Search,
    Filter,
    MoreVertical,
    Phone,
    Calendar,
    ChevronRight,
    ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const statusColors = {
    'New Lead': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'Contacted': 'bg-teal-500/10 text-teal-500 border-teal-500/20',
    'Requirement Collected': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    'Property Suggested': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    'Visit Scheduled': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    'Visit Completed': 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    'Booked': 'bg-green-500/10 text-green-500 border-green-500/20',
    'Lost': 'bg-red-500/10 text-red-500 border-red-500/20',
};

const Leads = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            const { data } = await leadAPI.getAll();
            setLeads(data);
        } catch (error) {
            console.error('Error fetching leads:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredLeads = leads.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm)
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Leads</h2>
                    <p className="text-gray-400 mt-1">Manage and track your customer pipeline</p>
                </div>
                <Link to="/add-lead" className="bg-gharpayy-yellow text-black px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-all">
                    <ChevronRight size={20} />
                    Create New Lead
                </Link>
            </div>

            <div className="flex gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or phone..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-gharpayy-yellow/50 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="glass px-4 rounded-xl border border-white/10 flex items-center gap-2 text-gray-400 hover:text-white transition-all">
                    <Filter size={18} />
                    Filters
                </button>
            </div>

            <div className="glass rounded-2xl border border-white/10 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/10">
                            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Lead</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Source</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Assigned Agent</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Created</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr><td colSpan="6" className="text-center py-10 text-gray-500">Loading leads...</td></tr>
                        ) : filteredLeads.map((lead) => (
                            <tr key={lead._id} className="hover:bg-white/5 transition-all group">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-white group-hover:text-gharpayy-yellow transition-colors flex items-center gap-2">
                                            {lead.name}
                                            {new Date() - new Date(lead.lastInteraction) > 86400000 && (
                                                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" title="Follow-up Required"></span>
                                            )}
                                        </span>
                                        <span className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                            <Phone size={12} /> {lead.phone}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[lead.status]}`}>
                                        {lead.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-300 text-sm">
                                    {lead.source}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-primary-900 flex items-center justify-center text-[10px] font-bold">
                                            {lead.assignedAgent?.name?.split(' ').map(n => n[0]).join('') || '?'}
                                        </div>
                                        <span className="text-sm text-gray-300">{lead.assignedAgent?.name || 'Unassigned'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-500 text-sm">
                                    {format(new Date(lead.createdAt), 'MMM dd, yyyy')}
                                </td>
                                <td className="px-6 py-4">
                                    <Link to={`/leads/${lead._id}`} className="p-2 hover:bg-white/10 rounded-lg transition-all inline-block text-gray-400 hover:text-white">
                                        <ExternalLink size={18} />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Leads;
