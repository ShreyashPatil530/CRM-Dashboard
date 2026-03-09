import React, { useState, useEffect } from 'react';
import { visitAPI } from '../api/client';
import {
    Calendar,
    MapPin,
    User,
    Clock,
    CheckCircle2,
    XCircle,
    MoreVertical
} from 'lucide-react';
import { format } from 'date-fns';

const Visits = () => {
    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVisits();
    }, []);

    const fetchVisits = async () => {
        try {
            const { data } = await visitAPI.getAll();
            setVisits(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOutcomeUpdate = async (id, outcome) => {
        try {
            await visitAPI.updateOutcome(id, outcome, `Visit marked as ${outcome}`);
            fetchVisits();
        } catch (err) {
            alert('Failed to update visit');
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Property Visits</h2>
                <p className="text-gray-400 mt-1">Schedule and manage on-site property visits</p>
            </div>

            {loading ? (
                <div className="p-8 text-center">Loading visits...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {visits.map((visit) => (
                        <div key={visit._id} className="glass p-6 rounded-3xl border border-white/10 group flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-gharpayy-yellow/10 p-3 rounded-2xl">
                                        <Calendar className="text-gharpayy-yellow" size={24} />
                                    </div>
                                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${visit.outcome === 'Completed' ? 'bg-green-500/10 text-green-500' :
                                            visit.outcome === 'Scheduled' ? 'bg-blue-500/10 text-blue-500' :
                                                'bg-red-500/10 text-red-500'
                                        }`}>
                                        {visit.outcome}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2">{visit.propertyTitle}</h3>

                                <div className="space-y-3 mt-6">
                                    <div className="flex items-center gap-3 text-sm text-gray-400">
                                        <User size={16} className="text-gray-600" />
                                        <span>Lead: <span className="text-gray-200 font-medium">{visit.leadId?.name}</span></span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-400">
                                        <Clock size={16} className="text-gray-600" />
                                        <span>{format(new Date(visit.dateTime), 'PPP p')}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-400">
                                        <User size={16} className="text-gray-600" />
                                        <span>Agent: <span className="text-gray-200">{visit.agentId?.name}</span></span>
                                    </div>
                                </div>

                                {visit.notes && (
                                    <p className="mt-4 text-xs text-gray-500 italic border-l-2 border-white/5 pl-3">
                                        "{visit.notes}"
                                    </p>
                                )}
                            </div>

                            {visit.outcome === 'Scheduled' && (
                                <div className="mt-8 flex gap-3 pt-6 border-t border-white/5">
                                    <button
                                        onClick={() => handleOutcomeUpdate(visit._id, 'Completed')}
                                        className="flex-1 bg-green-500/10 border border-green-500/20 text-green-500 py-2 rounded-xl text-xs font-bold hover:bg-green-500 hover:text-white transition-all flex items-center justify-center gap-1"
                                    >
                                        <CheckCircle2 size={14} /> Mark Completed
                                    </button>
                                    <button
                                        onClick={() => handleOutcomeUpdate(visit._id, 'No Show')}
                                        className="flex-1 bg-red-500/10 border border-red-500/20 text-red-500 py-2 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-1"
                                    >
                                        <XCircle size={14} /> No Show
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                    {visits.length === 0 && (
                        <div className="col-span-full border-2 border-dashed border-white/5 rounded-3xl p-20 text-center">
                            <Calendar className="mx-auto text-gray-700 mb-4" size={48} />
                            <p className="text-gray-500">No visits scheduled yet.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Visits;
