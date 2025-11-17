import { useState } from 'react';
import { Leaf, DollarSign, Award, TrendingUp } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export function Dashboard() {
  const [selectedMonth, setSelectedMonth] = useState<'january' | 'june'>('january');

  const carbonData = [
    { month: 'Jan', carbon: 12 },
    { month: 'Feb', carbon: 15 },
    { month: 'Mar', carbon: 18 },
    { month: 'Apr', carbon: 22 },
    { month: 'May', carbon: 28 },
    { month: 'Jun', carbon: 35 },
    { month: 'Jul', carbon: 32 },
    { month: 'Aug', carbon: 29 },
    { month: 'Sep', carbon: 26 },
    { month: 'Oct', carbon: 24 },
    { month: 'Nov', carbon: 20 },
    { month: 'Dec', carbon: 18 },
  ];

  const overviewCards = [
    {
      icon: Leaf,
      label: 'Carbon Sequestered',
      value: '245 tons',
      change: '+12%',
      color: '#22C55E',
    },
    {
      icon: DollarSign,
      label: 'Estimated Earnings',
      value: '₹3,67,500',
      change: '+8%',
      color: '#3B82F6',
    },
    {
      icon: Award,
      label: 'Verified Credits',
      value: '187 tons',
      change: '+15%',
      color: '#059669',
    },
  ];

  // Carbon meter progress (0-100)
  const carbonProgress = 76;
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (carbonProgress / 100) * circumference;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F3F4F6] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl text-gray-900 mb-2">
            Farmer Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Track your carbon sequestration and earnings in real-time
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {overviewCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card
                key={index}
                className="p-6 shadow-lg rounded-2xl border-0 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${card.color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: card.color }} />
                  </div>
                  <div
                    className="px-3 py-1 rounded-full text-sm"
                    style={{ backgroundColor: `${card.color}20`, color: card.color }}
                  >
                    {card.change}
                  </div>
                </div>
                <div className="text-gray-600 mb-1">{card.label}</div>
                <div className="text-3xl text-gray-900">{card.value}</div>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Carbon Meter */}
          <Card className="p-8 shadow-lg rounded-2xl border-0 lg:col-span-1">
            <h2 className="text-xl text-gray-900 mb-6">Carbon Meter</h2>
            <div className="flex flex-col items-center">
              <svg width="200" height="200" className="transform -rotate-90">
                {/* Background circle */}
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  stroke="#E5E7EB"
                  strokeWidth="16"
                  fill="none"
                />
                {/* Progress circle */}
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  stroke="#22C55E"
                  strokeWidth="16"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="text-center -mt-32">
                <div className="text-4xl text-gray-900 mb-1">{carbonProgress}%</div>
                <div className="text-gray-600">of target</div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Current</span>
                <span className="text-gray-900">245 tons</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Target</span>
                <span className="text-gray-900">320 tons</span>
              </div>
            </div>
          </Card>

          {/* NDVI Satellite Comparison */}
          <Card className="p-8 shadow-lg rounded-2xl border-0 lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl text-gray-900">NDVI Satellite Analysis</h2>
              <div className="flex gap-2">
                <Button
                  variant={selectedMonth === 'january' ? 'default' : 'outline'}
                  onClick={() => setSelectedMonth('january')}
                  className={`rounded-lg ${
                    selectedMonth === 'january'
                      ? 'bg-[#22C55E] hover:bg-[#059669]'
                      : 'border-gray-300'
                  }`}
                >
                  January
                </Button>
                <Button
                  variant={selectedMonth === 'june' ? 'default' : 'outline'}
                  onClick={() => setSelectedMonth('june')}
                  className={`rounded-lg ${
                    selectedMonth === 'june'
                      ? 'bg-[#22C55E] hover:bg-[#059669]'
                      : 'border-gray-300'
                  }`}
                >
                  June
                </Button>
              </div>
            </div>

            {/* Satellite Image */}
            <div className="mb-6 relative rounded-xl overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1574786198374-9461cb650c23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXRlbGxpdGUlMjBlYXJ0aCUyMHZpZXd8ZW58MXx8fHwxNzYzMzEyOTYxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Satellite view"
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4 bg-[#22C55E] text-white px-4 py-2 rounded-lg shadow-lg">
                NDVI: {selectedMonth === 'january' ? '0.65' : '0.82'}
              </div>
            </div>

            {/* Comparison Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100">
                <div className="text-gray-600 mb-1">January NDVI</div>
                <div className="text-2xl text-gray-900">0.65</div>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100">
                <div className="text-gray-600 mb-1">June NDVI</div>
                <div className="text-2xl text-gray-900">0.82</div>
                <div className="flex items-center gap-1 text-[#22C55E] mt-1">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">+26% growth</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Monthly Carbon Chart */}
        <Card className="p-8 shadow-lg rounded-2xl border-0">
          <h2 className="text-xl text-gray-900 mb-6">Monthly Carbon Sequestration</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={carbonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" label={{ value: 'Tons', angle: -90, position: 'insideLeft' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                }}
              />
              <Bar dataKey="carbon" fill="#22C55E" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
