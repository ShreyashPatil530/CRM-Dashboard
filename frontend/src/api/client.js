import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const client = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const leadAPI = {
    getAll: () => client.get('/leads'),
    getById: (id) => client.get(`/leads/${id}`),
    create: (data) => client.post('/leads', data),
    update: (id, data) => client.put(`/leads/${id}`, data),
    updateStatus: (id, status, note) => client.patch(`/leads/${id}/status`, { status, note }),
};

export const agentAPI = {
    getAll: () => client.get('/agents'),
    create: (data) => client.post('/agents', data),
};

export const visitAPI = {
    getAll: () => client.get('/visits'),
    schedule: (data) => client.post('/visits', data),
    updateOutcome: (id, outcome, notes) => client.patch(`/visits/${id}/outcome`, { outcome, notes }),
};

export const dashboardAPI = {
    getStats: () => client.get('/dashboard/stats'),
    getReminders: () => client.get('/dashboard/reminders'),

};

export default client;
