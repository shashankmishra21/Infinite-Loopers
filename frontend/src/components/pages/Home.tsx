import { ArrowRight, TrendingUp, Users, Target, CheckCircle, Satellite, DollarSign } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export function Home({ onNavigate }: HomeProps) {
  const stats = [
    {
      icon: DollarSign,
      value: '₹75,000 Cr',
      label: 'Market Size',
      color: '#22C55E',
    },
    {
      icon: Users,
      value: '15 Crore',
      label: 'Farmers',
      color: '#3B82F6',
    },
    {
      icon: Target,
      value: '95%',
      label: 'Accuracy',
      color: '#059669',
    },
    {
      icon: CheckCircle,
      value: 'Free',
      label: 'Verification',
      color: '#22C55E',
    },
  ];

  const features = [
    {
      icon: Users,
      title: 'Register Your Farm',
      description: 'Simple onboarding process with map-based farm location selection and crop details.',
      color: '#22C55E',
    },
    {
      icon: Satellite,
      title: 'Satellite Verification',
      description: 'AI-powered satellite monitoring tracks your carbon sequestration in real-time.',
      color: '#3B82F6',
    },
    {
      icon: DollarSign,
      title: 'Sell Carbon Credits',
      description: 'List your verified carbon credits on our blockchain-powered marketplace.',
      color: '#059669',
    },
  ];

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
                CarbonSetu empowers Indian farmers to earn carbon credits through AI-powered satellite verification and blockchain technology. Transform your sustainable farming practices into verified income.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => onNavigate('registration')}
                  className="bg-[#22C55E] hover:bg-[#059669] text-white px-8 py-6 rounded-xl text-lg"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  onClick={() => onNavigate('marketplace')}
                  variant="outline"
                  className="border-2 border-[#22C55E] text-[#059669] hover:bg-[#22C55E] hover:text-white px-8 py-6 rounded-xl text-lg"
                >
                  Explore Marketplace
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1709693298800-7e35fc0c8a2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBmYXJtJTIwYWdyaWN1bHR1cmV8ZW58MXx8fHwxNzYzMzY4NDUzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Indian farming landscape"
                  className="w-full h-[400px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#22C55E] rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute -top-6 -left-6 w-40 h-40 bg-[#3B82F6] rounded-full opacity-20 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={index}
                  className="p-6 text-center hover:shadow-lg transition-shadow border-0 shadow-md rounded-2xl"
                >
                  <div
                    className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
                    style={{ backgroundColor: `${stat.color}20` }}
                  >
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

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-[#F3F4F6] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Three simple steps to start earning from your sustainable farming practices
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md rounded-2xl bg-white"
                >
                  <div
                    className="w-16 h-16 rounded-2xl mb-6 flex items-center justify-center"
                    style={{ backgroundColor: `${feature.color}20` }}
                  >
                    <Icon className="w-8 h-8" style={{ color: feature.color }} />
                  </div>
                  <h3 className="text-xl mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                  <div
                    className="mt-6 inline-flex items-center gap-2 hover:gap-3 transition-all cursor-pointer"
                    style={{ color: feature.color }}
                  >
                    Learn more
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#22C55E] to-[#059669]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl text-white mb-6">
            Ready to Start Earning?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Join thousands of Indian farmers already benefiting from carbon credits
          </p>
          <Button
            onClick={() => onNavigate('registration')}
            className="bg-white text-[#059669] hover:bg-gray-100 px-8 py-6 rounded-xl text-lg"
          >
            Register Your Farm Today
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
