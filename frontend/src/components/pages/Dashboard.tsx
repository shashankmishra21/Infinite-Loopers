import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export function Dashboard() {
  const [farmer, setFarmer] = useState<any>(null);
  const [farm, setFarm] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFarmData() {
      try {
        const res = await fetch('http://localhost:5000/api/farmers/current');
        const json = await res.json();
        
        if (json.success) {
          setFarmer(json.data.farmer);
          if (json.data.farms && json.data.farms.length > 0) {
            setFarm(json.data.farms[0]);
          }
        }
        setLoading(false);
      } catch (err) {
        console.error('Error:', err);
        setLoading(false);
      }
    }
    fetchFarmData();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(to bottom right, #f0fdf4, #dbeafe)'
      }}>
        <Loader2 className="animate-spin h-16 w-16 text-green-600 mb-4" />
        <p style={{ color: '#4b5563', fontSize: '18px' }}>Loading farm data...</p>
      </div>
    );
  }

  if (!farm) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ 
          background: 'white', 
          padding: '32px', 
          borderRadius: '16px', 
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          textAlign: 'center' 
        }}>
          <p style={{ color: '#4b5563', fontSize: '18px', marginBottom: '16px' }}>
            No farm data found
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 24px',
              background: '#10b981',
              color: 'white',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const acres = farm.acres ?? 0;
  const cropType = farm.cropType || 'Unknown';
  const carbonTons = farm.carbonTons ?? 0;
  const earningsEstimate = farm.earningsEstimate ?? 0;
  const status = farm.status || 'unknown';
  
  const ndviJan = farm.ndviHistory?.[0]?.ndvi ?? 0;
  const ndviJun = farm.ndviHistory?.[1]?.ndvi ?? 0;
  const ndviIncrease = ndviJan ? (((ndviJun - ndviJan) / ndviJan) * 100).toFixed(1) : '0';

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom right, #f0fdf4 0%, #dbeafe 50%, #d1fae5 100%)',
      paddingBottom: '48px'
    }}>
      {/* Header */}
      <div style={{ 
        background: 'white', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        borderBottom: '1px solid #e5e7eb',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ 
          maxWidth: '1152px', 
          margin: '0 auto', 
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              📊
            </div>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                Farm Dashboard
              </h1>
              {farmer && (
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                  Welcome, {farmer.name}
                </p>
              )}
            </div>
          </div>
          
          {status === 'completed' && (
            <span style={{
              padding: '8px 16px',
              background: '#d1fae5',
              color: '#065f46',
              borderRadius: '9999px',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>✓</span> Completed
            </span>
          )}
        </div>
      </div>

      <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '32px 24px' }}>
        
        {/* Overview Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '24px', 
          marginBottom: '32px' 
        }}>
          {/* Farm Size */}
          <div style={{ 
            background: 'white', 
            borderRadius: '16px', 
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)', 
            overflow: 'hidden',
            border: '1px solid #f3f4f6'
          }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
              padding: '32px' 
            }}>
              <p style={{ 
                color: 'rgba(255,255,255,0.9)', 
                fontSize: '12px', 
                marginBottom: '12px', 
                fontWeight: '600', 
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Farm Size
              </p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <p style={{ color: '#ffffff', fontSize: '48px', fontWeight: 'bold', margin: 0 }}>
                  {Number(acres).toFixed(2)}
                </p>
                <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '20px', fontWeight: '500' }}>
                  acres
                </span>
              </div>
            </div>
          </div>

          {/* Primary Crop */}
          <div style={{ 
            background: 'white', 
            borderRadius: '16px', 
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)', 
            overflow: 'hidden',
            border: '1px solid #f3f4f6'
          }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #3b82f6 0%, #0ea5e9 100%)', 
              padding: '32px' 
            }}>
              <p style={{ 
                color: 'rgba(255,255,255,0.9)', 
                fontSize: '12px', 
                marginBottom: '12px', 
                fontWeight: '600', 
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Primary Crop
              </p>
              <p style={{ 
                color: '#ffffff', 
                fontSize: '48px', 
                fontWeight: 'bold', 
                textTransform: 'capitalize',
                margin: 0
              }}>
                {cropType}
              </p>
            </div>
          </div>

          {/* Carbon Credits */}
          <div style={{ 
            background: 'white', 
            borderRadius: '16px', 
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)', 
            overflow: 'hidden',
            border: '1px solid #f3f4f6'
          }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)', 
              padding: '32px' 
            }}>
              <p style={{ 
                color: 'rgba(255,255,255,0.9)', 
                fontSize: '12px', 
                marginBottom: '12px', 
                fontWeight: '600', 
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Carbon Credits
              </p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <p style={{ color: '#ffffff', fontSize: '48px', fontWeight: 'bold', margin: 0 }}>
                  {Math.round(carbonTons)}
                </p>
                <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '20px', fontWeight: '500' }}>
                  tons
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* NDVI Analysis */}
        <div style={{ 
          background: 'white', 
          borderRadius: '16px', 
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)', 
          marginBottom: '32px',
          overflow: 'hidden',
          border: '1px solid #f3f4f6'
        }}>
          <div style={{ 
            background: 'linear-gradient(to right, #10b981, #059669)', 
            padding: '24px 32px' 
          }}>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: 'white', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              margin: 0,
              marginBottom: '4px'
            }}>
              <span>📈</span> NDVI Analysis
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', margin: 0 }}>
              Normalized Difference Vegetation Index Tracking
            </p>
          </div>
          
          <div style={{ padding: '32px' }}>
            <p style={{ color: '#6b7280', marginBottom: '24px', fontSize: '16px' }}>
              <strong style={{ color: '#111827' }}>Analysis Period:</strong> January 2025 - June 2025
            </p>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '24px', 
              marginBottom: '32px' 
            }}>
              <div style={{ 
                background: 'linear-gradient(135deg, #fef3c7 0%, #fca5a5 50%)', 
                padding: '32px', 
                borderRadius: '16px', 
                border: '2px solid #fed7aa' 
              }}>
                <p style={{ color: '#78350f', fontWeight: '600', marginBottom: '12px', fontSize: '14px' }}>
                  January NDVI (Baseline)
                </p>
                <p style={{ fontSize: '56px', fontWeight: 'bold', color: '#ea580c', margin: 0 }}>
                  {ndviJan.toFixed(3)}
                </p>
              </div>
              <div style={{ 
                background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 50%)', 
                padding: '32px', 
                borderRadius: '16px', 
                border: '2px solid #6ee7b7' 
              }}>
                <p style={{ color: '#064e3b', fontWeight: '600', marginBottom: '12px', fontSize: '14px' }}>
                  June NDVI (Current)
                </p>
                <p style={{ fontSize: '56px', fontWeight: 'bold', color: '#059669', margin: 0 }}>
                  {ndviJun.toFixed(3)}
                </p>
              </div>
            </div>

            <div style={{ 
              background: 'linear-gradient(to right, #d1fae5, #a7f3d0)', 
              padding: '32px', 
              borderRadius: '16px', 
              border: '2px solid #6ee7b7' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <p style={{ color: '#064e3b', fontWeight: '600', marginBottom: '8px' }}>
                    NDVI Increase
                  </p>
                  <p style={{ fontSize: '56px', fontWeight: 'bold', color: '#059669', margin: 0 }}>
                    {ndviIncrease}%
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: '#064e3b', fontWeight: '600', marginBottom: '8px' }}>
                    Growth Status
                  </p>
                  <p style={{ fontSize: '56px', fontWeight: 'bold', color: '#059669', margin: 0 }}>
                    {parseFloat(ndviIncrease) > 0 ? '✓' : '✗'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carbon & Earnings */}
        <div style={{ 
          background: 'white', 
          borderRadius: '16px', 
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          border: '1px solid #f3f4f6'
        }}>
          <div style={{ 
            background: 'linear-gradient(to right, #3b82f6, #0ea5e9)', 
            padding: '24px 32px' 
          }}>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: 'white', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              margin: 0,
              marginBottom: '4px'
            }}>
              <span>💰</span> Carbon Sequestration & Earnings
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', margin: 0 }}>
              Carbon credit calculation and revenue estimation
            </p>
          </div>
          
          <div style={{ padding: '32px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              borderBottom: '2px solid #e5e7eb', 
              paddingBottom: '24px',
              marginBottom: '24px'
            }}>
              <p style={{ color: '#374151', fontSize: '18px', fontWeight: '600', margin: 0 }}>
                Carbon Sequestered
              </p>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                {carbonTons.toFixed(2)} <span style={{ fontSize: '20px', color: '#6b7280' }}>tons CO₂</span>
              </p>
            </div>

            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              borderBottom: '2px solid #e5e7eb', 
              paddingBottom: '24px',
              marginBottom: '24px'
            }}>
              <p style={{ color: '#374151', fontSize: '18px', fontWeight: '600', margin: 0 }}>
                Carbon Credits Earned
              </p>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                {Math.round(carbonTons)} <span style={{ fontSize: '20px', color: '#6b7280' }}>credits</span>
              </p>
            </div>

            <div style={{ 
              background: 'linear-gradient(to right, #d1fae5, #a7f3d0)', 
              padding: '32px', 
              borderRadius: '16px', 
              border: '2px solid #6ee7b7',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <p style={{ color: '#064e3b', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                  Estimated Earnings
                </p>
                <p style={{ fontSize: '56px', fontWeight: 'bold', color: '#059669', margin: 0 }}>
                  ₹{earningsEstimate.toLocaleString('en-IN')}
                </p>
              </div>
              <div style={{ fontSize: '64px' }}>💵</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}