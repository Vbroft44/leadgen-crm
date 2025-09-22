import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  Mail, 
  Calendar, 
  Clock,
  Plus,
  Bell,
  User,
  MapPin,
  Edit3,
  BarChart3,
  Home,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  RotateCcw
} from 'lucide-react';

const LeadGenCRM = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddLead, setShowAddLead] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  
  const statusOptions = [
    { value: 'new', label: 'New Lead', color: 'bg-blue-500', textColor: 'text-white' },
    { value: 'waiting-customer', label: 'Waiting for Customer', color: 'bg-yellow-500', textColor: 'text-white' },
    { value: 'waiting-tech', label: 'Waiting for Technician', color: 'bg-orange-500', textColor: 'text-white' },
    { value: 'booked', label: 'Appointment Booked', color: 'bg-green-500', textColor: 'text-white' },
    { value: 'completed', label: 'Completed', color: 'bg-gray-600', textColor: 'text-white' },
    { value: 'canceled', label: 'Canceled', color: 'bg-red-500', textColor: 'text-white' },
    { value: 'rescheduled', label: 'Rescheduled', color: 'bg-purple-500', textColor: 'text-white' }
  ];

  const technicians = [
    'Mike Johnson - HVAC',
    'Sarah Wilson - Plumbing', 
    'David Brown - Electrical',
    'Lisa Davis - General Repair',
    'Tom Anderson - Roofing'
  ];

  const [leads, setLeads] = useState([
    {
      id: 1,
      customerName: 'John Smith',
      phone: '(555) 123-4567',
      email: 'john.smith@email.com',
      address: '123 Oak Street, Denver, CO 80202',
      serviceNeeded: 'HVAC Repair',
      status: 'new',
      dateAdded: new Date('2024-01-20T10:30:00'),
      appointmentDate: null,
      appointmentTime: '',
      technician: '',
      notes: 'Air conditioner not cooling properly. Customer mentioned strange noises.',
      lastUpdated: new Date('2024-01-20T10:30:00')
    },
    {
      id: 2,
      customerName: 'Maria Garcia',
      phone: '(555) 234-5678',
      email: 'maria.garcia@email.com',
      address: '456 Pine Avenue, Boulder, CO 80301',
      serviceNeeded: 'Plumbing',
      status: 'waiting-customer',
      dateAdded: new Date('2024-01-20T09:15:00'),
      appointmentDate: null,
      appointmentTime: '',
      technician: '',
      notes: 'Kitchen sink leak under cabinet. Needs quote first.',
      lastUpdated: new Date('2024-01-20T11:45:00')
    },
    {
      id: 3,
      customerName: 'Robert Johnson',
      phone: '(555) 345-6789',
      email: 'rob.johnson@email.com',
      address: '789 Elm Drive, Lakewood, CO 80226',
      serviceNeeded: 'Electrical',
      status: 'booked',
      dateAdded: new Date('2024-01-19T14:20:00'),
      appointmentDate: '2024-01-22',
      appointmentTime: '10:00 AM',
      technician: 'David Brown - Electrical',
      notes: 'Outlet not working in master bedroom. Safety concern.',
      lastUpdated: new Date('2024-01-20T08:30:00')
    },
    {
      id: 4,
      customerName: 'Jennifer Lee',
      phone: '(555) 456-7890',
      email: 'jen.lee@email.com',
      address: '321 Maple Lane, Aurora, CO 80012',
      serviceNeeded: 'Roofing',
      status: 'completed',
      dateAdded: new Date('2024-01-18T16:45:00'),
      appointmentDate: '2024-01-20',
      appointmentTime: '9:00 AM',
      technician: 'Tom Anderson - Roofing',
      notes: 'Roof inspection after hail storm. Minor repairs completed.',
      lastUpdated: new Date('2024-01-20T15:30:00')
    }
  ]);

  const [newLead, setNewLead] = useState({
    customerName: '',
    phone: '',
    email: '',
    address: '',
    serviceNeeded: '',
    notes: ''
  });

  // Get leads by status
  const getLeadsByStatus = (status) => leads.filter(lead => lead.status === status);
  
  // Get status info
  const getStatusInfo = (status) => statusOptions.find(s => s.value === status);

  // Check if lead needs reminder (older than 2 hours and not completed/canceled)
  const needsReminder = (lead) => {
    if (lead.status === 'completed' || lead.status === 'canceled') return false;
    const hoursOld = (new Date() - new Date(lead.lastUpdated)) / (1000 * 60 * 60);
    return hoursOld > 2;
  };

  // Get active leads count
  const getActiveLeadsCount = () => {
    return leads.filter(lead => 
      lead.status !== 'completed' && lead.status !== 'canceled'
    ).length;
  };

  // Handle status change
  const handleStatusChange = (leadId, newStatus) => {
    setLeads(leads.map(lead => 
      lead.id === leadId 
        ? { ...lead, status: newStatus, lastUpdated: new Date() }
        : lead
    ));
  };

  // Handle lead update
  const handleLeadUpdate = (leadId, updates) => {
    setLeads(leads.map(lead => 
      lead.id === leadId 
        ? { ...lead, ...updates, lastUpdated: new Date() }
        : lead
    ));
    setSelectedLead(null);
  };

  // Add new lead
  const handleAddLead = () => {
    if (newLead.customerName && newLead.phone && newLead.serviceNeeded) {
      const lead = {
        ...newLead,
        id: Math.max(...leads.map(l => l.id)) + 1,
        status: 'new',
        dateAdded: new Date(),
        lastUpdated: new Date(),
        appointmentDate: null,
        appointmentTime: '',
        technician: ''
      };
      setLeads([lead, ...leads]);
      setNewLead({
        customerName: '',
        phone: '',
        email: '',
        address: '',
        serviceNeeded: '',
        notes: ''
      });
      setShowAddLead(false);
    }
  };

  // Analytics calculations
  const getAnalytics = () => {
    const today = new Date().toDateString();
    const todayLeads = leads.filter(lead => 
      new Date(lead.dateAdded).toDateString() === today
    );
    
    return {
      totalToday: todayLeads.length,
      bookedToday: todayLeads.filter(l => l.status === 'booked').length,
      completedToday: leads.filter(l => 
        l.status === 'completed' && 
        new Date(l.lastUpdated).toDateString() === today
      ).length,
      canceledToday: todayLeads.filter(l => l.status === 'canceled').length,
      activeLeads: getActiveLeadsCount()
    };
  };

  const analytics = getAnalytics();

  // Lead Card Component
  const LeadCard = ({ lead }) => {
    const statusInfo = getStatusInfo(lead.status);
    const hasReminder = needsReminder(lead);
    
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg transition-shadow relative">
        {hasReminder && (
          <div className="absolute top-2 right-2">
            <Bell className="w-4 h-4 text-red-500 animate-pulse" />
          </div>
        )}
        
        <div className="space-y-3">
          {/* Customer Info */}
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{lead.customerName}</h3>
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Phone className="w-3 h-3" />
              <span>{lead.phone}</span>
            </div>
            {lead.email && (
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <Mail className="w-3 h-3" />
                <span>{lead.email}</span>
              </div>
            )}
          </div>

          {/* Service & Address */}
          <div>
            <p className="font-medium text-gray-800">{lead.serviceNeeded}</p>
            {lead.address && (
              <div className="flex items-start space-x-1 text-sm text-gray-600">
                <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-2">{lead.address}</span>
              </div>
            )}
          </div>

          {/* Appointment Info */}
          {lead.appointmentDate && (
            <div className="bg-green-50 p-2 rounded">
              <div className="flex items-center space-x-1 text-sm text-green-800">
                <Calendar className="w-3 h-3" />
                <span>{lead.appointmentDate} at {lead.appointmentTime}</span>
              </div>
              {lead.technician && (
                <div className="flex items-center space-x-1 text-sm text-green-800">
                  <User className="w-3 h-3" />
                  <span>{lead.technician}</span>
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          {lead.notes && (
            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded line-clamp-2">
              {lead.notes}
            </p>
          )}

          {/* Status Dropdown & Edit */}
          <div className="flex items-center justify-between pt-2">
            <select
              value={lead.status}
              onChange={(e) => handleStatusChange(lead.id, e.target.value)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo?.color} ${statusInfo?.textColor} border-none cursor-pointer`}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value} className="text-gray-900">
                  {option.label}
                </option>
              ))}
            </select>
            
            <button
              onClick={() => setSelectedLead(lead)}
              className="text-gray-400 hover:text-blue-500 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>

          {/* Time info */}
          <div className="text-xs text-gray-400 flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>Added {new Date(lead.dateAdded).toLocaleString()}</span>
          </div>
        </div>
      </div>
    );
  };

  // Navigation
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'new', label: 'New Leads', icon: AlertCircle, count: getLeadsByStatus('new').length },
    { id: 'waiting-customer', label: 'Waiting for Customer', icon: Phone, count: getLeadsByStatus('waiting-customer').length },
    { id: 'waiting-tech', label: 'Waiting for Tech', icon: Users, count: getLeadsByStatus('waiting-tech').length },
    { id: 'booked', label: 'Appointment Booked', icon: Calendar, count: getLeadsByStatus('booked').length },
    { id: 'rescheduled', label: 'Rescheduled', icon: RotateCcw, count: getLeadsByStatus('rescheduled').length },
    { id: 'completed', label: 'Completed', icon: CheckCircle, count: getLeadsByStatus('completed').length },
    { id: 'canceled', label: 'Canceled', icon: XCircle, count: getLeadsByStatus('canceled').length },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Lead Generation CRM</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Bell className="w-4 h-4" />
                <span>{leads.filter(needsReminder).length} reminders</span>
              </div>
              
              <button
                onClick={() => setShowAddLead(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Lead</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex space-x-6">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg shadow-sm border p-4">
              <ul className="space-y-2">
                {navItems.map(item => {
                  const Icon = item.icon;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          activeTab === item.id
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                        {item.count !== undefined && item.count > 0 && (
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            activeTab === item.id ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-600'
                          }`}>
                            {item.count}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <div className="text-2xl font-bold text-blue-600">{analytics.totalToday}</div>
                    <div className="text-sm text-gray-600">New Today</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <div className="text-2xl font-bold text-green-600">{analytics.bookedToday}</div>
                    <div className="text-sm text-gray-600">Booked Today</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <div className="text-2xl font-bold text-gray-600">{analytics.completedToday}</div>
                    <div className="text-sm text-gray-600">Completed Today</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <div className="text-2xl font-bold text-red-600">{analytics.canceledToday}</div>
                    <div className="text-sm text-gray-600">Canceled Today</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <div className="text-2xl font-bold text-orange-600">{analytics.activeLeads}</div>
                    <div className="text-sm text-gray-600">Active Leads</div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Leads</h2>
                  </div>
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {leads.slice(0, 6).map(lead => (
                      <LeadCard key={lead.id} lead={lead} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold text-gray-900">Analytics Dashboard</h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">{analytics.totalToday}</div>
                      <div className="text-gray-600">New Leads Today</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{analytics.bookedToday}</div>
                      <div className="text-gray-600">Appointments Booked Today</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-600">{analytics.completedToday}</div>
                      <div className="text-gray-600">Jobs Completed Today</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600">{analytics.activeLeads}</div>
                      <div className="text-gray-600">Active Leads in Pipeline</div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Pipeline Overview</h3>
                    <div className="space-y-3">
                      {statusOptions.filter(status => status.value !== 'completed' && status.value !== 'canceled').map(status => {
                        const count = getLeadsByStatus(status.value).length;
                        return (
                          <div key={status.value} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                            <span className="font-medium">{status.label}</span>
                            <span className={`px-3 py-1 rounded-full text-white text-sm ${status.color}`}>
                              {count} leads
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Status-specific pages */}
            {activeTab !== 'dashboard' && activeTab !== 'analytics' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {statusOptions.find(s => s.value === activeTab)?.label || 'Leads'}
                  </h2>
                  <div className="text-sm text-gray-500">
                    {getLeadsByStatus(activeTab).length} leads
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {getLeadsByStatus(activeTab).map(lead => (
                    <LeadCard key={lead.id} lead={lead} />
                  ))}
                </div>
                
                {getLeadsByStatus(activeTab).length === 0 && (
                  <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                    <div className="text-gray-400 mb-4">
                      <AlertCircle className="w-12 h-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
                    <p className="text-gray-500">There are no leads in this status yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Lead Modal */}
      {showAddLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Lead</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
                <input
                  type="text"
                  value={newLead.customerName}
                  onChange={(e) => setNewLead({...newLead, customerName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input
                  type="tel"
                  value={newLead.phone}
                  onChange={(e) => setNewLead({...newLead, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newLead.email}
                  onChange={(e) => setNewLead({...newLead, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Needed *</label>
                <input
                  type="text"
                  value={newLead.serviceNeeded}
                  onChange={(e) => setNewLead({...newLead, serviceNeeded: e.target.value})}
                  placeholder="e.g. HVAC Repair, Plumbing, Electrical"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  value={newLead.address}
                  onChange={(e) => setNewLead({...newLead, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={newLead.notes}
                  onChange={(e) => setNewLead({...newLead, notes: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddLead(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddLead}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Lead
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Lead Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-screen overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Lead</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                <input
                  type="text"
                  value={selectedLead.customerName}
                  onChange={(e) => setSelectedLead({...selectedLead, customerName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={selectedLead.phone}
                  onChange={(e) => setSelectedLead({...selectedLead, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={selectedLead.email}
                  onChange={(e) => setSelectedLead({...selectedLead, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Needed</label>
                <input
                  type="text"
                  value={selectedLead.serviceNeeded}
                  onChange={(e) => setSelectedLead({...selectedLead, serviceNeeded: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  value={selectedLead.address}
                  onChange={(e) => setSelectedLead({...selectedLead, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Technician</label>
                <select
                  value={selectedLead.technician}
                  onChange={(e) => setSelectedLead({...selectedLead, technician: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Technician</option>
                  {technicians.map(tech => (
                    <option key={tech} value={tech}>{tech}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Date</label>
                <input
                  type="date"
                  value={selectedLead.appointmentDate || ''}
                  onChange={(e) => setSelectedLead({...selectedLead, appointmentDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Time</label>
                <input
                  type="time"
                  value={selectedLead.appointmentTime}
                  onChange={(e) => setSelectedLead({...selectedLead, appointmentTime: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={selectedLead.notes}
                  onChange={(e) => setSelectedLead({...selectedLead, notes: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={selectedLead.status}
                  onChange={(e) => setSelectedLead({...selectedLead, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleLeadUpdate(selectedLead.id, selectedLead)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadGenCRM;
