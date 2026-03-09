import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { leadAPI, visitAPI } from '../api/client';
import {
    ChevronLeft,
    MapPin,
    Phone,
    Clock,
    User,
    ArrowRight,
    Plus,
    CheckCircle2,
    Calendar
} from 'lucide-react';
import { format } from 'date-fns';

const LeadDetails = () => {
    const { id } = useParams();
    const [lead, setLead] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showVisitModal, setShowVisitModal] = useState(false);
    const [visitForm, setVisitForm] = useState({
        propertyTitle: '',
        dateTime: '',
        notes: ''
    });

    const stages = ['New Lead', 'Contacted', 'Requirement Collected', 'Property Suggested', 'Visit Scheduled', 'Visit Completed', 'Booked', 'Lost'];

    useEffect(() => {
        fetchLead();
    }, [id]);

    const fetchLead = async () => {
        try {
            const { data } = await leadAPI.getById(id);
            setLead(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        try {
            await leadAPI.updateStatus(id, newStatus, `Moved to ${newStatus}`);
            fetchLead();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const handleScheduleVisit = async (e) => {
        e.preventDefault();
        try {
            await visitAPI.schedule({
                leadId: id,
                agentId: lead.assignedAgent._id,
                ...visitForm
            });
            setShowVisitModal(false);
            fetchLead();
        } catch (err) {
            alert('Failed to schedule visit');
        }
    };

    if (loading) return <div className="p-8">Loading lead details...</div>;
    if (!lead) return <div className="p-8">Lead not found.</div>;

    return (
        <div className="space-y-8 pb-20">
            <Link to="/leads" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                Back to Leads
            </Link>

            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-4 mb-2">
                        <h2 className="text-4xl font-bold">{lead.name}</h2>
                        <span className="bg-primary-500/10 text-primary-500 text-xs font-bold px-3 py-1 rounded-full border border-primary-500/20">
                            {lead.source}
                        </span>
                    </div>
                    <div className="flex gap-6 text-gray-400">
                        <span className="flex items-center gap-2"><Phone size={16} /> {lead.phone}</span>
                        <span className="flex items-center gap-2"><Clock size={16} /> Last active: {format(new Date(lead.lastInteraction), 'MMM dd, HH:mm')}</span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowVisitModal(true)}
                        className="bg-white/5 border border-white/10 px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-white/10 transition-all"
                    >
                        <Calendar size={18} />
                        Schedule Visit
                    </button>
                    <button className="bg-gharpayy-yellow text-black px-6 py-2.5 rounded-xl font-bold hover:opacity-90 transition-all">
                        Edit Lead
                    </button>
                </div>
            </div>

            {/* Pipeline Progress */}
            <div className="glass p-6 rounded-3xl border border-white/10">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">Pipeline Progress</h3>
                <div className="relative flex justify-between">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/5 -translate-y-1/2 z-0"></div>
                    {stages.map((stage, i) => {
                        const isCurrent = lead.status === stage;
                        const isCompleted = stages.indexOf(lead.status) > stages.indexOf(stage);

                        return (
                            <div key={stage} className="relative z-10 flex flex-col items-center gap-2 group">
                                <button
                                    onClick={() => handleStatusUpdate(stage)}
                                    disabled={isCurrent || isCompleted}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${isCurrent
                                            ? 'bg-gharpayy-yellow border-gharpayy-yellow text-black shadow-[0_0_15px_rgba(255,215,0,0.3)]'
                                            : isCompleted
                                                ? 'bg-green-500 border-green-500 text-white'
                                                : 'bg-[#0c0c0c] border-white/10 text-gray-500 hover:border-white/30'
                                        }`}
                                >
                                    {isCompleted ? <CheckCircle2 size={20} /> : (i + 1)}
                                </button>
                                <span className={`text-[10px] absolute -bottom-8 font-medium whitespace-nowrap ${isCurrent ? 'text-gharpayy-yellow' : 'text-gray-500'}`}>
                                    {stage}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
                {/* Activity Timeline */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass p-8 rounded-3xl border border-white/10">
                        <h3 className="text-xl font-bold mb-8">Activity Timeline</h3>
                        <div className="space-y-8">
                            {lead.timeline.slice().reverse().map((event, i) => (
                                <div key={i} className="flex gap-6 relative">
                                    {i !== lead.timeline.length - 1 && (
                                        <div className="absolute left-[21px] top-10 w-0.5 h-full bg-white/5"></div>
                                    )}
                                    <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                        <div className="w-2.5 h-2.5 rounded-full bg-gharpayy-yellow"></div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-bold text-gray-200">{event.action}</p>
                                        <p className="text-sm text-gray-400">{event.details}</p>
                                        <div className="flex gap-4 mt-2">
                                            <span className="text-xs text-gray-500 flex items-center gap-1"><User size={12} /> {event.performedBy}</span>
                                            <span className="text-xs text-gray-500 flex items-center gap-1"><Clock size={12} /> {format(new Date(event.timestamp), 'MMM dd, HH:mm')}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Lead Info Sidebar */}
                <div className="space-y-6">
                    <div className="glass p-6 rounded-3xl border border-white/10">
                        <h3 className="font-bold text-lg mb-6">Assigned Agent</h3>
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-primary-600 flex items-center justify-center text-white text-xl font-bold">
                                {lead.assignedAgent?.name?.[0]}
                            </div>
                            <div>
                                <p className="font-bold text-white">{lead.assignedAgent?.name}</p>
                                <p className="text-sm text-gray-400">{lead.assignedAgent?.role || 'Agent'}</p>
                            </div>
                        </div>
                        <button className="w-full mt-6 py-3 rounded-xl border border-white/10 text-sm font-semibold hover:bg-white/5 transition-all">
                            Change Agent
                        </button>
                    </div>

                    <div className="glass p-6 rounded-3xl border border-white/10">
                        <h3 className="font-bold text-lg mb-6">Requirements</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">Location</span>
                                <span className="font-medium">{lead.propertyInterest?.location || 'Not specified'}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">Budget</span>
                                <span className="font-medium">{lead.propertyInterest?.budget ? `₹${lead.propertyInterest.budget}` : 'Not specified'}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">Room Type</span>
                                <span className="font-medium">{lead.propertyInterest?.roomType || 'Not specified'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Visit Modal */}
            {showVisitModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass w-full max-w-md p-8 rounded-3xl border border-white/10 animate-in zoom-in duration-300">
                        <h3 className="text-2xl font-bold mb-6">Schedule Property Visit</h3>
                        <form onSubmit={handleScheduleVisit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Property Title</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-gharpayy-yellow/50 outline-none"
                                    placeholder="e.g. Sterling Heights HSR"
                                    value={visitForm.propertyTitle}
                                    onChange={(e) => setVisitForm({ ...visitForm, propertyTitle: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Date & Time</label>
                                <input
                                    required
                                    type="datetime-local"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-gharpayy-yellow/50 outline-none"
                                    value={visitForm.dateTime}
                                    onChange={(e) => setVisitForm({ ...visitForm, dateTime: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Notes (Optional)</label>
                                <textarea
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-gharpayy-yellow/50 outline-none min-h-[100px]"
                                    placeholder="Any special requests..."
                                    value={visitForm.notes}
                                    onChange={(e) => setVisitForm({ ...visitForm, notes: e.target.value })}
                                ></textarea>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowVisitModal(false)} className="flex-1 py-3 rounded-xl border border-white/10 hover:bg-white/5 font-semibold">Cancel</button>
                                <button type="submit" className="flex-1 py-3 rounded-xl bg-gharpayy-yellow text-black font-bold">Schedule</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeadDetails;
