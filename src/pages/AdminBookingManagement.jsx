import React, { useState, useEffect } from 'react';
import '../style/AdminBookingManagement.css';

function AdminBookingManagement() {
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [routeFilter, setRouteFilter] = useState('all');
  const [operatorFilter, setOperatorFilter] = useState('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [notifications, setNotifications] = useState([]);

  // Mock data - in real app, this would come from API
  const [bookings, setBookings] = useState([
    {
      id: 'BK001',
      passenger: { name: 'John Doe', phone: '+250 788 123 456', email: 'john@example.com' },
      route: { from: 'Kigali', to: 'Rubavu' },
      bus: { id: 'BUS001', plate: 'RAB-123A' },
      date: '2024-01-20',
      time: '08:00',
      seats: { count: 2, numbers: ['A1', 'A2'] },
      payment: { method: 'MoMo', status: 'paid', amount: 15000, transactionId: 'TXN001' },
      bookingStatus: 'confirmed',
      operator: 'SafariTix Express'
    },
    {
      id: 'BK002',
      passenger: { name: 'Jane Smith', phone: '+250 789 234 567', email: 'jane@example.com' },
      route: { from: 'Kigali', to: 'Huye' },
      bus: { id: 'BUS002', plate: 'RAB-456B' },
      date: '2024-01-20',
      time: '10:30',
      seats: { count: 1, numbers: ['B3'] },
      payment: { method: 'Card', status: 'pending', amount: 12000, transactionId: 'TXN002' },
      bookingStatus: 'pending',
      operator: 'Rwanda Express'
    },
    {
      id: 'BK003',
      passenger: { name: 'Peter Kim', phone: '+250 787 345 678', email: 'peter@example.com' },
      route: { from: 'Kigali', to: 'Musanze' },
      bus: { id: 'BUS003', plate: 'RAB-789C' },
      date: '2024-01-21',
      time: '14:00',
      seats: { count: 3, numbers: ['C1', 'C2', 'C3'] },
      payment: { method: 'Cash', status: 'paid', amount: 45000, transactionId: 'TXN003' },
      bookingStatus: 'confirmed',
      operator: 'SafariTix Express'
    },
    {
      id: 'BK004',
      passenger: { name: 'Sarah Johnson', phone: '+250 786 456 789', email: 'sarah@example.com' },
      route: { from: 'Kigali', to: 'Nyagatare' },
      bus: { id: 'BUS004', plate: 'RAB-321D' },
      date: '2024-01-21',
      time: '16:30',
      seats: { count: 1, numbers: ['D5'] },
      payment: { method: 'MoMo', status: 'failed', amount: 10000, transactionId: 'TXN004' },
      bookingStatus: 'cancelled',
      operator: 'Eastern Express'
    },
    {
      id: 'BK005',
      passenger: { name: 'David Wilson', phone: '+250 785 567 890', email: 'david@example.com' },
      route: { from: 'Kigali', to: 'Rusizi' },
      bus: { id: 'BUS005', plate: 'RAB-654E' },
      date: '2024-01-22',
      time: '07:00',
      seats: { count: 2, numbers: ['E2', 'E3'] },
      payment: { method: 'Card', status: 'paid', amount: 20000, transactionId: 'TXN005' },
      bookingStatus: 'confirmed',
      operator: 'SafariTix Express'
    }
  ]);

  // Mock notifications
  useEffect(() => {
    setNotifications([
      { id: 1, type: 'warning', title: 'Pending Payments', message: '10 pending payments today', time: '2 min ago' },
      { id: 2, type: 'error', title: 'Overbooked Bus', message: 'Bus #12 overbooked - 2 extra passengers', time: '15 min ago' },
      { id: 3, type: 'info', title: 'Payment API', message: 'Payment API error resolved', time: '1 hour ago' },
      { id: 4, type: 'success', title: 'New Booking', message: '5 new bookings in the last hour', time: '2 hours ago' }
    ]);
  }, []);

  // Calculate summary stats
  const today = new Date().toISOString().split('T')[0];
  const todayBookings = bookings.filter(booking => booking.date === today);
  const totalBookingsToday = todayBookings.length;
  const ticketsSold = bookings.reduce((sum, booking) => sum + booking.seats.count, 0);
  const revenueCollected = bookings
    .filter(booking => booking.payment.status === 'paid')
    .reduce((sum, booking) => sum + booking.payment.amount, 0);
  const pendingPayments = bookings.filter(booking => booking.payment.status === 'pending').length;

  // Filter and sort bookings
  const filteredBookings = bookings
    .filter(booking => {
      const matchesSearch = booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          booking.passenger.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          booking.passenger.phone.includes(searchTerm);
      const matchesDate = dateRange === 'all' || booking.date === dateRange;
      const matchesRoute = routeFilter === 'all' || 
                          `${booking.route.from} → ${booking.route.to}` === routeFilter;
      const matchesOperator = operatorFilter === 'all' || booking.operator === operatorFilter;
      const matchesPaymentStatus = paymentStatusFilter === 'all' || booking.payment.status === paymentStatusFilter;
      const matchesBookingStatus = bookingStatusFilter === 'all' || booking.bookingStatus === bookingStatusFilter;
      
      return matchesSearch && matchesDate && matchesRoute && matchesOperator && 
             matchesPaymentStatus && matchesBookingStatus;
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'id': return a.id.localeCompare(b.id);
        case 'passenger': return a.passenger.name.localeCompare(b.passenger.name);
        case 'route': return `${a.route.from} → ${a.route.to}`.localeCompare(`${b.route.from} → ${b.route.to}`);
        case 'date': return new Date(b.date) - new Date(a.date);
        case 'amount': return b.payment.amount - a.payment.amount;
        default: return new Date(b.date) - new Date(a.date);
      }
    });

  const routes = [
    'Kigali → Rubavu',
    'Kigali → Huye', 
    'Kigali → Musanze',
    'Kigali → Nyagatare',
    'Kigali → Rusizi'
  ];

  const operators = ['SafariTix Express', 'Rwanda Express', 'Eastern Express'];

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleCancelBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      setBookings(bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, bookingStatus: 'cancelled' }
          : booking
      ));
    }
  };

  const handleApprovePayment = (bookingId) => {
    setBookings(bookings.map(booking => 
      booking.id === bookingId 
        ? { ...booking, payment: { ...booking.payment, status: 'paid' }, bookingStatus: 'confirmed' }
        : booking
    ));
  };

  const handleMarkAsPaid = (bookingId) => {
    setBookings(bookings.map(booking => 
      booking.id === bookingId 
        ? { ...booking, payment: { ...booking.payment, status: 'paid' }, bookingStatus: 'confirmed' }
        : booking
    ));
    setShowModal(false);
  };

  const handleResendTicket = (bookingId) => {
    // In real app, this would trigger email/SMS
    alert('Ticket resent successfully!');
  };

  const getStatusBadge = (status, type = 'booking') => {
    const statusConfig = {
      booking: {
        confirmed: { color: '#10B981', bg: '#D1FAE5', text: 'Confirmed' },
        pending: { color: '#F59E0B', bg: '#FEF3C7', text: 'Pending' },
        cancelled: { color: '#EF4444', bg: '#FEE2E2', text: 'Cancelled' }
      },
      payment: {
        paid: { color: '#10B981', bg: '#D1FAE5', text: 'Paid' },
        pending: { color: '#F59E0B', bg: '#FEF3C7', text: 'Pending' },
        failed: { color: '#EF4444', bg: '#FEE2E2', text: 'Failed' }
      }
    };
    
    const config = statusConfig[type][status];
    return (
      <span 
        className="status-badge"
        style={{ 
          backgroundColor: config.bg, 
          color: config.color,
          border: `1px solid ${config.color}20`
        }}
      >
        {config.text}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="admin-booking-management">
      {/* Header */}
      <div className="booking-header">
        <div className="header-left">
          <h1>Manage Bookings</h1>
          <p>Monitor and manage all booking transactions</p>
        </div>
        <div className="header-right">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="overview-cards">
        <div className="overview-card">
          <div className="card-icon">📅</div>
          <div className="card-content">
            <h3>Total Bookings Today</h3>
            <p className="card-number">{totalBookingsToday}</p>
            <span className="card-badge">+12% from yesterday</span>
          </div>
        </div>
        <div className="overview-card">
          <div className="card-icon">🎫</div>
          <div className="card-content">
            <h3>Tickets Sold</h3>
            <p className="card-number">{ticketsSold}</p>
            <span className="card-badge">+8% this week</span>
          </div>
        </div>
        <div className="overview-card">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <h3>Revenue Collected</h3>
            <p className="card-number">{formatCurrency(revenueCollected)}</p>
            <span className="card-badge">+15% this month</span>
          </div>
        </div>
        <div className="overview-card">
          <div className="card-icon">⏳</div>
          <div className="card-content">
            <h3>Pending Payments</h3>
            <p className="card-number">{pendingPayments}</p>
            <span className="card-badge warning">Needs attention</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filters-left">
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Dates</option>
            <option value="2024-01-20">Today (Jan 20)</option>
            <option value="2024-01-21">Tomorrow (Jan 21)</option>
            <option value="2024-01-22">Jan 22</option>
          </select>
          
          <select 
            value={routeFilter} 
            onChange={(e) => setRouteFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Routes</option>
            {routes.map(route => (
              <option key={route} value={route}>{route}</option>
            ))}
          </select>
          
          <select 
            value={operatorFilter} 
            onChange={(e) => setOperatorFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Operators</option>
            {operators.map(operator => (
              <option key={operator} value={operator}>{operator}</option>
            ))}
          </select>
          
          <select 
            value={paymentStatusFilter} 
            onChange={(e) => setPaymentStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Payment Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          
          <select 
            value={bookingStatusFilter} 
            onChange={(e) => setBookingStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Booking Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        
        <div className="filters-right">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="date">Sort by Date</option>
            <option value="id">Sort by ID</option>
            <option value="passenger">Sort by Passenger</option>
            <option value="route">Sort by Route</option>
            <option value="amount">Sort by Amount</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Bookings Table */}
        <div className="bookings-section">
          <div className="section-header">
            <h3>Bookings ({filteredBookings.length})</h3>
          </div>
          <div className="table-container">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Passenger</th>
                  <th>Route</th>
                  <th>Bus</th>
                  <th>Date & Time</th>
                  <th>Seats</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map(booking => (
                  <tr key={booking.id} className="booking-row">
                    <td className="booking-id">{booking.id}</td>
                    <td className="passenger-info">
                      <div className="passenger-name">{booking.passenger.name}</div>
                      <div className="passenger-phone">{booking.passenger.phone}</div>
                    </td>
                    <td className="route">
                      {booking.route.from} → {booking.route.to}
                    </td>
                    <td className="bus-info">
                      <div className="bus-id">{booking.bus.id}</div>
                      <div className="bus-plate">{booking.bus.plate}</div>
                    </td>
                    <td className="datetime">
                      <div className="date">{booking.date}</div>
                      <div className="time">{booking.time}</div>
                    </td>
                    <td className="seats">
                      <div className="seat-count">{booking.seats.count} seats</div>
                      <div className="seat-numbers">{booking.seats.numbers.join(', ')}</div>
                    </td>
                    <td className="payment">
                      <div className="payment-method">{booking.payment.method}</div>
                      <div className="payment-amount">{formatCurrency(booking.payment.amount)}</div>
                      <div className="payment-status">
                        {getStatusBadge(booking.payment.status, 'payment')}
                      </div>
                    </td>
                    <td className="status">
                      {getStatusBadge(booking.bookingStatus, 'booking')}
                    </td>
                    <td className="actions">
                      <button 
                        className="action-btn view"
                        onClick={() => handleViewBooking(booking)}
                        title="View Details"
                      >
                        👁️
                      </button>
                      {booking.bookingStatus !== 'cancelled' && (
                        <button 
                          className="action-btn cancel"
                          onClick={() => handleCancelBooking(booking.id)}
                          title="Cancel Booking"
                        >
                          ❌
                        </button>
                      )}
                      {booking.payment.status === 'pending' && (
                        <button 
                          className="action-btn approve"
                          onClick={() => handleApprovePayment(booking.id)}
                          title="Approve Payment"
                        >
                          ✅
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar */}
        <div className="sidebar">
          {/* Notifications */}
          <div className="notifications-widget">
            <div className="widget-header">
              <h3>Notifications</h3>
              <span className="notification-count">{notifications.length}</span>
            </div>
            <div className="notifications-list">
              {notifications.map(notification => (
                <div key={notification.id} className={`notification-item ${notification.type}`}>
                  <div className="notification-icon">
                    {notification.type === 'warning' && '⚠️'}
                    {notification.type === 'error' && '🚨'}
                    {notification.type === 'info' && 'ℹ️'}
                    {notification.type === 'success' && '✅'}
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">{notification.title}</div>
                    <div className="notification-message">{notification.message}</div>
                    <div className="notification-time">{notification.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Analytics */}
          <div className="analytics-widget">
            <div className="widget-header">
              <h3>Analytics</h3>
            </div>
            <div className="chart-container">
              <div className="chart-title">Bookings Trend</div>
              <div className="simple-chart">
                <div className="chart-bars">
                  <div className="bar" style={{ height: '60%' }}></div>
                  <div className="bar" style={{ height: '80%' }}></div>
                  <div className="bar" style={{ height: '45%' }}></div>
                  <div className="bar" style={{ height: '90%' }}></div>
                  <div className="bar" style={{ height: '70%' }}></div>
                  <div className="bar" style={{ height: '85%' }}></div>
                  <div className="bar" style={{ height: '95%' }}></div>
                </div>
                <div className="chart-labels">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>
            </div>
            <div className="chart-container">
              <div className="chart-title">Payment Methods</div>
              <div className="pie-chart">
                <div className="pie-slice" style={{ '--percentage': '45%', '--color': '#6A0DAD' }}>
                  <span>MoMo 45%</span>
                </div>
                <div className="pie-slice" style={{ '--percentage': '30%', '--color': '#B57EDC' }}>
                  <span>Card 30%</span>
                </div>
                <div className="pie-slice" style={{ '--percentage': '25%', '--color': '#FFD700' }}>
                  <span>Cash 25%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Details Modal */}
      {showModal && selectedBooking && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Booking Details - {selectedBooking.id}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="details-section">
                <h3>Passenger Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Name:</label>
                    <span>{selectedBooking.passenger.name}</span>
                  </div>
                  <div className="detail-item">
                    <label>Phone:</label>
                    <span>{selectedBooking.passenger.phone}</span>
                  </div>
                  <div className="detail-item">
                    <label>Email:</label>
                    <span>{selectedBooking.passenger.email}</span>
                  </div>
                </div>
              </div>

              <div className="details-section">
                <h3>Trip Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Route:</label>
                    <span>{selectedBooking.route.from} → {selectedBooking.route.to}</span>
                  </div>
                  <div className="detail-item">
                    <label>Bus:</label>
                    <span>{selectedBooking.bus.id} ({selectedBooking.bus.plate})</span>
                  </div>
                  <div className="detail-item">
                    <label>Date & Time:</label>
                    <span>{selectedBooking.date} at {selectedBooking.time}</span>
                  </div>
                  <div className="detail-item">
                    <label>Seats:</label>
                    <span>{selectedBooking.seats.count} seats - {selectedBooking.seats.numbers.join(', ')}</span>
                  </div>
                </div>
              </div>

              <div className="details-section">
                <h3>Payment Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Amount:</label>
                    <span>{formatCurrency(selectedBooking.payment.amount)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Method:</label>
                    <span>{selectedBooking.payment.method}</span>
                  </div>
                  <div className="detail-item">
                    <label>Transaction ID:</label>
                    <span>{selectedBooking.payment.transactionId}</span>
                  </div>
                  <div className="detail-item">
                    <label>Status:</label>
                    <span>{getStatusBadge(selectedBooking.payment.status, 'payment')}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="action-btn secondary" onClick={() => setShowModal(false)}>
                Close
              </button>
              {selectedBooking.payment.status === 'pending' && (
                <button className="action-btn primary" onClick={() => handleMarkAsPaid(selectedBooking.id)}>
                  Mark as Paid
                </button>
              )}
              {selectedBooking.bookingStatus !== 'cancelled' && (
                <button className="action-btn danger" onClick={() => handleCancelBooking(selectedBooking.id)}>
                  Cancel Booking
                </button>
              )}
              <button className="action-btn success" onClick={() => handleResendTicket(selectedBooking.id)}>
                Resend Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminBookingManagement;

