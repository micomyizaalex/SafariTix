import React from 'react';

function DashboardStats({ stats }) {
  return (
    <div className="dashboard-stats">
      <div className="stat-card">
        <div className="stat-icon bus-icon">
          <span>🚌</span>
        </div>
        <div className="stat-content">
          <div className="stat-label">Active buses</div>
          <div className="stat-value">{stats.activeBuses}+</div>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon ticket-icon">
          <span>🎫</span>
        </div>
        <div className="stat-content">
          <div className="stat-label">Ticket sold</div>
          <div className="stat-value">{stats.ticketsSold.toLocaleString()}+</div>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon money-icon">
          <span>💰</span>
        </div>
        <div className="stat-content">
          <div className="stat-label">Total Earn</div>
          <div className="stat-value">{stats.totalEarnings.toLocaleString()} RWF</div>
        </div>
      </div>
    </div>
  );
}

export default DashboardStats;


