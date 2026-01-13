'use client';

import { useState } from 'react';

interface SorenessMapProps {
  sorenessMap: Record<string, number>;
  onChange: (map: Record<string, number>) => void;
}

// Simplified muscle groups for the body map
const MUSCLE_AREAS = [
  { id: 'chest', name: 'Chest', x: 50, y: 30 },
  { id: 'upper-back', name: 'Upper Back', x: 50, y: 25 },
  { id: 'shoulders', name: 'Shoulders', x: 50, y: 20 },
  { id: 'biceps', name: 'Biceps', x: 30, y: 35 },
  { id: 'triceps', name: 'Triceps', x: 70, y: 35 },
  { id: 'abs', name: 'Abs', x: 50, y: 45 },
  { id: 'lower-back', name: 'Lower Back', x: 50, y: 50 },
  { id: 'quads', name: 'Quads', x: 50, y: 65 },
  { id: 'hamstrings', name: 'Hamstrings', x: 50, y: 75 },
  { id: 'calves', name: 'Calves', x: 50, y: 85 },
];

export function SorenessMap({ sorenessMap, onChange }: SorenessMapProps) {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  const handleAreaClick = (areaId: string) => {
    setSelectedArea(areaId);
  };

  const handleIntensityChange = (intensity: number) => {
    if (selectedArea) {
      const newMap = { ...sorenessMap };
      if (intensity === 0) {
        delete newMap[selectedArea];
      } else {
        newMap[selectedArea] = intensity;
      }
      onChange(newMap);
    }
  };

  const getAreaColor = (areaId: string) => {
    const intensity = sorenessMap[areaId] || 0;
    if (intensity === 0) return '#e5e7eb';
    if (intensity <= 2) return '#fef3c7';
    if (intensity <= 4) return '#fcd34d';
    return '#f59e0b';
  };

  return (
    <div className="space-y-4">
      <div className="relative bg-gray-100 rounded-lg p-4 min-h-[400px]">
        {/* Simple body representation */}
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Head */}
          <circle
            cx="50"
            cy="10"
            r="8"
            fill={sorenessMap['head'] ? getAreaColor('head') : '#d1d5db'}
            onClick={() => handleAreaClick('head')}
            className="cursor-pointer hover:opacity-80"
          />

          {/* Torso */}
          <rect
            x="40"
            y="20"
            width="20"
            height="35"
            fill={sorenessMap['chest'] || sorenessMap['abs'] ? getAreaColor('chest') : '#d1d5db'}
            onClick={() => handleAreaClick('chest')}
            className="cursor-pointer hover:opacity-80"
          />

          {/* Arms */}
          <rect
            x="25"
            y="25"
            width="12"
            height="20"
            fill={sorenessMap['biceps'] || sorenessMap['triceps'] ? getAreaColor('biceps') : '#d1d5db'}
            onClick={() => handleAreaClick('biceps')}
            className="cursor-pointer hover:opacity-80"
          />
          <rect
            x="63"
            y="25"
            width="12"
            height="20"
            fill={sorenessMap['biceps'] || sorenessMap['triceps'] ? getAreaColor('triceps') : '#d1d5db'}
            onClick={() => handleAreaClick('triceps')}
            className="cursor-pointer hover:opacity-80"
          />

          {/* Legs */}
          <rect
            x="42"
            y="55"
            width="8"
            height="30"
            fill={sorenessMap['quads'] || sorenessMap['hamstrings'] ? getAreaColor('quads') : '#d1d5db'}
            onClick={() => handleAreaClick('quads')}
            className="cursor-pointer hover:opacity-80"
          />
          <rect
            x="50"
            y="55"
            width="8"
            height="30"
            fill={sorenessMap['quads'] || sorenessMap['hamstrings'] ? getAreaColor('quads') : '#d1d5db'}
            onClick={() => handleAreaClick('quads')}
            className="cursor-pointer hover:opacity-80"
          />

          {/* Labels */}
          {MUSCLE_AREAS.map((area) => (
            <text
              key={area.id}
              x={area.x}
              y={area.y}
              fontSize="3"
              textAnchor="middle"
              fill="#6b7280"
              className="pointer-events-none"
            >
              {area.name}
            </text>
          ))}
        </svg>

        {/* Muscle area buttons */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {MUSCLE_AREAS.map((area) => {
            const intensity = sorenessMap[area.id] || 0;
            return (
              <button
                key={area.id}
                type="button"
                onClick={() => handleAreaClick(area.id)}
                className={`p-2 rounded text-sm text-left touch-target ${
                  selectedArea === area.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-white border'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{area.name}</span>
                  {intensity > 0 && (
                    <span className="text-xs font-medium">{intensity}/5</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Intensity selector */}
      {selectedArea && (
        <div className="p-4 border rounded-lg bg-card">
          <div className="mb-2">
            <span className="font-medium">
              {MUSCLE_AREAS.find((a) => a.id === selectedArea)?.name} Soreness
            </span>
          </div>
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4, 5].map((intensity) => (
              <button
                key={intensity}
                type="button"
                onClick={() => handleIntensityChange(intensity)}
                className={`flex-1 py-2 rounded-lg font-medium touch-target ${
                  (sorenessMap[selectedArea] || 0) === intensity
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                {intensity === 0 ? 'None' : intensity}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}



