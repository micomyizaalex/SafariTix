import React, { useState } from 'react';

function DashboardChart({ data }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const maxValue = Math.max(...data.map(item => item.value));
  const chartHeight = 220;

  const getGradientId = () => 'chart-gradient';

  return (
    <div className="dashboard-chart">
      <div className="chart-header">
        <div className="chart-title-section">
          <h3>Sales Overview</h3>
          <div className="chart-stats">
            <div className="stat-item">
              <span className="stat-label">Total Sales</span>
              <span className="stat-value">{data.reduce((sum, item) => sum + item.value, 0).toLocaleString()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Growth</span>
              <span className="stat-value growth">+12.5%</span>
            </div>
          </div>
        </div>
        <div className="chart-controls">
          <button className="chart-btn active">7D</button>
          <button className="chart-btn">30D</button>
          <button className="chart-btn">90D</button>
        </div>
      </div>
      
      <div className="chart-container">
        <div className="chart-y-axis">
          <div className="y-axis-label">3.5K</div>
          <div className="y-axis-label">3.0K</div>
          <div className="y-axis-label">2.5K</div>
          <div className="y-axis-label">2.0K</div>
          <div className="y-axis-label">1.5K</div>
          <div className="y-axis-label">1.0K</div>
          <div className="y-axis-label">500</div>
          <div className="y-axis-label">0</div>
        </div>
        
        <div className="chart-area">
          <svg width="100%" height={chartHeight} className="chart-svg">
            <defs>
              <linearGradient id={getGradientId()} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0077B6" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="#9B8AD6" stopOpacity="0.1"/>
              </linearGradient>
            </defs>
            
            {/* Grid lines */}
            {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
              <line
                key={i}
                x1="0"
                y1={i * (chartHeight / 7)}
                x2="100%"
                y2={i * (chartHeight / 7)}
                stroke="#f1f5f9"
                strokeWidth="1"
                opacity="0.6"
              />
            ))}
            
            {/* Area under the curve */}
            <path
              d={`M 0,${chartHeight} ${data.map((item, index) => {
                const x = (index / (data.length - 1)) * 100;
                const y = chartHeight - (item.value / maxValue) * chartHeight;
                return `L ${x}%,${y}`;
              }).join(' ')} L 100%,${chartHeight} Z`}
              fill={`url(#${getGradientId()})`}
            />
            
            {/* Chart line */}
            <polyline
              fill="none"
              stroke="url(#line-gradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={data.map((item, index) => {
                const x = (index / (data.length - 1)) * 100;
                const y = chartHeight - (item.value / maxValue) * chartHeight;
                return `${x}%,${y}`;
              }).join(' ')}
            />
            
            {/* Data points */}
            {data.map((item, index) => {
              const x = (index / (data.length - 1)) * 100;
              const y = chartHeight - (item.value / maxValue) * chartHeight;
              const isHovered = hoveredPoint === index;
              
              return (
                <g key={index}>
                  {/* Hover circle */}
                  <circle
                    cx={`${x}%`}
                    cy={y}
                    r="8"
                    fill="transparent"
                    onMouseEnter={() => setHoveredPoint(index)}
                    onMouseLeave={() => setHoveredPoint(null)}
                    style={{ cursor: 'pointer' }}
                  />
                  
                  {/* Data point */}
                  <circle
                    cx={`${x}%`}
                    cy={y}
                    r={isHovered ? "6" : "4"}
                    fill={isHovered ? "#0077B6" : "#9B8AD6"}
                    stroke="#fff"
                    strokeWidth="2"
                    style={{ 
                      transition: 'all 0.3s ease',
                      filter: isHovered ? 'drop-shadow(0 4px 8px rgba(0, 119, 182, 0.4))' : 'none'
                    }}
                  />
                  
                  {/* Tooltip */}
                  {isHovered && (
                    <g>
                      <rect
                        x={`${x}%`}
                        y={y - 40}
                        width="60"
                        height="30"
                        rx="6"
                        fill="#1a202c"
                        transform="translate(-30, 0)"
                      />
                      <text
                        x={`${x}%`}
                        y={y - 20}
                        textAnchor="middle"
                        fill="#fff"
                        fontSize="12"
                        fontWeight="600"
                      >
                        {item.value.toLocaleString()}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
            
            {/* Gradient definition for line */}
            <defs>
              <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0077B6"/>
                <stop offset="50%" stopColor="#9B8AD6"/>
                <stop offset="100%" stopColor="#0077B6"/>
              </linearGradient>
            </defs>
          </svg>
          
          <div className="chart-x-axis">
            {data.map((item, index) => (
              <div key={index} className="x-axis-label">
                {item.period}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="chart-footer">
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-color" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}></div>
            <span>Sales Performance</span>
          </div>
        </div>
        <div className="chart-actions">
          <button className="action-btn">
            <span>📊</span>
            Export
          </button>
          <button className="action-btn">
            <span>🔍</span>
            Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default DashboardChart;
