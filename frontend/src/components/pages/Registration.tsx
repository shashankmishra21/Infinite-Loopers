import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import 'leaflet/dist/leaflet.css';

// Component to add Geoman controls
function GeomanControls({ onShapeCreated }: { onShapeCreated: (coords: any) => void }) {
  const map = useMap();

  useEffect(() => {
    map.pm.addControls({
      position: 'topright',
      drawPolygon: true,
      drawCircle: false,
      drawCircleMarker: false,
      drawPolyline: false,
      drawRectangle: true,
      drawMarker: false,
      drawText: false,
      editMode: true,
      dragMode: false,
      cutPolygon: false,
      removalMode: true
    });

    map.on('pm:create', (e: any) => {
      const layer = e.layer as L.Polygon | L.Rectangle;
      const geoJSON = (layer as any).toGeoJSON();
      console.log('Polygon created:', geoJSON.geometry.coordinates);
      onShapeCreated(geoJSON.geometry.coordinates);
    });

    return () => {
      map.pm.removeControls();
      map.off('pm:create');
    };
  }, [map, onShapeCreated]);

  return null;
}

export function Registration({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    state: '',
    district: '',
    village: '',
    cropType: '',
  });

  const [farmBoundary, setFarmBoundary] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const crops = ['Rice', 'Wheat', 'Cotton', 'Sugarcane', 'Pulses', 'Vegetables'];
  const states = ['Andhra Pradesh', 'Bihar', 'Gujarat', 'Punjab', 'Karnataka', 'Maharashtra', 'Uttar Pradesh'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!farmBoundary) {
      alert('Please draw your farm boundary on the map');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        farmBoundary: farmBoundary,
        dateRange: {
          start: '2025-01-01',
          end: '2025-06-30'
        }
      };

      const res = await fetch('http://localhost:5000/api/farmers/register-with-satellite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      
      if (json.success) {
        alert('✅ Registration successful!');
        setLoading(false);
        onNavigate('dashboard');
      } else {
        alert('❌ Registration failed: ' + json.error);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error during registration');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-gray-800">🌾 Register Your Farm</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Form Fields Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-3">
              📋 Farmer Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter your full name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input 
                  type="tel"
                  value={formData.phone} 
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State <span className="text-red-500">*</span>
                </label>
                <select 
                  value={formData.state} 
                  onChange={e => setFormData({...formData, state: e.target.value})}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select State</option>
                  {states.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  value={formData.district} 
                  onChange={e => setFormData({...formData, district: e.target.value})}
                  placeholder="Enter district"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Village <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  value={formData.village} 
                  onChange={e => setFormData({...formData, village: e.target.value})}
                  placeholder="Enter village"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Crop <span className="text-red-500">*</span>
                </label>
                <select 
                  value={formData.cropType} 
                  onChange={e => setFormData({...formData, cropType: e.target.value})}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select Crop</option>
                  {crops.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-3">
              🗺️ Draw Your Farm Boundary
            </h2>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
              <p className="text-sm text-blue-900 font-medium">
                📍 <strong>How to use:</strong> Click the polygon tool (📐) on the right side of the map. 
                Click multiple points to draw your farm boundary. Double-click to finish.
              </p>
            </div>

            <div className="relative border-4 border-gray-200 rounded-lg overflow-hidden" style={{ height: '500px' }}>
              <MapContainer 
                center={[20.5937, 78.9629]} 
                zoom={5} 
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
              >
                <TileLayer 
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap'
                />
                <GeomanControls onShapeCreated={setFarmBoundary} />
              </MapContainer>
            </div>

            {farmBoundary && (
              <div className="mt-4 bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <p className="text-green-800 font-semibold flex items-center gap-2">
                  <span className="text-2xl">✅</span>
                  Farm boundary selected! You can now submit the form.
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <button 
              type="submit" 
              disabled={loading || !farmBoundary}
              className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all transform ${
                loading || !farmBoundary 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:shadow-xl hover:scale-[1.02]'
              }`}
            >
              {loading ? '⏳ Processing...' : '🚀 Register & Fetch Satellite Data'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}