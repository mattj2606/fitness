'use client';

import { useState } from 'react';
import { RecommendedExercise } from '@/lib/services/recommendation/types';

interface RecommendationDisplayProps {
  workoutType: string;
  exercises: RecommendedExercise[];
  reasoning: string[];
  estimatedDuration: number;
  confidence: number;
  recommendationId?: string;
}

export function RecommendationDisplay({
  workoutType,
  exercises,
  reasoning,
  estimatedDuration,
  confidence,
  recommendationId,
}: RecommendationDisplayProps) {
  const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFeedback = async (value: 'positive' | 'negative') => {
    if (!recommendationId || feedback === value) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/recommendations/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recommendationId,
          feedback: value,
        }),
      });

      if (response.ok) {
        setFeedback(value);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (workoutType === 'rest') {
    return (
      <div className="space-y-4">
        <div className="p-6 border rounded-lg bg-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <span className="text-2xl">😴</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Rest Day</h2>
              <p className="text-sm text-muted-foreground">
                Your body needs recovery
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Why rest is recommended:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {reasoning.map((reason, i) => (
                <li key={i}>{reason}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Workout Header */}
      <div className="p-6 border rounded-lg bg-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold capitalize">{workoutType} Workout</h2>
            <p className="text-sm text-muted-foreground">
              {estimatedDuration} minutes • {exercises.length} exercises
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Confidence</div>
            <div className="text-lg font-semibold">
              {Math.round(confidence * 100)}%
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => {
              // TODO: Implement start workout logic
              console.log('Start workout clicked');
              alert('Starting workout... (Coming in Day 10)');
            }}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 py-3 px-4 rounded-lg font-bold text-lg shadow-sm transition-colors"
          >
            Start Workout
          </button>
          <button
            onClick={() => {
              console.log('Modify plan clicked');
              alert('Modify plan... (Coming soon)');
            }}
            className="px-4 py-3 rounded-lg font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Modify
          </button>
        </div>

        {/* Reasoning */}
        <div className="space-y-2 mb-4">
          <h3 className="font-medium text-sm">Why this workout:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            {reasoning.map((reason, i) => (
              <li key={i}>{reason}</li>
            ))}
          </ul>
        </div>

        {/* Feedback Buttons */}
        {recommendationId && (
          <div className="flex gap-2 pt-4 border-t">
            <button
              onClick={() => handleFeedback('positive')}
              disabled={isSubmitting}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${feedback === 'positive'
                  ? 'bg-green-500 text-white'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                } disabled:opacity-50`}
            >
              👍 Good
            </button>
            <button
              onClick={() => handleFeedback('negative')}
              disabled={isSubmitting}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${feedback === 'negative'
                  ? 'bg-red-500 text-white'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                } disabled:opacity-50`}
            >
              👎 Not Good
            </button>
          </div>
        )}
      </div>

      {/* Exercises */}
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Recommended Exercises</h3>
        {exercises.map((exercise, index) => (
          <div
            key={exercise.exerciseId}
            className="p-4 border rounded-lg bg-card"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-muted-foreground">
                    #{index + 1}
                  </span>
                  <h4 className="font-semibold text-lg">{exercise.exerciseName}</h4>
                </div>
                <div className="flex gap-2 text-sm text-muted-foreground">
                  <span className="capitalize">{exercise.category}</span>
                  {exercise.equipment && (
                    <>
                      <span>•</span>
                      <span>{exercise.equipment}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Priority</div>
                <div className="text-sm font-semibold">
                  {Math.round(exercise.priority * 100)}%
                </div>
              </div>
            </div>

            {/* Suggested Sets/Reps */}
            {(exercise.suggestedSets || exercise.suggestedReps) && (
              <div className="mt-2 p-2 bg-muted rounded text-sm">
                <span className="font-medium">Suggested: </span>
                {exercise.suggestedSets && (
                  <span>{exercise.suggestedSets} sets</span>
                )}
                {exercise.suggestedSets && exercise.suggestedReps && (
                  <span> × </span>
                )}
                {exercise.suggestedReps && (
                  <span>{exercise.suggestedReps} reps</span>
                )}
              </div>
            )}

            {/* Reasoning */}
            <div className="mt-2 text-sm text-muted-foreground">
              {exercise.reasoning}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

