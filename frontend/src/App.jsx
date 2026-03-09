import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import AddLead from './pages/AddLead';
import LeadDetails from './pages/LeadDetails';
import Visits from './pages/Visits';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/add-lead" element={<AddLead />} />
          <Route path="/leads/:id" element={<LeadDetails />} />
          <Route path="/visits" element={<Visits />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
