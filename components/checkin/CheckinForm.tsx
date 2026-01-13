'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DailyCheckin } from '@prisma/client';
import { SorenessMap } from './SorenessMap';

interface CheckinFormProps {
  initialCheckin: DailyCheckin | null;
}

export function CheckinForm({ initialCheckin }: CheckinFormProps) {
  const router = useRouter();
  const [hoursSlept, setHoursSlept] = useState<string>(
    initialCheckin?.hoursSlept?.toString() || ''
  );
  const [sleepQuality, setSleepQuality] = useState<number>(
    initialCheckin?.sleepQuality || 3
  );
  const [energyLevel, setEnergyLevel] = useState<'low' | 'normal' | 'high'>(
    (initialCheckin?.energyLevel as 'low' | 'normal' | 'high') || 'normal'
  );
  const [sorenessMap, setSorenessMap] = useState<Record<string, number>>(
    (initialCheckin?.sorenessMap as Record<string, number>) || {}
  );
  const [acutePain, setAcutePain] = useState(initialCheckin?.acutePain || false);
  const [painNote, setPainNote] = useState(initialCheckin?.painNote || '');
  const [timeAvailable, setTimeAvailable] = useState<'short' | 'normal' | 'long'>(
    (initialCheckin?.timeAvailable as 'short' | 'normal' | 'long') || 'normal'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const url = initialCheckin
        ? `/api/checkins/${initialCheckin.id}`
        : '/api/checkins';
      const method = initialCheckin ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hoursSlept: hoursSlept ? parseFloat(hoursSlept) : undefined,
          sleepQuality,
          energyLevel,
          sorenessMap: Object.keys(sorenessMap).length > 0 ? sorenessMap : undefined,
          acutePain,
          painNote: painNote || undefined,
          timeAvailable,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save check-in');
      }

      // Redirect to plan page after successful submission
      router.push('/plan');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Hours Slept */}
      <div>
        <label htmlFor="hoursSlept" className="block text-sm font-medium mb-2">
          Hours Slept
        </label>
        <input
          id="hoursSlept"
          type="number"
          min="0"
          max="24"
          step="0.5"
          value={hoursSlept}
          onChange={(e) => setHoursSlept(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="7.5"
        />
      </div>

      {/* Sleep Quality */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Sleep Quality: {sleepQuality}/5
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setSleepQuality(value)}
              className={`flex-1 py-3 rounded-lg font-medium touch-target ${
                sleepQuality === value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      {/* Energy Level */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Energy Level
        </label>
        <div className="flex gap-2">
          {(['low', 'normal', 'high'] as const).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setEnergyLevel(level)}
              className={`flex-1 py-3 rounded-lg font-medium capitalize touch-target ${
                energyLevel === level
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Soreness Map */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Soreness (tap areas on body)
        </label>
        <SorenessMap
          sorenessMap={sorenessMap}
          onChange={setSorenessMap}
        />
      </div>

      {/* Acute Pain */}
      <div>
        <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-accent">
          <input
            type="checkbox"
            checked={acutePain}
            onChange={(e) => setAcutePain(e.target.checked)}
            className="w-5 h-5"
          />
          <span className="font-medium">Acute Pain</span>
        </label>
        {acutePain && (
          <div className="mt-2">
            <textarea
              value={painNote}
              onChange={(e) => setPainNote(e.target.value)}
              placeholder="Describe the pain..."
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        )}
      </div>

      {/* Time Available */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Time Available Today
        </label>
        <div className="flex gap-2">
          {(['short', 'normal', 'long'] as const).map((time) => (
            <button
              key={time}
              type="button"
              onClick={() => setTimeAvailable(time)}
              className={`flex-1 py-3 rounded-lg font-medium capitalize touch-target ${
                timeAvailable === time
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 px-4 rounded-lg bg-primary text-primary-foreground font-medium text-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed touch-target"
      >
        {isSubmitting ? 'Saving...' : 'Confirm Today'}
      </button>
    </form>
  );
}



