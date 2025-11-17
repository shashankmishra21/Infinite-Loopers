import { useState } from 'react';
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

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Simulate coordinates (in real app, this would use actual map library)
    const lat = 20.5937 + (y / rect.height) * 10;
    const lng = 78.9629 + (x / rect.width) * 10;
    
    setMapPin({ lat, lng });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, this would save data
    onNavigate('dashboard');
  };

  const states = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
    // Union Territories
    'Andaman and Nicobar Islands',
    'Chandigarh',
    'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi',
    'Jammu and Kashmir',
    'Ladakh',
    'Lakshadweep',
    'Puducherry',
  ];
  const crops = ['Rice', 'Wheat', 'Cotton', 'Sugarcane', 'Pulses', 'Vegetables'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F3F4F6] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl text-gray-900 mb-4">
            Register Your Farm
          </h1>
          <p className="text-lg text-gray-600">
            Complete the form below to start earning carbon credits
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Left Column - Form */}
            <Card className="p-8 shadow-lg rounded-2xl border-0">
              <h2 className="text-xl text-gray-900 mb-6">Farmer Details</h2>
              
              <div className="space-y-6">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-2 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-2 rounded-lg"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="state">State</Label>
                    <select
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
                      required
                    >
                      <option value="">Select State</option>
                      {states.map((state) => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="district">District</Label>
                    <Input
                      id="district"
                      placeholder="District"
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="mt-2 rounded-lg"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="village">Village</Label>
                  <Input
                    id="village"
                    placeholder="Village name"
                    value={formData.village}
                    onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                    className="mt-2 rounded-lg"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="farmSize">Farm Size (acres)</Label>
                    <Input
                      id="farmSize"
                      type="number"
                      placeholder="5"
                      value={formData.farmSize}
                      onChange={(e) => setFormData({ ...formData, farmSize: e.target.value })}
                      className="mt-2 rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="cropType">Crop Type</Label>
                    <select
                      id="cropType"
                      value={formData.cropType}
                      onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
                      className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
                      required
                    >
                      <option value="">Select Crop</option>
                      {crops.map((crop) => (
                        <option key={crop} value={crop}>{crop}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </Card>

            {/* Right Column - Illustration */}
            <div className="space-y-8">
              <Card className="p-8 shadow-lg rounded-2xl border-0 bg-gradient-to-br from-[#22C55E]/10 to-[#3B82F6]/10">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-[#22C55E] rounded-full mx-auto flex items-center justify-center mb-6">
                    <MapPin className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl text-gray-900">Why Register?</h3>
                  <div className="space-y-3 text-left">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-[#22C55E] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <p className="text-gray-600">Get verified carbon credits from your farm</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-[#22C55E] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <p className="text-gray-600">AI-powered satellite monitoring</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-[#22C55E] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <p className="text-gray-600">Earn additional income from sustainable practices</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-[#22C55E] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <p className="text-gray-600">Blockchain-secured certificates</p>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="rounded-2xl overflow-hidden shadow-lg">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1694093817187-0c913bc4ad87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtZXIlMjB3b3JraW5nJTIwZmllbGR8ZW58MXx8fHwxNzYzMjg1NzM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Farmer working in field"
                  className="w-full h-64 object-cover"
                />
              </div>
            </div>
          </div>

          {/* Map Section */}
          <Card className="p-8 shadow-lg rounded-2xl border-0 mb-8">
            <h2 className="text-xl text-gray-900 mb-4">Farm Location</h2>
            <p className="text-gray-600 mb-4">Click on the map to mark your farm location</p>
            
            <div
              onClick={handleMapClick}
              className="relative w-full h-[400px] bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] rounded-xl overflow-hidden cursor-crosshair border-2 border-gray-200"
            >
              {/* Simulated map grid */}
              <div className="absolute inset-0 opacity-20">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={`h-${i}`}
                    className="absolute w-full border-t border-gray-400"
                    style={{ top: `${i * 10}%` }}
                  />
                ))}
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={`v-${i}`}
                    className="absolute h-full border-l border-gray-400"
                    style={{ left: `${i * 10}%` }}
                  />
                ))}
              </div>

              {/* Map labels */}
              <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-lg shadow-md">
                <p className="text-sm text-gray-600">Click to drop pin</p>
              </div>

              {/* Pin */}
              {mapPin && (
                <div
                  className="absolute transform -translate-x-1/2 -translate-y-full"
                  style={{
                    left: `${((mapPin.lng - 78.9629) / 10) * 100}%`,
                    top: `${((mapPin.lat - 20.5937) / 10) * 100}%`,
                  }}
                >
                  <MapPin className="w-10 h-10 text-[#22C55E] drop-shadow-lg" fill="#22C55E" />
                </div>
              )}

              {/* Coordinates display */}
              {mapPin && (
                <div className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg shadow-md">
                  <p className="text-sm text-gray-600">
                    Lat: {mapPin.lat.toFixed(4)}, Lng: {mapPin.lng.toFixed(4)}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              className="bg-[#22C55E] hover:bg-[#059669] text-white px-12 py-6 rounded-xl text-lg"
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
