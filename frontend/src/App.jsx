import { useInventoryStream } from './hooks/useInventoryStream';
import './App.css';

export default function App() {
  const { data, loading, error } = useInventoryStream();
  const productKeys = Object.keys(data.products || {});

  return (
    <div className="app-viewport">
      <div className="app-container">
        
        {/* Clean Global Control Bar */}
        <header className="dashboard-header">
          <div className="brand-group">
            <div className="pulse-indicator"></div>
            <h1 className="header-title">OmniWatch Business Console</h1>
          </div>
          <div className="sync-status">
            {data.lastUpdated ? (
              <span>🟢 Live Feed Sync: {new Date(data.lastUpdated).toLocaleTimeString()}</span>
            ) : (
              <span>🔄 Interrogating Nodes...</span>
            )}
          </div>
        </header>

        {/* System Error Message Boundary */}
        {error && (
          <div className="error-banner">
            <strong>System Communication Error:</strong> {error}
          </div>
        )}

        {/* Clean Corporate Spinner */}
        {loading && (
          <div className="spinner-container">
            <div className="corporate-spinner"></div>
            <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Accessing operational memory registers...</p>
          </div>
        )}

        {/* Main Tabular Presenter Grid */}
        {!loading && productKeys.length > 0 && (
          <div className="table-panel-card">
            <div className="table-scroll-container">
              <table className="executive-table">
                <thead>
                  <tr className="th-group">
                    <th className="executive-th">Monitored Target</th>
                    <th className="executive-th">Amazon India Feed</th>
                    <th className="executive-th">Flipkart Channel Feed</th>
                    <th className="executive-th">AI Arbitrage Intercept</th>
                  </tr>
                </thead>
                <tbody>
                  {productKeys.map((productName) => {
                    const metrics = data.products[productName];
                    if (!metrics) return null;

                    return (
                      <tr key={productName} className="executive-row">
                        
                        {/* Column 1: Core Target Description */}
                        <td className="td-product-name">
                          {productName}
                        </td>

                        {/* Column 2: Extracted Amazon Values */}
                        <td className="td-marketplace-data">
                          {metrics.amazon ? (
                            <>
                              <div className="listing-title-box" title={metrics.amazon.title}>
                                {metrics.amazon.title}
                              </div>
                              <span className="price-pill-tag amazon">
                                {metrics.amazon.price || "Listed (No Price)"}
                              </span>
                            </>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No direct match parsed</span>
                          )}
                        </td>

                        {/* Column 3: Extracted Flipkart Values */}
                        <td className="td-marketplace-data">
                          {metrics.flipkart ? (
                            <>
                              <div className="listing-title-box" title={metrics.flipkart.title}>
                                {metrics.flipkart.title}
                              </div>
                              <div className="snippet-text-box">
                                {metrics.flipkart.snippet}
                              </div>
                              <span className="price-pill-tag flipkart" style={{ marginTop: '0.4rem' }}>
                                Active Search Match
                              </span>
                            </>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No direct match parsed</span>
                          )}
                        </td>

                        {/* Column 4: Dynamic OpenAI Risk Audit */}
                        <td className="td-ai-compliance">
                          {metrics.verdict ? (
                            <div className="inline-audit-badge">
                              <h5 className="audit-badge-header">COMPLIANCE REPORT</h5>
                              <p className="audit-badge-body">{metrics.verdict}</p>
                            </div>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Bypassed</span>
                          )}
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty Cache Fallback */}
        {!loading && productKeys.length === 0 && !error && (
          <div className="table-panel-card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            Database buffer is empty. Ensure background workers are actively scraping targets.
          </div>
        )}

      </div>
    </div>
  );
}