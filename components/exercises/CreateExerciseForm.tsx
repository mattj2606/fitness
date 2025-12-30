'use client';

import { useState } from 'react';
import { Muscle } from '@prisma/client';
import { Exercise } from '@prisma/client';

interface ExerciseWithMappings extends Exercise {
  muscleTargets: Array<{
    id: string;
    weight: number;
    muscle: Muscle;
  }>;
}

interface CreateExerciseFormProps {
  muscles: Muscle[];
  onSuccess: (exercise: ExerciseWithMappings) => void;
  onCancel: () => void;
}

export function CreateExerciseForm({
  onSuccess,
  onCancel,
}: CreateExerciseFormProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'push' | 'pull' | 'legs' | 'cardio' | 'pt'>('push');
  const [equipment, setEquipment] = useState('');
  const [instructions, setInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/exercises', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          category,
          equipment: equipment || undefined,
          instructions: instructions || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create exercise');
      }

      const data = await response.json();
      onSuccess(data.exercise);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-card">
      <h2 className="text-xl font-semibold mb-4">Create New Exercise</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Exercise Name *
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="e.g., Bench Press"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-2">
            Category *
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as typeof category)}
            required
            className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="push">Push</option>
            <option value="pull">Pull</option>
            <option value="legs">Legs</option>
            <option value="cardio">Cardio</option>
            <option value="pt">PT</option>
          </select>
        </div>

        <div>
          <label htmlFor="equipment" className="block text-sm font-medium mb-2">
            Equipment
          </label>
          <input
            id="equipment"
            type="text"
            value={equipment}
            onChange={(e) => setEquipment(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="e.g., barbell, dumbbell, bodyweight"
          />
        </div>

        <div>
          <label htmlFor="instructions" className="block text-sm font-medium mb-2">
            Instructions
          </label>
          <textarea
            id="instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Exercise instructions..."
          />
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting || !name}
            className="flex-1 py-3 px-4 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed touch-target"
          >
            {isSubmitting ? 'Creating...' : 'Create Exercise'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-3 rounded-lg border border-input bg-background hover:bg-accent touch-target"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

