import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import 'leaflet/dist/leaflet.css';

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
        alert('Registration successful!');
        setLoading(false);
        onNavigate('dashboard');
      } else {
        alert('Registration failed: ' + json.error);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error during registration');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 pb-12">
      {/* Professional Header */}
      <div className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🌾</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Farm Registration</h1>
              <p className="text-sm text-gray-600">CarbonSetu - Blockchain Carbon Credit Platform</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Farmer Details Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-5">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>📋</span> Farmer Details
              </h2>
              <p className="text-green-50 text-sm mt-1">Please provide your personal and farm information</p>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text"
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., Rajesh Kumar"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    maxLength={10}
                    placeholder="e.g., 9876543210"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select 
                    value={formData.state} 
                    onChange={e => setFormData({...formData, state: e.target.value})}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none bg-white"
                  >
                    <option value="">-- Select State --</option>
                    {states.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    District <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text"
                    value={formData.district} 
                    onChange={e => setFormData({...formData, district: e.target.value})}
                    placeholder="e.g., Ludhiana"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Village / Town <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text"
                    value={formData.village} 
                    onChange={e => setFormData({...formData, village: e.target.value})}
                    placeholder="e.g., Khanna"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Primary Crop <span className="text-red-500">*</span>
                  </label>
                  <select 
                    value={formData.cropType} 
                    onChange={e => setFormData({...formData, cropType: e.target.value})}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none bg-white"
                  >
                    <option value="">-- Select Primary Crop --</option>
                    {crops.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Map Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-5">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>🗺️</span> Farm Boundary Selection
              </h2>
              <p className="text-blue-50 text-sm mt-1">Draw your farm area on the interactive map</p>
            </div>
            
            <div className="p-8">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 p-5 mb-6 rounded-lg">
                <p className="text-sm text-blue-900 font-medium leading-relaxed">
                  <strong className="text-blue-800">📍 Instructions:</strong> Use the <strong>polygon tool (📐)</strong> located on the right side of the map. 
                  Click multiple points on the map to outline your farm boundary. Double-click or click the first point again to complete the shape.
                </p>
              </div>

              <div 
                className="relative border-4 border-gray-200 rounded-2xl overflow-hidden shadow-lg"
                style={{ height: '500px', position: 'relative', zIndex: 1 }}
              >
                <MapContainer 
                  center={[20.5937, 78.9629]} 
                  zoom={5} 
                  style={{ height: '100%', width: '100%', position: 'relative', zIndex: 1 }}
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
                <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-5 rounded-lg animate-pulse">
                  <p className="text-green-800 font-bold flex items-center gap-3">
                    <span className="text-3xl">✅</span>
                    <span>Farm boundary selected successfully! You can now proceed with registration.</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <button 
              type="submit" 
              disabled={loading || !farmBoundary}
              className={`w-full py-5 px-8 rounded-xl font-bold text-lg transition-all duration-300 transform ${
                loading || !farmBoundary 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 text-white shadow-2xl hover:shadow-green-500/50 hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Processing Registration...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-3">
                  <span className="text-2xl">🚀</span>
                  Register Farm & Fetch Satellite Data
                </span>
              )}
            </button>
            
            {!farmBoundary && (
              <p className="text-center text-sm text-gray-500 mt-4">
                Please draw your farm boundary on the map to enable registration
              </p>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}