import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/AdminSidebar';
import ManageBuses from './ManageBuses';
import AdminBookingManagement from './AdminBookingManagement';
import '../style/AdminDashboard.css';
import logo from '../images/SafariTix.png';

function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Mock data - replace with API calls in real app
  const dashboardData = {
    stats: {
      activeBuses: 133,
      ticketsSoldToday: 420,
      revenueToday: 1650000,
      occupancyRate: 78
    },
    recentTickets: [
      { name: 'Alice N.', route: 'Kigali → Huye', seat: 'A12', status: 'Confirmed', payment: 'Paid' },
      { name: 'John M.', route: 'Kigali → Rubavu', seat: 'B07', status: 'Cancelled', payment: 'Refunded' },
      { name: 'Eric K.', route: 'Huye → Kigali', seat: 'C03', status: 'Confirmed', payment: 'Paid' },
      { name: 'Grace T.', route: 'Musanze → Kigali', seat: 'D15', status: 'Pending', payment: 'Pending' },
      { name: 'Diane U.', route: 'Kigali → Musanze', seat: 'E01', status: 'Confirmed', payment: 'Paid' }
    ],
    busesToday: [
      { code: 'BUS-101', route: 'Kigali → Huye', departs: '14:30', status: 'On Time' },
      { code: 'BUS-202', route: 'Kigali → Rubavu', departs: '15:15', status: 'Delayed' },
      { code: 'BUS-303', route: 'Huye → Kigali', departs: '16:00', status: 'On Time' }
    ],
    upcomingDepartures: [
      { route: 'Kigali → Gisenyi', time: '17:45' },
      { route: 'Kigali → Nyamata', time: '18:10' },
      { route: 'Kigali → Muhanga', time: '18:30' }
    ],
    version: 'v1.0.0'
  };

  const renderMainContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return (
          <div className="dashboard-main">
            {/* Header / Top Bar */}
            <div className="stx-topbar">
              <div className="stx-left">
                <img src={logo} alt="SafariTix" className="stx-logo" />
                <div className="stx-brand">
                  <h1>SafariTix Admin</h1>
                  <span className="stx-sub">Operations Dashboard</span>
                </div>
              </div>
              <div className="stx-right">
                <button className="stx-bell" aria-label="Notifications">
                  <span className="dot" />
                  🔔
                </button>
                <div className="stx-profile">
                  <div className="avatar" aria-hidden="true">{(user?.firstName || 'A').charAt(0)}</div>
                  <div className="profile-info">
                    <span className="name">{user?.firstName || 'Admin'}</span>
                    <span className="role">Administrator</span>
                  </div>
                  <div className="dropdown" role="menu" aria-label="Profile menu">
                    <button className="dropdown-item">Settings</button>
                    <button className="dropdown-item" onClick={logout}>Logout</button>
                  </div>
                </div>
              </div>
            </div>

            {/* KPI / Stats Cards */}
            <div className="stx-kpis">
              <div className="kpi-card">
                <div className="kpi-icon primary">🚌</div>
                <div className="kpi-content">
                  <span className="kpi-label">Active Buses</span>
                  <span className="kpi-value">{dashboardData.stats.activeBuses}</span>
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-icon success">🎟️</div>
                <div className="kpi-content">
                  <span className="kpi-label">Tickets Sold Today</span>
                  <span className="kpi-value">{dashboardData.stats.ticketsSoldToday}</span>
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-icon accent">💰</div>
                <div className="kpi-content">
                  <span className="kpi-label">Revenue Today</span>
                  <span className="kpi-value">RWF {dashboardData.stats.revenueToday.toLocaleString()}</span>
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-icon alert">📈</div>
                <div className="kpi-content">
                  <span className="kpi-label">Occupancy Rate</span>
                  <span className="kpi-value">{dashboardData.stats.occupancyRate}%</span>
                </div>
              </div>
            </div>

            {/* Grid: Activity + Snapshot + Map */}
            <div className="stx-grid">
              <div className="card stx-activity">
                <div className="card-header">
                  <h3>Recent Tickets</h3>
                </div>
                <div className="table-wrapper">
                  <table className="stx-table">
                    <thead>
                      <tr>
                        <th>Passenger Name</th>
                        <th>Bus/Route</th>
                        <th>Seat</th>
                        <th>Status</th>
                        <th>Payment Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.recentTickets.map((t, idx) => (
                        <tr key={idx}>
                          <td>{t.name}</td>
                          <td>{t.route}</td>
                          <td>{t.seat}</td>
                          <td>
                            <span className={`badge ${t.status.toLowerCase()}`}>{t.status}</span>
                          </td>
                          <td>
                            <span className={`badge payment ${t.payment.toLowerCase()}`}>{t.payment}</span>
                          </td>
                          <td className="row-actions">
                            <button className="btn-link">View</button>
                            <button className="btn-link danger">Cancel</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="card stx-snapshot">
                <div className="card-header">
                  <h3>Bus & Schedule Snapshot</h3>
                </div>
                <div className="snapshot-section">
                  <h4>Operating Today</h4>
                  <ul className="snapshot-list">
                    {dashboardData.busesToday.map((b, i) => (
                      <li key={i}>
                        <span className="code">{b.code}</span>
                        <span className="route">{b.route}</span>
                        <span className={`status ${b.status === 'Delayed' ? 'alert' : 'ok'}`}>{b.status}</span>
                        <span className="time">Departs {b.departs}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="snapshot-section">
                  <h4>Upcoming Departures</h4>
                  <ul className="snapshot-list">
                    {dashboardData.upcomingDepartures.map((d, i) => (
                      <li key={i}>
                        <span className="route">{d.route}</span>
                        <span className="time">{d.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="card stx-map">
                <div className="card-header">
                  <h3>Live Vehicle Map</h3>
                  <span className="muted">MVP Placeholder</span>
                </div>
                <div className="map-placeholder" role="img" aria-label="Live map placeholder" />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="stx-actions">
              <button className="action primary">Add Bus</button>
              <button className="action secondary">Create Schedule</button>
              <button className="action neutral">View Tickets</button>
              <button className="action outline">Generate Report</button>
            </div>

            {/* Footer */}
            <div className="stx-footer">
              <span>SafariTix {dashboardData.version}</span>
              <span>Support: support@safaritix.com</span>
              <span>Docs · Status · Terms</span>
            </div>
          </div>
        );
      case 'manage-buses':
        return <ManageBuses />;
      case 'booking':
        return <AdminBookingManagement />;
      case 'tracking':
        return (
          <div className="dashboard-main">
            <div className="dashboard-header">
              <h1>Bus Tracking</h1>
            </div>
            <div className="coming-soon">
              <h2>Bus Tracking - Coming Soon</h2>
              <p>This feature will show real-time bus locations and tracking.</p>
            </div>
          </div>
        );
      case 'cancellation':
        return (
          <div className="dashboard-main">
            <div className="dashboard-header">
              <h1>Cancellation Management</h1>
            </div>
            <div className="coming-soon">
              <h2>Cancellation Management - Coming Soon</h2>
              <p>This feature will allow you to manage ticket cancellations and refunds.</p>
            </div>
          </div>
        );
      case 'subscriptions':
        return (
          <div className="dashboard-main">
            <div className="dashboard-header">
              <h1>Subscriptions</h1>
            </div>
            <div className="coming-soon">
              <h2>Subscriptions - Coming Soon</h2>
              <p>This feature will allow you to manage subscription plans and billing.</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="dashboard-main">
            <div className="dashboard-header">
              <h1>Settings</h1>
            </div>
            <div className="coming-soon">
              <h2>Settings - Coming Soon</h2>
              <p>This feature will allow you to configure system settings.</p>
            </div>
          </div>
        );
      default:
        return renderMainContent();
    }
  };

  return (
    <div className="admin-dashboard">
      <AdminSidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        onLogout={logout}
      />
      <div className={`admin-main ${sidebarCollapsed ? 'collapsed' : ''}`}>
        {renderMainContent()}
      </div>
    </div>
  );
}

export default AdminDashboard;
