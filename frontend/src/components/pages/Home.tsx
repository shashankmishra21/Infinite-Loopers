import { useState, useEffect } from 'react';
import { ArrowRight, Users, Target, CheckCircle, Satellite } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export function Home({ onNavigate }: HomeProps) {
  const [stats, setStats] = useState({
    marketSize: '₹75,000 Cr',
    farmers: '15 Crore',
    accuracy: '95%',
    verification: 'Free'
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/marketplace/stats');
        const data = await res.json();
        if (data.success) {
          setStats({
            marketSize: `₹${(data.data.totalTransactionValue / 1e7).toFixed(2)} Cr`,
            farmers: data.data.totalCredits.toLocaleString(),
            accuracy: '95%',
            verification: 'Free'
          });
        }
      } catch (error) {
        console.error('Failed to fetch stats', error);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F3F4F6]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-gray-900">
                Earn Carbon Credits From Your Farm
              </h1>
              <p className="text-lg md:text-xl text-gray-600">
                CarbonSetu empowers Indian farmers to earn carbon credits through AI-powered satellite verification and blockchain technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => onNavigate('registration')}
                  className="bg-[#22C55E] hover:bg-[#059669] text-white px-8 py-6 rounded-xl text-lg"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Users, value: stats.marketSize, label: 'Market Size', color: '#22C55E' },
              { icon: Target, value: stats.farmers, label: 'Farmers', color: '#3B82F6' },
              { icon: CheckCircle, value: stats.accuracy, label: 'Accuracy', color: '#059669' },
              { icon: Satellite, value: stats.verification, label: 'Verification', color: '#22C55E' }
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <Card key={idx} className="p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: `${stat.color}20` }}>
                    <Icon className="w-6 h-6" style={{ color: stat.color }} />
                  </div>
                  <div className="text-3xl mb-2 text-gray-900">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
