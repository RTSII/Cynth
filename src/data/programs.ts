import { ProgramType, DifficultyLevel } from '@/types';

export const programs = [
  {
    id: 'program-1',
    title: 'Beginner Tai Chi',
    type: ProgramType.TaiChi,
    difficultyLevel: DifficultyLevel.Novice,
    durationDays: 30,
    thumbnailUrl: '/images/programs/program-1.jpg',
    goals: ['Improve balance', 'Reduce stress', 'Learn basic forms'],
  },
  {
    id: 'program-2',
    title: 'Intermediate Tai Chi',
    type: ProgramType.TaiChi,
    difficultyLevel: DifficultyLevel.Active,
    durationDays: 45,
    thumbnailUrl: '/images/programs/program-2.jpg',
    goals: ['Enhance coordination', 'Increase stamina', 'Master complex forms'],
  },
  {
    id: 'program-3',
    title: 'Advanced Tai Chi',
    type: ProgramType.TaiChi,
    difficultyLevel: DifficultyLevel.Advanced,
    durationDays: 60,
    thumbnailUrl: '/images/programs/program-3.jpg',
    goals: ['Deepen understanding of Tai Chi principles', 'Refine techniques', 'Promote internal harmony'],
  },
  {
    id: 'program-4',
    title: 'Chair Yoga for Beginners',
    type: ProgramType.ChairYoga,
    difficultyLevel: DifficultyLevel.Novice,
    durationDays: 30,
    thumbnailUrl: '/images/programs/program-4.jpg',
    goals: ['Improve flexibility', 'Increase mobility', 'Reduce joint pain'],
  },
  {
    id: 'program-5',
    title: 'Chair Yoga for Strength',
    type: ProgramType.ChairYoga,
    difficultyLevel: DifficultyLevel.Active,
    durationDays: 45,
    thumbnailUrl: '/images/programs/program-5.jpg',
    goals: ['Build muscle strength', 'Improve posture', 'Increase endurance'],
  },
  {
    id: 'program-6',
    title: 'Chair Yoga for Balance',
    type: ProgramType.ChairYoga,
    difficultyLevel: DifficultyLevel.Advanced,
    durationDays: 60,
    thumbnailUrl: '/images/programs/program-6.jpg',
    goals: ['Enhance balance', 'Improve stability', 'Increase core strength'],
  },
];

export const getProgramById = (programId: string) => {
  return programs.find(program => program.id === programId);
};

export const getProgramsByCategory = (category: ProgramType) => {
  return programs.filter(program => program.type === category);
};

export const getProgramsByLevel = (level: DifficultyLevel) => {
  return programs.filter(program => program.difficultyLevel === level);
};