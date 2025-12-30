'use client';

import { useState } from 'react';
import { Exercise, Muscle } from '@prisma/client';

interface ExerciseWithMappings extends Exercise {
  muscleTargets: Array<{
    id: string;
    weight: number;
    muscle: Muscle;
  }>;
}

interface ExerciseDetailModalProps {
  exercise: ExerciseWithMappings;
  muscles: Muscle[];
  onClose: () => void;
}

export function ExerciseDetailModal({
  exercise,
  muscles,
  onClose,
}: ExerciseDetailModalProps) {
  const [muscleMappings, setMuscleMappings] = useState(
    exercise.muscleTargets.map((m) => ({
      muscleId: m.muscle.id,
      weight: m.weight,
    }))
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleMuscleToggle = (muscleId: string) => {
    setMuscleMappings((prev) => {
      const existing = prev.find((m) => m.muscleId === muscleId);
      if (existing) {
        return prev.filter((m) => m.muscleId !== muscleId);
      }
      return [...prev, { muscleId, weight: 1.0 }];
    });
  };

  const handleWeightChange = (muscleId: string, weight: number) => {
    setMuscleMappings((prev) =>
      prev.map((m) => (m.muscleId === muscleId ? { ...m, weight } : m))
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/exercises/${exercise.id}/muscles`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mappings: muscleMappings }),
      });

      if (!response.ok) {
        throw new Error('Failed to save muscle mappings');
      }

      onClose();
      window.location.reload(); // Refresh to show updated data
    } catch (error) {
      console.error('Error saving muscle mappings:', error);
      alert('Failed to save muscle mappings');
    } finally {
      setIsSaving(false);
    }
  };

  const musclesByGroup = muscles.reduce((acc, muscle) => {
    if (!acc[muscle.group]) {
      acc[muscle.group] = [];
    }
    const group = acc[muscle.group];
    if (group) {
      group.push(muscle);
    }
    return acc;
  }, {} as Record<string, Muscle[]>);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{exercise.name}</h2>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground touch-target"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2">
            <div>
              <span className="font-medium">Category:</span>{' '}
              <span className="capitalize">{exercise.category}</span>
            </div>
            {exercise.equipment && (
              <div>
                <span className="font-medium">Equipment:</span> {exercise.equipment}
              </div>
            )}
            {exercise.instructions && (
              <div>
                <span className="font-medium">Instructions:</span>
                <p className="text-muted-foreground mt-1">{exercise.instructions}</p>
              </div>
            )}
          </div>

          <div>
            <h3 className="font-semibold mb-3">Muscle Targets</h3>
            <div className="space-y-4">
              {Object.entries(musclesByGroup).map(([group, groupMuscles]) => (
                <div key={group}>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2 capitalize">
                    {group}
                  </h4>
                  <div className="space-y-2">
                    {groupMuscles.map((muscle) => {
                      const mapping = muscleMappings.find((m) => m.muscleId === muscle.id);
                      return (
                        <div key={muscle.id} className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={!!mapping}
                            onChange={() => handleMuscleToggle(muscle.id)}
                            className="w-5 h-5"
                          />
                          <label className="flex-1">{muscle.name}</label>
                          {mapping && (
                            <input
                              type="number"
                              min="0"
                              max="1"
                              step="0.1"
                              value={mapping.weight}
                              onChange={(e) =>
                                handleWeightChange(muscle.id, parseFloat(e.target.value) || 0)
                              }
                              className="w-20 px-2 py-1 rounded border border-input bg-background text-foreground"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 py-3 px-4 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50 touch-target"
            >
              {isSaving ? 'Saving...' : 'Save Mappings'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-3 rounded-lg border border-input bg-background hover:bg-accent touch-target"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

