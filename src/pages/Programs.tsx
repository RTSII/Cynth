import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Users, User, ChevronRight, Filter, Calendar } from 'lucide-react';

// Contexts
import { useProgress } from '../contexts/ProgressContext';
import { useUser } from '../contexts/UserContext';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle, Clock, AlertCircle, Play, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

// Components
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

// Contexts
import { useProgress } from '@/contexts/ProgressContext';

// Data and types
import { Program, ProgramDay, ProgramType, DifficultyLevel } from '@/types';
import { getProgramData, programs } from '@/data/programs';

// Hooks
import { usePrograms } from '@/hooks/usePrograms';

const TodayPractice: React.FC = () => {
  const navigate = useNavigate();
  const { progress, completedToday } = useProgress();

  const [currentProgram, setCurrentProgram] = useState<Program | null>(null);
  const [todaySession, setTodaySession] = useState<ProgramDay | null>(null);
  const [loading, setLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        if (progress?.currentProgram) {
          const program = getProgramData(progress.currentProgram);
          setCurrentProgram(program);

          if (program) {
            const day = program.days.find(d => d.dayNumber === progress.currentDay);
            if (day) {
              setTodaySession(day);
            }
          }
        }
      } catch (error) {
        console.error('Error loading today\'s practice:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [progress]);

  const handleStartPractice = () => {
    if (!todaySession || !todaySession.exercises.length) return;

    navigate(`/exercise/${todaySession.programId}/${todaySession.id}/${todaySession.exercises[0].id}`);
  };

  const handleExerciseClick = (exerciseId: string) => {
    if (!todaySession) return;

    navigate(`/exercise/${todaySession.programId}/${todaySession.id}/${exerciseId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Today's Practice</h1>

      {!currentProgram || !todaySession ? (
        <Card className="text-center p-8">
          <CardContent>
            <Calendar size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No practice scheduled</h3>
            <p className="text-gray-500 mb-6">
              You haven't selected a program yet or completed all available sessions.
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/programs')}
            >
              Browse Programs
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Today's Practice Header */}
          <Card variant="highlight">
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Calendar className="text-primary-500 mr-2" size={20} />
                  <span className="text-gray-500">{format(new Date(), 'EEEE, MMMM d')}</span>
                </div>

                {completedToday ? (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center">
                    <CheckCircle size={16} className="mr-1" /> Completed
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium flex items-center">
                    <AlertCircle size={16} className="mr-1" /> Pending
                  </span>
                )}
              </div>

              <h2 className="text-xl font-bold mb-2">{todaySession.title}</h2>
              <p className="text-gray-700 mb-4">{todaySession.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="badge bg-blue-50 text-blue-700">
                  <Clock size={16} className="mr-1" /> {todaySession.duration} minutes
                </span>
                {currentProgram && (
                  <span className="badge bg-purple-50 text-purple-700">
                    Day {progress?.currentDay} of {currentProgram.totalDays}
                  </span>
                )}
                <span className="badge bg-green-50 text-green-700">
                  {currentProgram.category === 'chair-yoga' ? 'Chair Yoga' : 'Tai Chi'}
                </span>
              </div>

              <Button
                variant="primary"
                size="lg"
                icon={Play}
                disabled={completedToday}
                onClick={handleStartPractice}
                fullWidth
                className="md:w-auto"
              >
                {completedToday ? 'Already Completed' : 'Start Practice'}
              </Button>
            </CardContent>
          </Card>

          {/* Exercise List */}
          <Card variant="bordered" className="mt-6 p-0 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-medium">Today's Exercises</h3>
            </div>

            <div>
              {todaySession.exercises.map((exercise, index) => (
                <div
                  key={exercise.id}
                  className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                >
                  <button
                    onClick={() => handleExerciseClick(exercise.id)}
                    className="flex items-center justify-between p-4 w-full text-left"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-3">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium">{exercise.title}</h4>
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="inline-flex items-center mr-3">
                            <Clock size={14} className="mr-1" /> {exercise.duration} minutes
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${exercise.type === 'warmup'
                            ? 'bg-blue-100 text-blue-800'
                            : exercise.type === 'cooldown'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-purple-100 text-purple-800'
                            }`}>
                            {exercise.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-400" />
                  </button>
                </div>
              ))}
            </div>
          </Card>

          {/* Program Navigation */}
          <Card variant="bordered" className="mt-6">
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{currentProgram.title}</h3>
                  <p className="text-sm text-gray-500">
                    {currentProgram.level} level, Month {currentProgram.month}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => navigate('/programs')}
                >
                  View Program
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default TodayPractice;

// Data and types
import { Program } from '../types';

const Programs: React.FC = () => {
  const navigate = useNavigate();
  const { updateCurrentProgram } = useProgress();
  const {
    allPrograms,
    filteredPrograms,
    currentProgram,
    activeFilter,
    activeLevel,
    setActiveFilter,
    setActiveLevel,
    loadPrograms
  } = usePrograms();

  const [showFilters, setShowFilters] = useState(false);

  // Load programs on mount
  useEffect(() => {
    loadPrograms(programs);
  }, []);

  // Handle program start
  const handleProgramStart = async (program: Program) => {
    try {
      await updateCurrentProgram(program.id, 1);
      navigate('/today');
    } catch (error) {
      console.error('Error starting program:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Programs</h1>
        <Button
          variant="secondary"
          icon={Filter}
          onClick={() => setShowFilters(!showFilters)}
          size="sm"
        >
          Filter
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card className="mb-6">
          <CardContent>
            <h2 className="font-medium mb-3">Filters</h2>

            <div className="mb-4">
              <h3 className="text-sm text-gray-600 mb-2">Program Type</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={activeFilter === 'all' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setActiveFilter('all')}
                >
                  All Types
                </Button>
                <Button
                  variant={activeFilter === ProgramType.ChairYoga ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setActiveFilter(ProgramType.ChairYoga)}
                >
                  Chair Yoga
                </Button>
                <Button
                  variant={activeFilter === ProgramType.TaiChi ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setActiveFilter(ProgramType.TaiChi)}
                >
                  Tai Chi
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-sm text-gray-600 mb-2">Difficulty Level</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={activeLevel === 'all' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setActiveLevel('all')}
                >
                  All Levels
                </Button>
                <Button
                  variant={activeLevel === DifficultyLevel.Novice ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setActiveLevel(DifficultyLevel.Novice)}
                >
                  Novice
                </Button>
                <Button
                  variant={activeLevel === DifficultyLevel.Active ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setActiveLevel(DifficultyLevel.Active)}
                >
                  Active
                </Button>
                <Button
                  variant={activeLevel === DifficultyLevel.Advanced ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setActiveLevel(DifficultyLevel.Advanced)}
                >
                  Advanced
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Program */}
      {currentProgram && (
        <div className="mb-6">
          <h2 className="font-medium mb-3">Current Program</h2>
          <Card variant="highlight" className="border-primary-500">
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start justify-between">
                <div className="flex mb-4 sm:mb-0">
                  <img
                    src={currentProgram.thumbnailUrl}
                    alt={currentProgram.title}
                    className="w-20 h-20 rounded-lg object-cover mr-4"
                  />
                  <div>
                    <h3 className="font-medium">{currentProgram.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {currentProgram.difficultyLevel} Level • {currentProgram.durationDays} Days
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="badge bg-blue-50 text-blue-700">
                        <Clock size={12} className="mr-1" /> {currentProgram.durationDays} days
                      </span>
                      <span className="badge bg-indigo-50 text-indigo-700">
                        {currentProgram.type === ProgramType.ChairYoga ? 'Chair Yoga' : 'Tai Chi'}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => navigate('/today')}
                >
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Available Programs */}
      <div>
        <h2 className="font-medium mb-3">Available Programs</h2>
        <div className="space-y-4">
          {filteredPrograms.length > 0 ? (
            filteredPrograms.map(program => (
              <Card key={program.id}>
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex flex-col sm:flex-row items-start justify-between">
                      <div className="flex mb-4 sm:mb-0">
                        <img
                          src={program.thumbnailUrl}
                          alt={program.title}
                          className="w-20 h-20 rounded-lg object-cover mr-4"
                        />
                        <div>
                          <h3 className="font-medium">{program.title}</h3>
                          <p className="text-sm text-gray-500 mb-2">
                            {program.difficultyLevel} Level • {program.durationDays} Days
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <span className="badge bg-blue-50 text-blue-700">
                              <Clock size={12} className="mr-1" /> {program.durationDays} days
                            </span>
                            <span className="badge bg-indigo-50 text-indigo-700">
                              {program.type === ProgramType.ChairYoga ? 'Chair Yoga' : 'Tai Chi'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Button
                        variant={program.id === currentProgram?.id ? 'success' : 'primary'}
                        onClick={() => handleProgramStart(program)}
                        className="sm:ml-4"
                      >
                        {program.id === currentProgram?.id ? 'Current' : 'Start'}
                      </Button>
                    </div>

                    <div className="mt-3">
                      <button
                        className="flex items-center text-sm text-primary-600 hover:underline"
                        onClick={() => {
                          // Show program details (in future implementation)
                          alert(`Program details for: ${program.title}`);
                        }}
                      >
                        See details <ChevronRight size={16} className="ml-1" />
                      </button>
                    </div>
                  </div>

                  <CardFooter className="py-3 bg-gray-50 border-t border-gray-100">
                    <div className="flex flex-wrap gap-2">
                      {program.goals.slice(0, 3).map((goal, index) => (
                        <span key={index} className="text-xs text-gray-600">
                          {goal}{index < Math.min(program.goals.length, 3) - 1 ? ',' : ''}
                        </span>
                      ))}
                      {program.goals.length > 3 && (
                        <span className="text-xs text-gray-600">+{program.goals.length - 3} more</span>
                      )}
                    </div>
                  </CardFooter>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="text-center py-8">
              <CardContent>
                <h3 className="text-xl font-medium text-gray-700 mb-2">No programs found</h3>
                <p className="text-gray-500">
                  Try adjusting your filters to see more programs
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Programs;