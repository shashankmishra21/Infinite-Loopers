import { Download, Share2, CheckCircle, Award } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

export function Certificate() {
  const certificateData = {
    farmerName: 'Ramesh Kumar',
    location: 'Nashik, Maharashtra',
    tonsSequestered: 25.5,
    dateRange: 'January 2024 - November 2024',
    certificateId: 'CC-2024-MH-0482',
    blockchainHash: '0x7a8f3e2c9b1d4a5e6f8c2b3d9e1a4f5c7b8d2e3a',
    issueDate: 'November 17, 2024',
    cropType: 'Wheat',
    farmSize: '15 acres',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F3F4F6] py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl text-gray-900 mb-4">
            Carbon Credit Certificate
          </h1>
          <p className="text-lg text-gray-600">
            Official verification of carbon sequestration secured on blockchain
          </p>
        </div>

        {/* Certificate Card */}
        <Card className="p-8 md:p-12 shadow-2xl rounded-3xl border-4 border-[#22C55E] bg-white mb-8 relative overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#22C55E]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#3B82F6]/5 rounded-full blur-3xl"></div>

          {/* Certificate Content */}
          <div className="relative">
            {/* Header Logo & Badge */}
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-[#22C55E] rounded-2xl flex items-center justify-center">
                  <Award className="w-10 h-10 text-white" />
                </div>
                <div>
                  <div className="text-2xl text-[#059669]">CarbonSetu</div>
                  <div className="text-sm text-gray-600">Carbon Credit Platform</div>
                </div>
              </div>
              <div className="bg-[#22C55E] text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Verified</span>
              </div>
            </div>

            {/* Certificate Title */}
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl text-gray-900 mb-2">
                Carbon Credit Certificate
              </h2>
              <p className="text-gray-600">
                This certifies that carbon sequestration has been verified and registered
              </p>
            </div>

            {/* Main Content */}
            <div className="space-y-6 mb-8">
              {/* Farmer Details */}
              <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-200">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Farmer Name</div>
                    <div className="text-xl text-gray-900">{certificateData.farmerName}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Farm Location</div>
                    <div className="text-xl text-gray-900">{certificateData.location}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Crop Type</div>
                    <div className="text-xl text-gray-900">{certificateData.cropType}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Farm Size</div>
                    <div className="text-xl text-gray-900">{certificateData.farmSize}</div>
                  </div>
                </div>
              </div>

              {/* Carbon Details */}
              <div className="bg-gradient-to-br from-[#22C55E]/10 to-[#059669]/10 p-8 rounded-2xl border-2 border-[#22C55E] text-center">
                <div className="text-sm text-gray-600 mb-2">Total Carbon Sequestered</div>
                <div className="text-5xl text-[#059669] mb-2">
                  {certificateData.tonsSequestered}
                </div>
                <div className="text-xl text-gray-900">metric tons CO₂e</div>
                <div className="mt-4 text-gray-600">
                  Period: {certificateData.dateRange}
                </div>
              </div>

              {/* Certificate Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="text-sm text-gray-600 mb-1">Certificate ID</div>
                  <div className="text-gray-900 font-mono">{certificateData.certificateId}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="text-sm text-gray-600 mb-1">Issue Date</div>
                  <div className="text-gray-900">{certificateData.issueDate}</div>
                </div>
              </div>

              {/* Blockchain Hash */}
              <div className="bg-gradient-to-br from-[#3B82F6]/10 to-[#3B82F6]/5 p-6 rounded-2xl border border-[#3B82F6]/30">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#3B82F6] rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-lg">⛓️</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-600 mb-1">Blockchain Transaction Hash</div>
                    <div className="text-gray-900 font-mono text-sm break-all">
                      {certificateData.blockchainHash}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Statement */}
            <div className="text-center py-6 border-t border-b border-gray-200 mb-6">
              <p className="text-gray-600 italic">
                This certificate confirms that the above-mentioned carbon credits have been verified 
                using AI-powered satellite monitoring and registered on the blockchain for transparency 
                and immutability.
              </p>
            </div>

            {/* Signatures */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="text-center">
                <div className="h-16 flex items-end justify-center mb-2">
                  <div className="text-2xl text-[#059669] italic">CarbonSetu</div>
                </div>
                <div className="text-sm text-gray-600 border-t border-gray-300 pt-2">
                  Platform Verification Officer
                </div>
              </div>
              <div className="text-center">
                <div className="h-16 flex items-end justify-center mb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-8 h-8 text-[#22C55E]" />
                    <span className="text-xl text-gray-900">AI Verified</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600 border-t border-gray-300 pt-2">
                  Satellite Verification System
                </div>
              </div>
            </div>

            {/* QR Code Placeholder */}
            <div className="flex justify-center">
              <div className="bg-white p-4 rounded-xl border-2 border-gray-300">
                <div className="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 text-sm">QR Code</span>
                </div>
                <div className="text-xs text-gray-600 text-center mt-2">Scan to verify</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-[#22C55E] hover:bg-[#059669] text-white px-8 py-6 rounded-xl text-lg">
            <Download className="mr-2 w-5 h-5" />
            Download PDF
          </Button>
          <Button
            variant="outline"
            className="border-2 border-[#22C55E] text-[#059669] hover:bg-[#22C55E] hover:text-white px-8 py-6 rounded-xl text-lg"
          >
            <Share2 className="mr-2 w-5 h-5" />
            Share Certificate
          </Button>
        </div>

        {/* Additional Info */}
        <Card className="p-6 shadow-lg rounded-2xl border-0 mt-8 bg-gradient-to-br from-blue-50 to-white">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#3B82F6] rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">ℹ️</span>
            </div>
            <div>
              <h3 className="text-lg text-gray-900 mb-2">Certificate Validity</h3>
              <p className="text-gray-600 mb-3">
                This certificate is permanently recorded on the blockchain and can be independently 
                verified. The carbon credits represented are unique and cannot be double-counted.
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="bg-white px-3 py-1.5 rounded-lg text-sm text-gray-700">
                  ✓ Blockchain Verified
                </div>
                <div className="bg-white px-3 py-1.5 rounded-lg text-sm text-gray-700">
                  ✓ Satellite Monitored
                </div>
                <div className="bg-white px-3 py-1.5 rounded-lg text-sm text-gray-700">
                  ✓ AI Validated
                </div>
                <div className="bg-white px-3 py-1.5 rounded-lg text-sm text-gray-700">
                  ✓ Globally Recognized
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
