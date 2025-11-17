import { useState } from 'react';
import { RotateCw, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

export function DigitalTwin() {
  const [rotation, setRotation] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F3F4F6] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl text-gray-900 mb-4">
            Digital Twin - 3D Farm View
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore a 3D visualization of your farm with real-time satellite data integration. 
            View carbon density maps, crop health indicators, and soil analysis in an interactive environment.
          </p>
        </div>

        {/* 3D Canvas Section */}
        <Card className="p-8 shadow-lg rounded-2xl border-0 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl text-gray-900">Interactive 3D Model</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRotation(rotation + 45)}
                className="rounded-lg border-gray-300"
              >
                <RotateCw className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg border-gray-300"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg border-gray-300"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg border-gray-300"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* 3D Canvas Placeholder */}
          <div className="relative w-full h-[500px] bg-gradient-to-br from-[#E8F5E9] via-[#C8E6C9] to-[#A5D6A7] rounded-xl overflow-hidden">
            {/* Grid background */}
            <div className="absolute inset-0 opacity-10">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={`h-${i}`}
                  className="absolute w-full border-t border-gray-900"
                  style={{ top: `${i * 5}%` }}
                />
              ))}
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={`v-${i}`}
                  className="absolute h-full border-l border-gray-900"
                  style={{ left: `${i * 5}%` }}
                />
              ))}
            </div>

            {/* 3D farm illustration */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="relative transition-transform duration-500"
                style={{ transform: `rotateY(${rotation}deg)` }}
              >
                {/* Farm field representation */}
                <div className="relative w-80 h-80">
                  {/* Field sections with different shades representing crop density */}
                  <div className="absolute top-0 left-0 w-36 h-36 bg-[#22C55E] rounded-lg shadow-2xl transform -rotate-6 opacity-90"></div>
                  <div className="absolute top-8 right-0 w-40 h-40 bg-[#059669] rounded-lg shadow-2xl transform rotate-3 opacity-80"></div>
                  <div className="absolute bottom-0 left-8 w-44 h-44 bg-[#10B981] rounded-lg shadow-2xl transform rotate-12 opacity-85"></div>
                  
                  {/* Trees/vegetation markers */}
                  <div className="absolute top-20 left-24 w-8 h-8 bg-[#065F46] rounded-full shadow-lg"></div>
                  <div className="absolute top-32 right-28 w-6 h-6 bg-[#065F46] rounded-full shadow-lg"></div>
                  <div className="absolute bottom-24 left-32 w-10 h-10 bg-[#065F46] rounded-full shadow-lg"></div>
                </div>
              </div>
            </div>

            {/* Controls hint */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
              <p className="text-sm text-gray-700">
                <span className="inline-block mr-4">🖱️ Drag to rotate</span>
                <span className="inline-block mr-4">• 🔍 Scroll to zoom</span>
                <span className="inline-block">• Click for details</span>
              </p>
            </div>

            {/* Info badges */}
            <div className="absolute top-6 left-6 space-y-2">
              <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md">
                <div className="text-xs text-gray-600">Carbon Density</div>
                <div className="text-sm text-gray-900">High</div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md">
                <div className="text-xs text-gray-600">Crop Health</div>
                <div className="text-sm text-[#22C55E]">Excellent</div>
              </div>
            </div>

            <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md">
              <div className="text-xs text-gray-600 mb-1">Last Updated</div>
              <div className="text-sm text-gray-900">2 hours ago</div>
            </div>
          </div>
        </Card>

        {/* Feature Info Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 shadow-lg rounded-2xl border-0">
            <div className="w-12 h-12 bg-[#22C55E]/20 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🌱</span>
            </div>
            <h3 className="text-lg text-gray-900 mb-2">Vegetation Analysis</h3>
            <p className="text-gray-600">
              Real-time NDVI data shows vegetation health and density across different farm sections.
            </p>
          </Card>

          <Card className="p-6 shadow-lg rounded-2xl border-0">
            <div className="w-12 h-12 bg-[#3B82F6]/20 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🛰️</span>
            </div>
            <h3 className="text-lg text-gray-900 mb-2">Satellite Integration</h3>
            <p className="text-gray-600">
              Multi-spectral satellite imagery updated weekly to track carbon sequestration patterns.
            </p>
          </Card>

          <Card className="p-6 shadow-lg rounded-2xl border-0">
            <div className="w-12 h-12 bg-[#059669]/20 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-lg text-gray-900 mb-2">Carbon Mapping</h3>
            <p className="text-gray-600">
              Visual representation of carbon density zones helping optimize farming practices.
            </p>
          </Card>
        </div>

        {/* Technical Details */}
        <Card className="p-8 shadow-lg rounded-2xl border-0 mt-8 bg-gradient-to-br from-gray-50 to-white">
          <h2 className="text-xl text-gray-900 mb-6">Technical Specifications</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Data Source</div>
                <div className="text-gray-900">Sentinel-2 & Landsat-8 Satellites</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Update Frequency</div>
                <div className="text-gray-900">Every 5 days (weather permitting)</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Resolution</div>
                <div className="text-gray-900">10m per pixel</div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Analysis Metrics</div>
                <div className="text-gray-900">NDVI, EVI, SAVI, Carbon Density</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">AI Model Accuracy</div>
                <div className="text-gray-900">95% (validated against ground truth)</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Processing Time</div>
                <div className="text-gray-900">{"< 2 hours from satellite pass"}</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
