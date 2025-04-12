import { useState, useEffect } from 'react';
import { Program, ProgramType, DifficultyLevel } from '@/types';
import { useProgress } from '@/contexts/ProgressContext';

export const usePrograms = () => {
    const { progress } = useProgress();
    const [allPrograms, setAllPrograms] = useState<Program[]>([]);
    const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
    const [activeFilter, setActiveFilter] = useState<'all' | ProgramType>('all');
    const [activeLevel, setActiveLevel] = useState<'all' | DifficultyLevel>('all');
    const [currentProgram, setCurrentProgram] = useState<Program | null>(null);

    // Load and sort programs
    const loadPrograms = (programs: Program[]) => {
        const sortedPrograms = [...programs].sort((a, b) => {
            const levelOrder = {
                [DifficultyLevel.Novice]: 0,
                [DifficultyLevel.Active]: 1,
                [DifficultyLevel.Advanced]: 2
            };
            const levelDiff = levelOrder[a.difficultyLevel] - levelOrder[b.difficultyLevel];
            return levelDiff !== 0 ? levelDiff : a.durationDays - b.durationDays;
        });

        setAllPrograms(sortedPrograms);
        setFilteredPrograms(sortedPrograms);
    };

    // Update current program
    useEffect(() => {
        if (progress?.currentProgram) {
            const current = allPrograms.find(p => p.id === progress.currentProgram);
            setCurrentProgram(current || null);
        } else {
            setCurrentProgram(null);
        }
    }, [progress?.currentProgram, allPrograms]);

    // Filter programs
    useEffect(() => {
        let result = allPrograms;

        if (activeFilter !== 'all') {
            result = result.filter(program => program.type === activeFilter);
        }

        if (activeLevel !== 'all') {
            result = result.filter(program => program.difficultyLevel === activeLevel);
        }

        setFilteredPrograms(result);
    }, [allPrograms, activeFilter, activeLevel]);

    return {
        allPrograms,
        filteredPrograms,
        currentProgram,
        activeFilter,
        activeLevel,
        setActiveFilter,
        setActiveLevel,
        loadPrograms,
    };
};