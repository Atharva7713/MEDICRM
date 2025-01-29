import React from 'react';

interface EngagementData {
  region: string;
  specialty: string;
  interactionCount: number;
}

export default function KolEngagementHeatmap() {
  // This would be fetched from your backend
  const engagementData: EngagementData[] = [
    { region: 'Northeast', specialty: 'Oncology', interactionCount: 25 },
    { region: 'West', specialty: 'Cardiology', interactionCount: 18 },
    { region: 'Southeast', specialty: 'Neurology', interactionCount: 15 },
  ];

  const getHeatmapColor = (count: number) => {
    if (count >= 20) return 'bg-indigo-600 text-white';
    if (count >= 10) return 'bg-indigo-400 text-white';
    return 'bg-indigo-200 text-gray-900';
  };

  return (
    <div className="p-4">
      <div className="space-y-4">
        {engagementData.map((data, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="w-32">
              <p className="text-sm font-medium text-gray-900">{data.region}</p>
              <p className="text-xs text-gray-500">{data.specialty}</p>
            </div>
            <div className="flex-1">
              <div className={`h-8 rounded-lg ${getHeatmapColor(data.interactionCount)} flex items-center px-3`}>
                <span className="text-sm font-medium">{data.interactionCount} interactions</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}