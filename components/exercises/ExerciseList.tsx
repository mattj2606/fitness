'use client';

import { useState } from 'react';
import { Exercise } from '@prisma/client';
import { Muscle } from '@prisma/client';
import { ExerciseCard } from './ExerciseCard';
import { CreateExerciseForm } from './CreateExerciseForm';

interface ExerciseWithMappings extends Exercise {
  muscleTargets: Array<{
    id: string;
    weight: number;
    muscle: Muscle;
  }>;
}

interface ExerciseListProps {
  initialExercises: ExerciseWithMappings[];
  muscles: Muscle[];
}

export function ExerciseList({ initialExercises, muscles }: ExerciseListProps) {
  const [exercises, setExercises] = useState<ExerciseWithMappings[]>(initialExercises);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredExercises =
    categoryFilter === 'all'
      ? exercises
      : exercises.filter((ex) => ex.category === categoryFilter);

  const handleExerciseCreated = (newExercise: ExerciseWithMappings) => {
    setExercises([...exercises, newExercise]);
    setShowCreateForm(false);
  };

  const handleExerciseDeleted = (exerciseId: string) => {
    setExercises(exercises.filter((ex) => ex.id !== exerciseId));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              categoryFilter === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground'
            }`}
          >
            All
          </button>
          {['push', 'pull', 'legs', 'cardio', 'pt'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
                categoryFilter === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium touch-target"
        >
          {showCreateForm ? 'Cancel' : '+ New Exercise'}
        </button>
      </div>

      {showCreateForm && (
        <CreateExerciseForm
          muscles={muscles}
          onSuccess={handleExerciseCreated}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      <div className="space-y-3">
        {filteredExercises.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No exercises found
          </div>
        ) : (
          filteredExercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              muscles={muscles}
              onDelete={handleExerciseDeleted}
            />
          ))
        )}
      </div>
    </div>
  );
}

