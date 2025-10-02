import React from 'react';

function Notifications({ notifications }) {
  return (
    <div className="notifications">
      <div className="notifications-header">
        <h3>Notifications / Alerts</h3>
        <button className="see-more-btn">View All</button>
      </div>
      <div className="notifications-content">
        {notifications.length === 0 ? (
          <div className="no-notifications">
            <p>No notifications at this time</p>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map((notification, index) => (
              <div key={index} className={`notification-item ${notification.type}`}>
                <div className="notification-icon">
                  <div className="warning-triangle">
                    <span>⚠️</span>
                  </div>
                </div>
                <div className="notification-content">
                  <div className="notification-title">{notification.title}</div>
                  <div className="notification-message">{notification.message}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
