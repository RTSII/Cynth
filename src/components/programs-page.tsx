import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Users, User, ChevronRight, Filter, Calendar } from 'lucide-react';

// Contexts
import { useProgress } from '../contexts/ProgressContext';
import { useUser } from '../contexts/UserContext';

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