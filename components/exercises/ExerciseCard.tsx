'use client';

import { useState } from 'react';
import { Exercise, Muscle } from '@prisma/client';
import { ExerciseDetailModal } from './ExerciseDetailModal';

interface ExerciseWithMappings extends Exercise {
  muscleTargets: Array<{
    id: string;
    weight: number;
    muscle: Muscle;
  }>;
}

interface ExerciseCardProps {
  exercise: ExerciseWithMappings;
  muscles: Muscle[];
  onDelete: (exerciseId: string) => void;
}

export function ExerciseCard({ exercise, muscles, onDelete }: ExerciseCardProps) {
  const [showDetail, setShowDetail] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${exercise.name}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/exercises/${exercise.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete exercise');
      }

      onDelete(exercise.id);
    } catch (error) {
      console.error('Error deleting exercise:', error);
      alert('Failed to delete exercise');
    } finally {
      setIsDeleting(false);
    }
  };

  const primaryMuscles = exercise.muscleTargets
    .filter((m) => m.weight >= 0.7)
    .map((m) => m.muscle.name)
    .join(', ');

  return (
    <>
      <div className="p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors">
        <div className="flex items-start justify-between">
          <div className="flex-1" onClick={() => setShowDetail(true)}>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg">{exercise.name}</h3>
              <span className="px-2 py-1 text-xs rounded bg-secondary text-secondary-foreground capitalize">
                {exercise.category}
              </span>
              {exercise.equipment && (
                <span className="px-2 py-1 text-xs rounded bg-muted text-muted-foreground">
                  {exercise.equipment}
                </span>
              )}
            </div>
            {primaryMuscles && (
              <p className="text-sm text-muted-foreground">
                Targets: {primaryMuscles}
              </p>
            )}
          </div>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="ml-4 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded disabled:opacity-50 touch-target"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      {showDetail && (
        <ExerciseDetailModal
          exercise={exercise}
          muscles={muscles}
          onClose={() => setShowDetail(false)}
        />
      )}
    </>
  );
}



