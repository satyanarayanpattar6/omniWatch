import { useState } from 'react';
import './App.css';

export default function App() {
  const [itemKeyword, setItemKeyword] = useState('');
  const [isolatedSpecs, setIsolatedSpecs] = useState('Warranty, Colors, Tech Specifications');
  const [userPincode, setUserPincode] = useState('560001');
  const [matrixOutput, setMatrixOutput] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [systemError, setSystemError] = useState(null);

  const executeLiveSearchStream = async () => {
    if (!itemKeyword.trim()) {
      setSystemError("Please provide an active item keyword descriptor query.");
      return;
    }

    setIsProcessing(true);
    setSystemError(null);

    try {
      let BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      BACKEND_URL = BACKEND_URL.replace(/\/+$/, '');

      const response = await fetch(`${BACKEND_URL}/api/compare-matrix`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item: itemKeyword, specs: isolatedSpecs, pincode: userPincode })
      });

      if (!response.ok) throw new Error(`Gateway dropped route socket: ${response.status}`);
      
      const parsedData = await response.json();
      setMatrixOutput(parsedData);
    } catch (err) {
      console.error(err);
      setSystemError(err instanceof Error ? err.message : "Operational backend network timeout.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="app-viewport">
      <div className="app-container">
        
        {/* Clean Global Control Bar */}
        <header className="console-header">
          <h1 className="header-title">OmniWatch Analytical Engine</h1>
          {matrixOutput?.timestamp && (
            <div className="timestamp-pill">
              ⏱️ LIVE SYNC: {new Date(matrixOutput.timestamp).toLocaleTimeString()}
            </div>
          )}
        </header>

        {/* Three-Field Input Dash Panel */}
        <div className="search-card-panel">
          <div className="input-flex-container">
            <div className="field-block">
              <label className="field-label">Target Product Name</label>
              <input 
                type="text" 
                className="interactive-input"
                placeholder="e.g., Dell S-Series 27 Monitor, Sony XM5"
                value={itemKeyword}
                onChange={(e) => setItemKeyword(e.target.value)}
              />
            </div>
            <div className="field-block">
              <label className="field-label">Specifications Filters</label>
              <input 
                type="text" 
                className="interactive-input"
                value={isolatedSpecs}
                onChange={(e) => setIsolatedSpecs(e.target.value)}
              />
            </div>
            <div className="field-block pincode-size">
              <label className="field-label">Regional Pincode</label>
              <input 
                type="text" 
                className="interactive-input"
                maxLength={6}
                value={userPincode}
                onChange={(e) => setUserPincode(e.target.value.replace(/\D/g, ''))}
              />
            </div>
          </div>
          <button 
            onClick={executeLiveSearchStream} 
            disabled={isProcessing} 
            className="action-submit-btn"
          >
            {isProcessing ? 'Interrogating Multi-Engine Cloud Nodes...' : 'Execute Arbitrage Search Run'}
          </button>
        </div>

        {systemError && <div className="error-banner">⚠️ <strong>SYSTEM FAULT:</strong> {systemError}</div>}
        {isProcessing && <div className="spinner-container"><div className="corporate-spinner"></div><p style={{ color: 'var(--text-muted)' }}>Compiling remote data vectors...</p></div>}

        {/* Master Tabular Data Matrix Presentation Layer */}
        {matrixOutput && !isProcessing && (
          <div className="table-panel-card">
            <div className="table-scroll-container">
              <table className="executive-table">
                <thead>
                  <tr className="th-group">
                    <th className="executive-th">1) Name & 2) Image Baseline Profile</th>
                    <th className="executive-th">3, 4, 5, 7) Feature Verification Metrics</th>
                    <th className="executive-th">6 & 8) Logistics Scope</th>
                    <th className="executive-th">Channel Pricing & Purchase Hooks</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="executive-row">
                    
                    <td className="td-product-profile">
                      <div className="product-profile-box">
                        <img 
                          src={matrixOutput.image} 
                          alt="Product Specimen Avatar" 
                          className="product-avatar-img"
                          onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=150&q=80"; }}
                        />
                        <div>
                          <div className="profile-name">{matrixOutput.name}</div>
                          <span className="profile-rating-badge">★ Rating: {matrixOutput.rating}</span>
                        </div>
                      </div>
                    </td>

                    <td className="td-specs-block">
                      <div className="extracted-features-box">
                        {matrixOutput.aiExtractedSpecs}
                      </div>
                    </td>

                    <td className="td-logistic-node">
                      <span className="status-stock-pill">{matrixOutput.inStock}</span>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                        Pin Route Destination: <strong>{matrixOutput.pincodeContext}</strong>
                      </div>
                      <div className="delivery-date-text">
                        🚚 Est: {matrixOutput.deliveryEst}
                      </div>
                    </td>

                    <td className="td-channel-pricing">
                      <div className="channel-price-group">
                        <span className="platform-label-tag">Amazon India Node</span>
                        <div className="channel-numeric-price">{matrixOutput.amazonPrice}</div>
                        <a href={matrixOutput.amazonLink} target="_blank" rel="noopener noreferrer" className="external-buy-link">
                          Launch Buying Window ↗
                        </a>
                      </div>
                      <div className="channel-price-group" style={{ margin: 0 }}>
                        <span className="platform-label-tag">Flipkart Node</span>
                        <div className="channel-numeric-price">{matrixOutput.flipkartPrice}</div>
                        <a href={matrixOutput.flipkartLink} target="_blank" rel="noopener noreferrer" className="external-buy-link">
                          Launch Buying Window ↗
                        </a>
                      </div>
                    </td>

                  </tr>
                </tbody>
              </table>
            </div>

            {/* Premium Native SVG Chart Section */}
            <div className="chart-container-panel">
              <h3 className="chart-title">📊 Price Trajectory Analysis Engine (1-Year Volatility Curve)</h3>
              <div className="graph-display-canvas">
                <svg viewBox="0 0 1000 200" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                  <line x1="50" y1="10" x2="50" y2="170" className="svg-axis-line" />
                  <line x1="50" y1="170" x2="980" y2="170" className="svg-axis-line" />
                  
                  {(() => {
                    const priceArray = matrixOutput.priceHistory.map(h => h.price);
                    const maxVal = Math.max(...priceArray) * 1.15;
                    const minVal = Math.min(...priceArray) * 0.85;
                    
                    const points = matrixOutput.priceHistory.map((h, idx) => {
                      const x = 50 + (idx * (930 / (matrixOutput.priceHistory.length - 1)));
                      const y = 170 - ((h.price - minVal) / (maxVal - minVal)) * 150;
                      return { x, y, price: h.price, date: h.date };
                    });

                    const polylinePointsString = points.map(p => `${p.x},${p.y}`).join(' ');

                    return (
                      <>
                        <polyline points={polylinePointsString} className="svg-trend-line" />
                        {points.map((p, idx) => (
                          <g key={idx}>
                            <circle cx={p.x} cy={p.y} r="5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                            <text x={p.x} y={p.y - 12} textAnchor="middle" className="svg-grid-text" fill="#0f172a">
                              ₹{(p.price / 1000).toFixed(1)}k
                            </text>
                            <text x={p.x} y="190" textAnchor="middle" className="svg-grid-text">
                              {p.date}
                            </text>
                          </g>
                        ))}
                      </>
                    );
                  })()}
                </svg>
              </div>
            </div>

            {/* Alternatives Competitive Module Section */}
            <div className="alternatives-section-box">
              <h3 className="chart-title">🤝 Cross-Market Competitors & Alternative Sourcing Paths</h3>
              <div className="alternatives-grid">
                {matrixOutput.similarItems?.map((altNode, idx) => (
                  <div key={idx} className="alt-item-card">
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-title)' }}>{altNode.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Target: {altNode.platform}</div>
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-green)', fontFamily: 'monospace' }}>{altNode.price}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}