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
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

// Contexts
import { useProgress } from '@/contexts/ProgressContext';

// Data and types
import { Program, ProgramDay } from '@/types';
import { getProgramData } from '@/data/programs';

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
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            exercise.type === 'warmup' 
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
import { programs, getProgramsByCategory, getProgramsByLevel } from '../data/programs';

const Programs = () => {
  const navigate = useNavigate();
  const { progress, updateCurrentProgram } = useProgress();
  const { userProfile } = useUser();
  
  const [allPrograms, setAllPrograms] = useState<Program[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'chair-yoga' | 'tai-chi'>('all');
  const [activeLevel, setActiveLevel] = useState<'all' | 'Novice' | 'Active' | 'Advanced'>('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Load programs
  useEffect(() => {
    setAllPrograms(programs);
    setFilteredPrograms(programs);
  }, []);
  
  // Filter programs when filter changes
  useEffect(() => {
    let result = allPrograms;
    
    // Apply category filter
    if (activeFilter !== 'all') {
      result = getProgramsByCategory(activeFilter);
    }
    
    // Apply level filter
    if (activeLevel !== 'all') {
      result = result.filter(program => program.level === activeLevel);
    }
    
    setFilteredPrograms(result);
  }, [allPrograms, activeFilter, activeLevel]);
  
  const handleProgramStart = async (program: Program) => {
    try {
      await updateCurrentProgram(program.id, 1);
      navigate('/today');
    } catch (error) {
      console.error('Error starting program:', error);
    }
  };
  
  const getCurrentProgram = (): Program | null => {
    if (!progress || !progress.currentProgram) return null;
    
    return allPrograms.find(p => p.id === progress.currentProgram) || null;
  };
  
  const currentProgram = getCurrentProgram();
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Programs</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center px-3 py-2 bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <Filter size={18} className="mr-1" /> Filter
        </button>
      </div>
      
      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-card p-4 mb-6">
          <h2 className="font-medium mb-3">Filters</h2>
          
          <div className="mb-4">
            <h3 className="text-sm text-gray-600 mb-2">Program Type</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeFilter === 'all'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Types
              </button>
              <button
                onClick={() => setActiveFilter('chair-yoga')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeFilter === 'chair-yoga'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Chair Yoga
              </button>
              <button
                onClick={() => setActiveFilter('tai-chi')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeFilter === 'tai-chi'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Tai Chi
              </button>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm text-gray-600 mb-2">Difficulty Level</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveLevel('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeLevel === 'all'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Levels
              </button>
              <button
                onClick={() => setActiveLevel('Novice')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeLevel === 'Novice'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Novice
              </button>
              <button
                onClick={() => setActiveLevel('Active')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeLevel === 'Active'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setActiveLevel('Advanced')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeLevel === 'Advanced'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Advanced
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Current Program */}
      {currentProgram && (
        <div className="mb-6">
          <h2 className="font-medium mb-3">Current Program</h2>
          <div className="bg-white rounded-xl shadow-card overflow-hidden border-l-4 border-primary-500">
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex">
                  <img
                    src={currentProgram.thumbnail}
                    alt={currentProgram.title}
                    className="w-20 h-20 rounded-lg object-cover mr-4"
                  />
                  <div>
                    <h3 className="font-medium">{currentProgram.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {currentProgram.level} Level • Month {currentProgram.month}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700">
                        <Clock size={12} className="mr-1" /> {currentProgram.totalDuration} minutes
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-50 text-green-700">
                        <Calendar size={12} className="mr-1" /> {currentProgram.totalDays} days
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-50 text-purple-700">
                        Day {progress?.currentDay || 1} of {currentProgram.totalDays}
                      </span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => navigate('/today')}
                  className="px-4 py-2 text-primary-600 rounded-lg border border-primary-600 hover:bg-primary-50"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* All Programs */}
      <div>
        <h2 className="font-medium mb-3">Available Programs</h2>
        <div className="space-y-4">
          {filteredPrograms.length > 0 ? (
            filteredPrograms.map(program => (
              <div 
                key={program.id}
                className="bg-white rounded-xl shadow-card overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex">
                      <img
                        src={program.thumbnail}
                        alt={program.title}
                        className="w-20 h-20 rounded-lg object-cover mr-4"
                      />
                      <div>
                        <h3 className="font-medium">{program.title}</h3>
                        <p className="text-sm text-gray-500 mb-2">
                          {program.level} Level • Month {program.month}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700">
                            <Clock size={12} className="mr-1" /> {program.totalDuration} minutes
                          </span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-50 text-green-700">
                            <Calendar size={12} className="mr-1" /> {program.totalDays} days
                          </span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-indigo-50 text-indigo-700">
                            {program.category === 'chair-yoga' ? 'Chair Yoga' : 'Tai Chi'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleProgramStart(program)}
                      className={`px-4 py-2 rounded-lg ${
                        progress?.currentProgram === program.id
                          ? 'bg-green-100 text-green-700 border border-green-300'
                          : 'bg-primary-500 text-white hover:bg-primary-600'
                      }`}
                    >
                      {progress?.currentProgram === program.id ? 'Current' : 'Start'}
                    </button>
                  </div>
                  
                  <div className="mt-3">
                    <button
                      className="flex items-center text-sm text-primary-600 hover:underline"
                      onClick={() => {
                        // This would open program details in a future implementation
                        alert(`Program details for: ${program.title}`);
                      }}
                    >
                      See details <ChevronRight size={16} className="ml-1" />
                    </button>
                  </div>
                </div>
                
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    {program.focusAreas.slice(0, 3).map((area, index) => (
                      <span key={index} className="text-xs text-gray-600">
                        {area}{index < Math.min(program.focusAreas.length, 3) - 1 ? ',' : ''}
                      </span>
                    ))}
                    {program.focusAreas.length > 3 && (
                      <span className="text-xs text-gray-600">+{program.focusAreas.length - 3} more</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-card p-8 text-center">
              <h3 className="text-xl font-medium text-gray-700 mb-2">No programs found</h3>
              <p className="text-gray-500">
                Try adjusting your filters to see more programs
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Programs;