import React from 'react';

function TopRoutes({ routes }) {
  return (
    <div className="top-routes">
      <div className="routes-header">
        <h3>Top Booked Routes</h3>
        <button className="see-more-btn">See More</button>
      </div>
      <div className="routes-table">
        <div className="table-header">
          <div className="header-cell">Route</div>
          <div className="header-cell">Sold</div>
        </div>
        <div className="table-body">
          {routes.map((route, index) => (
            <div key={index} className="table-row">
              <div className="table-cell route-cell">{route.route}</div>
              <div className="table-cell sold-cell">{route.sold}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TopRoutes;
