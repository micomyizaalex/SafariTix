import React from 'react';

function RecentTransactions({ transactions }) {
  return (
    <div className="recent-transactions">
      <div className="transactions-header">
        <h3>Recent Transactions</h3>
        <button className="see-more-btn">View All</button>
      </div>
      <div className="transactions-table">
        <div className="table-header">
          <div className="header-cell">Passenger</div>
          <div className="header-cell">Route</div>
          <div className="header-cell">Payment</div>
          <div className="header-cell">Status</div>
        </div>
        <div className="table-body">
          {transactions.map((transaction, index) => (
            <div key={index} className="table-row">
              <div className="table-cell passenger-cell">{transaction.passenger}</div>
              <div className="table-cell route-cell">{transaction.route}</div>
              <div className="table-cell payment-cell">{transaction.payment}</div>
              <div className="table-cell status-cell">
                <span className={`status-badge ${transaction.status}`}>
                  {transaction.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RecentTransactions;
