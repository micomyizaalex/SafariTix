import React, { useState } from 'react';
import '../style/ManageBuses.css';

function ManageBuses() {
  const [showModal, setShowModal] = useState(false);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDriver, setFilterDriver] = useState('all');
  const [filterSeats, setFilterSeats] = useState('all');
  const [sortBy, setSortBy] = useState('id');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data - in real app, this would come from API
  const [buses, setBuses] = useState([
    { id: 'BUS001', plate: 'RAB-123A', name: 'City Express', driver: 'John M.', status: 'active', seats: 50, lastService: '2024-01-15' },
    { id: 'BUS002', plate: 'RAB-456B', name: 'Comfort Plus', driver: 'Sarah K.', status: 'maintenance', seats: 45, lastService: '2024-01-10' },
    { id: 'BUS003', plate: 'RAB-789C', name: 'Luxury Coach', driver: 'Peter L.', status: 'active', seats: 60, lastService: '2024-01-12' },
    { id: 'BUS004', plate: 'RAB-321D', name: 'Metro Bus', driver: 'Alice R.', status: 'inactive', seats: 40, lastService: '2024-01-08' },
    { id: 'BUS005', plate: 'RAB-654E', name: 'Express Line', driver: 'David M.', status: 'active', seats: 55, lastService: '2024-01-14' },
    { id: 'BUS006', plate: 'RAB-987F', name: 'City Cruiser', driver: 'Grace T.', status: 'maintenance', seats: 50, lastService: '2024-01-09' }
  ]);

  const [formData, setFormData] = useState({
    plate: '',
    name: '',
    seats: '',
    driver: '',
    status: 'active'
  });

  const [driverFormData, setDriverFormData] = useState({
    busId: '',
    driver: ''
  });

  const drivers = ['John M.', 'Sarah K.', 'Peter L.', 'Alice R.', 'David M.', 'Grace T.', 'Michael B.', 'Lisa W.'];

  // Calculate summary stats
  const totalBuses = buses.length;
  const activeBuses = buses.filter(bus => bus.status === 'active').length;
  const inactiveBuses = buses.filter(bus => bus.status === 'inactive').length;
  const maintenanceBuses = buses.filter(bus => bus.status === 'maintenance').length;

  // Filter and sort buses
  const filteredBuses = buses
    .filter(bus => {
      const matchesSearch = bus.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          bus.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          bus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          bus.driver.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || bus.status === filterStatus;
      const matchesDriver = filterDriver === 'all' || bus.driver === filterDriver;
      const matchesSeats = filterSeats === 'all' || 
                          (filterSeats === 'small' && bus.seats < 45) ||
                          (filterSeats === 'medium' && bus.seats >= 45 && bus.seats < 55) ||
                          (filterSeats === 'large' && bus.seats >= 55);
      
      return matchesSearch && matchesStatus && matchesDriver && matchesSeats;
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'plate': return a.plate.localeCompare(b.plate);
        case 'name': return a.name.localeCompare(b.name);
        case 'seats': return b.seats - a.seats;
        case 'status': return a.status.localeCompare(b.status);
        case 'driver': return a.driver.localeCompare(b.driver);
        default: return a.id.localeCompare(b.id);
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredBuses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBuses = filteredBuses.slice(startIndex, startIndex + itemsPerPage);

  const handleAddBus = () => {
    setEditingBus(null);
    setFormData({ plate: '', name: '', seats: '', driver: '', status: 'active' });
    setShowModal(true);
  };

  const handleEditBus = (bus) => {
    setEditingBus(bus);
    setFormData({
      plate: bus.plate,
      name: bus.name,
      seats: bus.seats.toString(),
      driver: bus.driver,
      status: bus.status
    });
    setShowModal(true);
  };

  const handleSaveBus = () => {
    if (editingBus) {
      // Update existing bus
      setBuses(buses.map(bus => 
        bus.id === editingBus.id 
          ? { ...bus, ...formData, seats: parseInt(formData.seats) }
          : bus
      ));
    } else {
      // Add new bus
      const newBus = {
        id: `BUS${String(buses.length + 1).padStart(3, '0')}`,
        ...formData,
        seats: parseInt(formData.seats),
        lastService: new Date().toISOString().split('T')[0]
      };
      setBuses([...buses, newBus]);
    }
    setShowModal(false);
  };

  const handleDeleteBus = (busId) => {
    if (window.confirm('Are you sure you want to delete this bus?')) {
      setBuses(buses.filter(bus => bus.id !== busId));
    }
  };

  const handleAssignDriver = (busId) => {
    setDriverFormData({ busId, driver: '' });
    setShowDriverModal(true);
  };

  const handleSaveDriver = () => {
    setBuses(buses.map(bus => 
      bus.id === driverFormData.busId 
        ? { ...bus, driver: driverFormData.driver }
        : bus
    ));
    setShowDriverModal(false);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: '#27AE60', bg: '#D5F4E6', text: 'Active' },
      inactive: { color: '#E63946', bg: '#FFE5E5', text: 'Inactive' },
      maintenance: { color: '#F4A261', bg: '#FFF4E6', text: 'Maintenance' }
    };
    const config = statusConfig[status];
    return (
      <span 
        className="status-badge"
        style={{ 
          backgroundColor: config.bg, 
          color: config.color,
          border: `1px solid ${config.color}40`
        }}
      >
        {config.text}
      </span>
    );
  };

  return (
    <div className="manage-buses">
      {/* Header / Page Title */}
      <div className="buses-header">
        <div className="header-left">
          <div className="breadcrumb">
            <span>Dashboard</span>
            <span className="separator">›</span>
            <span className="current">Buses</span>
          </div>
          <h1>Manage Buses</h1>
          <p>View, add, and manage all buses in your fleet</p>
        </div>
        <div className="header-right">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search buses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
          <button className="add-bus-btn" onClick={handleAddBus}>
            <span>+</span>
            Add New Bus
          </button>
        </div>
      </div>

      {/* Quick Stats / KPI Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-icon total">🚌</div>
          <div className="card-content">
            <h3>Total Buses</h3>
            <p className="card-number">{totalBuses}</p>
          </div>
        </div>
        <div className="summary-card active">
          <div className="card-icon active">✅</div>
          <div className="card-content">
            <h3>Active Buses</h3>
            <p className="card-number">{activeBuses}</p>
          </div>
        </div>
        <div className="summary-card inactive">
          <div className="card-icon inactive">❌</div>
          <div className="card-content">
            <h3>Inactive / Maintenance</h3>
            <p className="card-number">{inactiveBuses + maintenanceBuses}</p>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="filters-section">
        <div className="filters-left">
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
           style={{ color: '#0077B6', fontWeight: 'bold' }}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="maintenance">Maintenance</option>
          </select>
          
          <select 
            value={filterDriver} 
            onChange={(e) => setFilterDriver(e.target.value)}
            className="filter-select"
          style={{ color: '#0077B6', fontWeight: 'bold' }}>
            <option value="all">All Drivers</option>
            {drivers.map(driver => (
              <option key={driver} value={driver}>{driver}</option>
            ))}
          </select>
          
          <select 
            value={filterSeats} 
            onChange={(e) => setFilterSeats(e.target.value)}
            className="filter-select"
          style={{ color: '#0077B6', fontWeight: 'bold' }}>
            <option value="all">All Sizes</option>
            <option value="small">Small (&lt;45 seats)</option>
            <option value="medium">Medium (45-54 seats)</option>
            <option value="large">Large (55+ seats)</option>
          </select>
        </div>
        
        <div className="filters-right">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          style={{ color: '#0077B6', fontWeight: 'bold' }}>
            <option value="id">Sort by ID</option>
            <option value="plate">Sort by Plate</option>
            <option value="name">Sort by Name</option>
            <option value="seats">Sort by Seats</option>
            <option value="status">Sort by Status</option>
            <option value="driver">Sort by Driver</option>
          </select>
        </div>
      </div>

      {/* Buses Table */}
      <div className="buses-table-container">
        <div className="table-header">
          <h3>Bus Fleet ({filteredBuses.length} buses)</h3>
        </div>
        <div className="table-wrapper">
          <table className="buses-table">
            <thead>
              <tr>
                <th>Bus ID/Number Plate</th>
                <th>Bus Name/Model</th>
                <th>Assigned Driver</th>
                <th>Status</th>
                <th>Seats Count</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBuses.map(bus => (
                <tr key={bus.id}>
                  <td className="bus-id">
                    <div className="bus-id-container">
                      <span className="id">{bus.id}</span>
                      <span className="plate">{bus.plate}</span>
                    </div>
                  </td>
                  <td className="bus-name">{bus.name}</td>
                  <td className="driver">{bus.driver}</td>
                  <td className="status">{getStatusBadge(bus.status)}</td>
                  <td className="seats">{bus.seats}</td>
                  <td className="actions">
                    <button 
                      className="action-btn edit"
                      onClick={() => handleEditBus(bus)}
                      title="Edit Bus"
                    >
                      ✏️
                    </button>
                    <button 
                      className="action-btn assign"
                      onClick={() => handleAssignDriver(bus.id)}
                      title="Assign Driver"
                    >
                      👤
                    </button>
                    <button 
                      className="action-btn delete"
                      onClick={() => handleDeleteBus(bus.id)}
                      title="Delete Bus"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              className="page-btn"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="page-info">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              className="page-btn"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Bus Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingBus ? 'Edit Bus' : 'Add New Bus'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Number Plate</label>
                <input
                  type="text"
                  value={formData.plate}
                  onChange={(e) => setFormData({...formData, plate: e.target.value})}
                  placeholder="e.g., RAB-123A"
                />
              </div>
              
              <div className="form-group">
                <label>Bus Name/Model</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., City Express"
                />
              </div>
              
              <div className="form-group">
                <label>Seats Count</label>
                <input
                  type="number"
                  value={formData.seats}
                  onChange={(e) => setFormData({...formData, seats: e.target.value})}
                  placeholder="e.g., 50"
                  min="1"
                  max="100"
                />
              </div>
              
              <div className="form-group">
                <label>Assign Driver</label>
                <select
                  value={formData.driver}
                  onChange={(e) => setFormData({...formData, driver: e.target.value})}
                >
                  <option value="">Select Driver</option>
                  {drivers.map(driver => (
                    <option key={driver} value={driver}>{driver}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="active">Active</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="save-btn" onClick={handleSaveBus}>
                {editingBus ? 'Update Bus' : 'Add Bus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Driver Modal */}
      {showDriverModal && (
        <div className="modal-overlay" onClick={() => setShowDriverModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Assign Driver</h2>
              <button className="close-btn" onClick={() => setShowDriverModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Select Driver</label>
                <select
                  value={driverFormData.driver}
                  onChange={(e) => setDriverFormData({...driverFormData, driver: e.target.value})}
                >
                  <option value="">Choose a driver</option>
                  {drivers.map(driver => (
                    <option key={driver} value={driver}>{driver}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowDriverModal(false)}>
                Cancel
              </button>
              <button className="save-btn" onClick={handleSaveDriver}>
                Assign Driver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageBuses;
