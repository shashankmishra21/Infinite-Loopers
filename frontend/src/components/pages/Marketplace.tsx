import { useState } from 'react';
import { Search, Filter, MapPin, CheckCircle, ShoppingCart } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export function Marketplace() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('price-low');
  const [regionFilter, setRegionFilter] = useState('all');

  const listings = [
    {
      id: 1,
      location: 'Nashik, Maharashtra',
      farmer: 'Ramesh Kumar',
      verified: true,
      tons: 25,
      pricePerTon: 1500,
      cropType: 'Wheat',
      ndvi: 0.78,
    },
    {
      id: 2,
      location: 'Amritsar, Punjab',
      farmer: 'Gurpreet Singh',
      verified: true,
      tons: 40,
      pricePerTon: 1450,
      cropType: 'Rice',
      ndvi: 0.82,
    },
    {
      id: 3,
      location: 'Dharwad, Karnataka',
      farmer: 'Lakshmi Devi',
      verified: true,
      tons: 18,
      pricePerTon: 1600,
      cropType: 'Cotton',
      ndvi: 0.75,
    },
    {
      id: 4,
      location: 'Meerut, Uttar Pradesh',
      farmer: 'Vijay Patel',
      verified: true,
      tons: 32,
      pricePerTon: 1480,
      cropType: 'Sugarcane',
      ndvi: 0.80,
    },
    {
      id: 5,
      location: 'Anand, Gujarat',
      farmer: 'Kiran Shah',
      verified: true,
      tons: 22,
      pricePerTon: 1550,
      cropType: 'Vegetables',
      ndvi: 0.76,
    },
    {
      id: 6,
      location: 'Jaipur, Rajasthan',
      farmer: 'Mohan Meena',
      verified: true,
      tons: 15,
      pricePerTon: 1620,
      cropType: 'Pulses',
      ndvi: 0.72,
    },
  ];

  const regions = ['All Regions', 'Maharashtra', 'Punjab', 'Karnataka', 'Uttar Pradesh', 'Gujarat', 'Rajasthan'];

  const filteredListings = listings
    .filter((listing) => {
      const matchesSearch = 
        listing.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.farmer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.cropType.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRegion = 
        regionFilter === 'all' || 
        listing.location.includes(regionFilter);
      
      return matchesSearch && matchesRegion;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.pricePerTon - b.pricePerTon;
      if (sortBy === 'price-high') return b.pricePerTon - a.pricePerTon;
      if (sortBy === 'tons-high') return b.tons - a.tons;
      return 0;
    });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F3F4F6] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl text-gray-900 mb-2">
            Carbon Credit Marketplace
          </h1>
          <p className="text-lg text-gray-600">
            Browse and purchase verified carbon credits from Indian farmers
          </p>
        </div>

        {/* Filters Section */}
        <Card className="p-6 shadow-lg rounded-2xl border-0 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search by location, farmer, or crop..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-lg"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#22C55E] appearance-none bg-white"
              >
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="tons-high">Tons: High to Low</option>
              </select>
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>

            {/* Region Filter */}
            <div className="relative">
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#22C55E] appearance-none bg-white"
              >
                {regions.map((region) => (
                  <option key={region} value={region === 'All Regions' ? 'all' : region}>
                    {region}
                  </option>
                ))}
              </select>
              <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredListings.length} listing{filteredListings.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Marketplace Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <Card
              key={listing.id}
              className="p-6 shadow-lg rounded-2xl border-0 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#22C55E]" />
                  <span className="text-gray-900">{listing.location}</span>
                </div>
                {listing.verified && (
                  <div className="bg-[#22C55E]/10 p-1.5 rounded-full">
                    <CheckCircle className="w-5 h-5 text-[#22C55E]" />
                  </div>
                )}
              </div>

              {/* Farmer Info */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#22C55E] to-[#059669] rounded-full flex items-center justify-center text-white">
                    {listing.farmer.charAt(0)}
                  </div>
                  <div>
                    <div className="text-gray-900">{listing.farmer}</div>
                    <div className="text-sm text-gray-600">{listing.cropType}</div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-1">Available</div>
                  <div className="text-lg text-gray-900">{listing.tons} tons</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-1">NDVI Score</div>
                  <div className="text-lg text-[#22C55E]">{listing.ndvi}</div>
                </div>
              </div>

              {/* Pricing */}
              <div className="mb-4 p-4 bg-gradient-to-br from-[#22C55E]/5 to-[#3B82F6]/5 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Price per ton</span>
                  <span className="text-lg text-gray-900">₹{listing.pricePerTon.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="text-gray-900">Total Price</span>
                  <span className="text-xl text-[#059669]">
                    ₹{(listing.tons * listing.pricePerTon).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Buy Button */}
              <Button className="w-full bg-[#22C55E] hover:bg-[#059669] text-white rounded-lg py-6">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Buy Credits
              </Button>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredListings.length === 0 && (
          <Card className="p-12 text-center shadow-lg rounded-2xl border-0">
            <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl text-gray-900 mb-2">No listings found</h3>
            <p className="text-gray-600">
              Try adjusting your search or filters to find more carbon credits
            </p>
          </Card>
        )}

        {/* Info Banner */}
        <Card className="p-6 shadow-lg rounded-2xl border-0 mt-8 bg-gradient-to-r from-[#22C55E]/10 to-[#3B82F6]/10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#22C55E] rounded-xl flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg text-gray-900 mb-2">All Credits are Verified</h3>
              <p className="text-gray-600">
                Every carbon credit on our marketplace is verified using AI-powered satellite monitoring 
                and blockchain technology. Transactions are secure, transparent, and traceable.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
