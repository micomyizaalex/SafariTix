import React from 'react';
import logo from '../images/SafariTix.png';

function AdminSidebar({ activeTab, setActiveTab, collapsed, setCollapsed, onLogout }) {
  const menuItems = [
    { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
    { id: 'manage-buses', icon: '🚌', label: 'Manage buses' },
    { id: 'booking', icon: '🎫', label: 'Booking' },
    { id: 'tracking', icon: '📍', label: 'Buses tracking' },
    { id: 'cancellation', icon: '❌', label: 'cancellation' },
    { id: 'subscriptions', icon: '▶️', label: 'Subscriptions' },
    { id: 'settings', icon: '⚙️', label: 'settings' }
  ];

  return (
    <div className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <img src={logo} alt="SafariTix" className="sidebar-logo-img" />
          {!collapsed && <span className="sidebar-logo-text">SafariTix</span>}
        </div>
        <button 
          className="sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className="sidebar-icon">{item.icon}</span>
            {!collapsed && <span className="sidebar-label">{item.label}</span>}
          </button>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <button className="sidebar-item logout-btn" onClick={onLogout}>
          <span className="sidebar-icon">🚪</span>
          {!collapsed && <span className="sidebar-label">Logout</span>}
        </button>
      </div>
    </div>
  );
}

export default AdminSidebar;


