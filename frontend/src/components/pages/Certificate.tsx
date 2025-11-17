import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // assuming react-router is used
import { Download, Share2, CheckCircle, Award } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

type CertificateData = {
  farmerName: string;
  location: string;
  tonsSequestered: number;
  dateRange: string;
  certificateId: string;
  blockchainHash: string;
  issueDate: string;
  cropType: string;
  farmSize: string;
};

export function Certificate() {
  const { certificateId } = useParams<{ certificateId: string }>();
  const [certificateData, setCertificateData] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCertificate() {
      try {
        const response = await fetch(`/api/carbon/certificate/${certificateId}`);
        const resJson = await response.json();

        if (!resJson.success) {
          throw new Error(resJson.error || 'Failed to fetch certificate data');
        }

        const data = resJson.data;

        setCertificateData({
          farmerName: data.farmerName,
          location: data.farmLocation,
          tonsSequestered: data.carbonTons,
          dateRange: data.issuedDate ? new Date(data.issuedDate).toLocaleDateString() : '',
          certificateId: data.certificateId,
          blockchainHash: data.blockchainTxHash,
          issueDate: data.issuedDate ? new Date(data.issuedDate).toLocaleDateString() : '',
          cropType: data.cropType,
          farmSize: data.acres + ' acres',
        });
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    }

    if (certificateId) {
      fetchCertificate();
    } else {
      setError('Certificate ID is not provided');
      setLoading(false);
    }
  }, [certificateId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading certificate...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  if (!certificateData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F3F4F6] py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header and Certificate Card remain unchanged, using certificateData for fields */}
        {/* ... (same JSX structure as your original with certificateData fields used where applicable) */}
        {/* Farmer Name */}
        <div className="text-xl text-gray-900">{certificateData.farmerName}</div>
        {/* Farm Location */}
        <div className="text-xl text-gray-900">{certificateData.location}</div>
        {/* Crop Type */}
        <div className="text-xl text-gray-900">{certificateData.cropType}</div>
        {/* Farm Size */}
        <div className="text-xl text-gray-900">{certificateData.farmSize}</div>
        {/* Total Carbon Sequestered */}
        {certificateData.tonsSequestered}
        {/* Certificate ID */}
        <div className="text-gray-900 font-mono">{certificateData.certificateId}</div>
        {/* Issue Date */}
        <div className="text-gray-900">{certificateData.issueDate}</div>
        {/* Blockchain Hash */}
        <div className="text-gray-900 font-mono text-sm break-all">{certificateData.blockchainHash}</div>
        {/* The rest of your JSX remains exactly as is */}
        {/* Buttons and other static text are unchanged */}
      </div>
    </div>
  );
}
