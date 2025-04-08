import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Calendar, Filter, ChevronRight } from 'lucide-react';

// Components
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

// Contexts
import { useProgress } from '@/contexts/ProgressContext';
import { useUser } from '@/contexts/UserContext';

// Data and types
import { Program } from '@/types';
import { programs, getProgramsByCategory, getProgramsByLevel } from '@/data/programs';

export const getProgramById = (id: string) => {
    // Implementation here
};

const Programs: React.FC = () => {
    const navigate = useNavigate();
    const { progress, updateCurrentProgram } = useProgress();
    const { userProfile } = useUser();

    const [allPrograms, setAllPrograms] = useState<Program[]>([]);
    const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
    const [activeFilter, setActiveFilter] = useState<'all' | 'chair-yoga' | 'tai-chi'>('all');
    const [activeLevel, setActiveLevel] = useState<'all' | 'Novice' | 'Active' | 'Advanced'>('all');
    const [showFilters, setShowFilters] = useState(false);
    const [currentProgram, setCurrentProgram] = useState<Program | null>(null);

    // Load programs
    useEffect(() => {
        // Sort programs by level and month
        const sortedPrograms = [...programs].sort((a, b) => {
            const levelOrder = { 'Novice': 0, 'Active': 1, 'Advanced': 2 };
            const levelDiff = levelOrder[a.level] - levelOrder[b.level];
            if (levelDiff !== 0) return levelDiff;
            return a.month - b.month;
        });

        setAllPrograms(sortedPrograms);
        setFilteredPrograms(sortedPrograms);

        // Find current program
        if (progress?.currentProgram) {
            const current = sortedPrograms.find(p => p.id === progress.currentProgram);
            if (current) {
                setCurrentProgram(current);
            }
        }
    }, [progress]);

    // Filter programs when filter changes
    useEffect(() => {
        let result = allPrograms;

        // Apply category filter
        if (activeFilter !== 'all') {
            result = result.filter(program => program.category === activeFilter);
        }

        // Apply level filter
        if (activeLevel !== 'all') {
            result = result.filter(program => program.level === activeLevel);
        }

        setFilteredPrograms(result);
    }, [allPrograms, activeFilter, activeLevel]);

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
        <div className= "max-w-4xl mx-auto" >
        <div className="flex items-center justify-between mb-6" >
            <h1 className="text-2xl font-bold" > Programs </h1>
                < Button
    variant = "secondary"
    icon = { Filter }
    onClick = {() => setShowFilters(!showFilters)}
size = "sm"
    >
    Filter
    </Button>
    </div>

{/* Filters */ }
{
    showFilters && (
        <Card className="mb-6" >
            <CardContent>
            <h2 className="font-medium mb-3" > Filters </h2>

                < div className = "mb-4" >
                    <h3 className="text-sm text-gray-600 mb-2" > Program Type </h3>
                        < div className = "flex flex-wrap gap-2" >
                            <Button
                  variant={ activeFilter === 'all' ? 'primary' : 'secondary' }
    size = "sm"
    onClick = {() => setActiveFilter('all')
}
                >
    All Types
        </Button>
        < Button
variant = { activeFilter === 'chair-yoga' ? 'primary' : 'secondary'}
size = "sm"
onClick = {() => setActiveFilter('chair-yoga')}
                >
    Chair Yoga
        </Button>
        < Button
variant = { activeFilter === 'tai-chi' ? 'primary' : 'secondary'}
size = "sm"
onClick = {() => setActiveFilter('tai-chi')}
                >
    Tai Chi
        </Button>
        </div>
        </div>

        < div >
        <h3 className="text-sm text-gray-600 mb-2" > Difficulty Level </h3>
            < div className = "flex flex-wrap gap-2" >
                <Button
                  variant={ activeLevel === 'all' ? 'primary' : 'secondary' }
size = "sm"
onClick = {() => setActiveLevel('all')}
                >
    All Levels
        </Button>
        < Button
variant = { activeLevel === 'Novice' ? 'primary' : 'secondary'}
size = "sm"
onClick = {() => setActiveLevel('Novice')}
                >
    Novice
    </Button>
    < Button
variant = { activeLevel === 'Active' ? 'primary' : 'secondary'}
size = "sm"
onClick = {() => setActiveLevel('Active')}
                >
    Active
    </Button>
    < Button
variant = { activeLevel === 'Advanced' ? 'primary' : 'secondary'}
size = "sm"
onClick = {() => setActiveLevel('Advanced')}
                >
    Advanced
    </Button>
    </div>
    </div>
    </CardContent>
    </Card>
      )}

{/* Current Program */ }
{
    currentProgram && (
        <div className="mb-6" >
            <h2 className="font-medium mb-3" > Current Program </h2>
                < Card variant = "highlight" className = "border-primary-500" >
                    <CardContent>
                    <div className="flex flex-col sm:flex-row items-start justify-between" >
                        <div className="flex mb-4 sm:mb-0" >
                            <img
                    src={ currentProgram.thumbnail }
    alt = { currentProgram.title }
    className = "w-20 h-20 rounded-lg object-cover mr-4"
        />
        <div>
        <h3 className="font-medium" > { currentProgram.title } </h3>
            < p className = "text-sm text-gray-500 mb-2" >
                { currentProgram.level } Level • Month { currentProgram.month }
    </p>
        < div className = "flex flex-wrap gap-2" >
            <span className="badge bg-blue-50 text-blue-700" >
                <Clock size={ 12 } className = "mr-1" /> { currentProgram.totalDuration } minutes
                    </span>
                    < span className = "badge bg-green-50 text-green-700" >
                        <Calendar size={ 12 } className = "mr-1" /> { currentProgram.totalDays } days
                            </span>
                            < span className = "badge bg-purple-50 text-purple-700" >
                                Day { progress?.currentDay || 1 } of { currentProgram.totalDays }
    </span>
        </div>
        </div>
        </div>

        < Button
    variant = "outline"
    onClick = {() => navigate('/today')
}
                >
    Continue
    </Button>
    </div>
    </CardContent>
    </Card>
    </div>
      )}

{/* Available Programs */ }
<div>
    <h2 className="font-medium mb-3" > Available Programs </h2>
        < div className = "space-y-4" >
        {
            filteredPrograms.length > 0 ? (
                filteredPrograms.map(program => (
                    <Card key= { program.id } >
                    <CardContent className="p-0" >
                <div className="p-4" >
                <div className="flex flex-col sm:flex-row items-start justify-between" >
                <div className="flex mb-4 sm:mb-0" >
                <img
                          src={ program.thumbnail }
                          alt = { program.title }
                          className = "w-20 h-20 rounded-lg object-cover mr-4"
                    />
                    <div>
                    <h3 className="font-medium" > { program.title } </h3>
                < p className = "text-sm text-gray-500 mb-2" >
                { program.level } Level • Month { program.month }
                </p>
                < div className = "flex flex-wrap gap-2" >
                <span className="badge bg-blue-50 text-blue-700" >
                <Clock size={ 12} className = "mr-1" /> { program.totalDuration } minutes
                </span>
                < span className = "badge bg-green-50 text-green-700" >
                <Calendar size={ 12} className = "mr-1" /> { program.totalDays } days
                </span>
                < span className = "badge bg-indigo-50 text-indigo-700" >
                { program.category === 'chair-yoga' ? 'Chair Yoga' : 'Tai Chi' }
                </span>
                </div>
                </div>
                </div>

                < Button
                        variant = { progress?.currentProgram === program.id ? 'success' : 'primary'}
onClick = {() => handleProgramStart(program)}
className = "sm:ml-4"
    >
    { progress?.currentProgram === program.id ? 'Current' : 'Start'}
</Button>
    </div>

    < div className = "mt-3" >
        <button
                        className="flex items-center text-sm text-primary-600 hover:underline"
onClick = {() => {
    // Show program details (in future implementation)
    alert(`Program details for: ${program.title}`);
}}
                      >
    See details < ChevronRight size = { 16} className = "ml-1" />
        </button>
        </div>
        </div>

        < CardFooter className = "py-3 bg-gray-50 border-t border-gray-100" >
            <div className="flex flex-wrap gap-2" >
            {
                program.focusAreas.slice(0, 3).map((area, index) => (
                    <span key= { index } className = "text-xs text-gray-600" >
                    { area }{ index<Math.min(program.focusAreas.length, 3) - 1 ? ',' : '' }
                </span>
                ))
            }
{
    program.focusAreas.length > 3 && (
        <span className="text-xs text-gray-600" > +{ program.focusAreas.length - 3 } more </span>
                      )
}
</div>
    </CardFooter>
    </CardContent>
    </Card>
            ))
          ) : (
    <Card className= "text-center py-8" >
    <CardContent>
    <h3 className="text-xl font-medium text-gray-700 mb-2" > No programs found </h3>
        < p className = "text-gray-500" >
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