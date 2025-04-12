import React, { useState, useEffect } from 'react';
import { Exercise, Modification } from '../types';
import { useFeedback } from '../hooks/useFeedback';
import { useAccessibility } from '../hooks/useAccessibility';

interface ExercisePlayerProps {
  exercise: Exercise;
  onComplete: () => void;
}

export const ExercisePlayer: React.FC<ExercisePlayerProps> = ({ exercise, onComplete }) => {
  const [currentModification, setCurrentModification] = useState<string | null>(null);
  const { provideFeedback } = useFeedback();
  const accessibility = useAccessibility();

  const toggleModification = (modificationId: string) => {
    setCurrentModification(currentModification === modificationId ? null : modificationId);
    provideFeedback('progress');
  };

  useEffect(() => {
    // Provide initial feedback when exercise loads
    if (exercise.feedbackCues?.start) {
      provideFeedback('start', exercise.feedbackCues.start);
    }
  }, [exercise]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{exercise.title}</h1>
      <div className="bg-blue-100 p-4 rounded-lg mb-6">
        <span className="font-semibold">Difficulty:</span> {exercise.difficulty}
      </div>

      <div className="mb-8">
        <p className="text-gray-700 mb-4">{exercise.description}</p>

        {exercise.videoUrl && (
          <div className="aspect-w-16 aspect-h-9 mb-6">
            <video
              src={exercise.videoUrl}
              controls
              className="rounded-lg"
              aria-label={`Video demonstration of ${exercise.title}`}
            />
          </div>
        )}

        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">Instructions</h2>
            <ol className="list-decimal list-inside space-y-2">
              {exercise.instructions.map((instruction: string, index: number) => (
                <li key={index} className="text-gray-700">{instruction}</li>
              ))}
            </ol>
          </section>

          {exercise.precautions && exercise.precautions.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-3 text-yellow-600">Precautions</h2>
              <ul className="list-disc list-inside space-y-2">
                {exercise.precautions.map((precaution: string, index: number) => (
                  <li key={index} className="text-gray-700">{precaution}</li>
                ))}
              </ul>
            </section>
          )}

          {exercise.benefits && exercise.benefits.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-3 text-green-600">Benefits</h2>
              <ul className="list-disc list-inside space-y-2">
                {exercise.benefits.map((benefit: string, index: number) => (
                  <li key={index} className="text-gray-700">{benefit}</li>
                ))}
              </ul>
            </section>
          )}

          {exercise.modifications && exercise.modifications.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-3">Modifications</h2>
              <div className="space-y-3">
                {exercise.modifications.map((modification: Modification) => (
                  <div
                    key={modification.id}
                    className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleModification(modification.id)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{modification.title}</h3>
                      <span className={`transform transition-transform duration-200 ${currentModification === modification.id ? 'rotate-90' : ''
                        }`}>
                        →
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">For: {modification.forCondition}</p>
                    {currentModification === modification.id && (
                      <div className="mt-3">
                        <p className="mb-2 text-gray-700">{modification.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={() => {
            provideFeedback('complete');
            onComplete();
          }}
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
        >
          Complete Exercise
        </button>
      </div>
    </div>
  );
};