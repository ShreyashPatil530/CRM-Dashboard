import React, { useState } from 'react';
import { leadAPI } from '../api/client';
import { useNavigate } from 'react-router-dom';
import { UserPlus, CheckCircle2, AlertCircle } from 'lucide-react';

const AddLead = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        source: 'Website',
        propertyInterest: {
            location: '',
            budget: '',
            roomType: 'Single'
        }
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const sources = ['WhatsApp', 'Website', 'Social Media', 'Phone Call', 'Lead Form', 'Manual Entry'];
    const roomTypes = ['Single', 'Double', 'Triple', 'Studio'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            await leadAPI.create(formData);
            navigate('/leads');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create lead');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-500">
            <div className="text-center">
                <div className="w-16 h-16 bg-gharpayy-yellow rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <UserPlus className="text-black" size={32} />
                </div>
                <h2 className="text-3xl font-bold">Capture New Lead</h2>
                <p className="text-gray-400 mt-2">New leads will be automatically assigned to agents using round-robin.</p>
            </div>

            <form onSubmit={handleSubmit} className="glass p-8 rounded-3xl border border-white/10 space-y-6">
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center gap-2">
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Full Name</label>
                        <input
                            required
                            type="text"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-gharpayy-yellow/50 outline-none transition-all"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Rahul Kumar"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Phone Number</label>
                        <input
                            required
                            type="tel"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-gharpayy-yellow/50 outline-none transition-all"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="e.g. 9876543210"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Lead Source</label>
                    <div className="grid grid-cols-3 gap-3">
                        {sources.map(s => (
                            <button
                                key={s}
                                type="button"
                                className={`py-2 px-3 rounded-xl border text-sm transition-all ${formData.source === s
                                        ? 'bg-gharpayy-yellow/10 border-gharpayy-yellow text-gharpayy-yellow'
                                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                                    }`}
                                onClick={() => setFormData({ ...formData, source: s })}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                <hr className="border-white/5" />

                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-300">Requirement Details (Optional)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Preferred Location</label>
                            <input
                                type="text"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-gharpayy-yellow/50 outline-none transition-all"
                                value={formData.propertyInterest.location}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    propertyInterest: { ...formData.propertyInterest, location: e.target.value }
                                })}
                                placeholder="e.g. HSR Layout"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Budget (INR)</label>
                            <input
                                type="number"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-gharpayy-yellow/50 outline-none transition-all"
                                value={formData.propertyInterest.budget}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    propertyInterest: { ...formData.propertyInterest, budget: e.target.value }
                                })}
                                placeholder="e.g. 15000"
                            />
                        </div>
                    </div>
                </div>

                <button
                    disabled={submitting}
                    type="submit"
                    className="w-full bg-gharpayy-yellow text-black font-bold py-4 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                    {submitting ? 'Creating Lead...' : (
                        <>
                            Capture Lead
                            <CheckCircle2 size={20} className="group-hover:scale-110 transition-transform" />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default AddLead;
