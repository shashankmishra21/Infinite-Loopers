import React, { useState } from 'react';
import { MapPin, Save } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface RegistrationProps {
  onNavigate: (page: string) => void;
}

export function Registration({ onNavigate }: RegistrationProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    state: '',
    district: '',
    village: '',
    farmSize: '',
    cropType: '',
  });

  const [mapPin, setMapPin] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Simulate coordinates (in real app, this would use actual map library)
    const lat = 20.5937 + (y / rect.height) * 10;
    const lng = 78.9629 + (x / rect.width) * 10;

    setMapPin({ lat, lng });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mapPin) {
      setError('Please select a farm location on the map.');
      return;
    }

    setError(null);

    // Prepare payload matching backend schema
    const payload = {
      name: formData.name,
      phone: formData.phone,
      lat: mapPin.lat,
      lng: mapPin.lng,
      acres: parseFloat(formData.farmSize),
      cropType: formData.cropType.toLowerCase(),
      farmingPractice: 'conventional', // Default, or add field if user selects
    };

    try {
      const res = await fetch('/api/farmers/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resJson = await res.json();

      if (!res.ok || !resJson.success) {
        setError(resJson.error || 'Registration failed. Please try again.');
        return;
      }

      // On success, navigate dashboard or show success message
      onNavigate('dashboard');
    } catch (err) {
      console.error('Error saving registration', err);
      setError('Network error. Please try again later.');
    }
  };

  const crops = ['Rice', 'Wheat', 'Cotton', 'Sugarcane', 'Pulses', 'Vegetables'];
  const states = [
    'Andhra Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Gujarat',
    'Haryana',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Tamil Nadu',
    'Uttar Pradesh',
    'West Bengal',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F3F4F6] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl text-gray-900 mb-4">Register Your Farm</h1>
          <p className="text-lg text-gray-600">Complete the form below to start earning carbon credits</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Form inputs */}
          <Card className="p-8 shadow-lg rounded-2xl border-0 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Farmer name"
                />
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">Phone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="10-digit phone number"
                />
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">State</Label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full rounded-md border px-3 py-2"
                >
                  <option value="">Select state</option>
                  {states.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">District</Label>
                <Input
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  placeholder="District"
                />
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">Village</Label>
                <Input
                  value={formData.village}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  placeholder="Village"
                />
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">Farm size (acres)</Label>
                <Input
                  value={formData.farmSize}
                  onChange={(e) => setFormData({ ...formData, farmSize: e.target.value })}
                  placeholder="e.g. 2.5"
                />
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">Primary crop</Label>
                <select
                  value={formData.cropType}
                  onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
                  className="w-full rounded-md border px-3 py-2"
                >
                  <option value="">Select crop</option>
                  {crops.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {/* Map Section */}
          <Card className="p-8 shadow-lg rounded-2xl border-0 mb-8">
            <h2 className="text-xl text-gray-900 mb-4">Farm Location</h2>
            <p className="text-gray-600 mb-4">Click on the map to mark your farm location</p>

            <div
              onClick={handleMapClick}
              className="relative w-full h-[400px] bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] rounded-xl overflow-hidden cursor-crosshair border-2 border-gray-200"
            >
              {/* Simple grid overlay */}
              <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 opacity-10">
                {Array.from({ length: 100 }).map((_, i) => (
                  <div key={i} className="border border-transparent" />
                ))}
              </div>

              {/* Pin */}
              {mapPin && (
                <div
                  style={{ left: '50%', top: '50%' }}
                  className="absolute pointer-events-none"
                >
                  <div className="transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
                    <MapPin className="w-8 h-8 text-red-600" />
                    <div className="bg-white/80 px-2 py-1 rounded-md text-sm shadow">{`(${mapPin.lat.toFixed(4)}, ${mapPin.lng.toFixed(4)})`}</div>
                  </div>
                </div>
              )}
            </div>
            {error && <p className="text-red-600 mt-2">{error}</p>}
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={!mapPin}
              className="bg-[#22C55E] hover:bg-[#059669] text-white px-12 py-6 rounded-xl text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="mr-2 w-5 h-5" />
              Save & Continue
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
