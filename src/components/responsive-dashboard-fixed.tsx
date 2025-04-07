import React, { useState } from 'react';
import { Calendar, Clock, Award, Heart, ChevronRight, Play, Activity } from 'lucide-react';

// Sample data - in a real implementation this would come from props or context
const todayProgram = {
  day: 12,
  month: 3,
  title: "Gentle Neck & Shoulders",
  duration: 20,
  focusArea: "Upper Body",
  completed: false
};

const progress = {
  daysCompleted: 42,
  totalDays: 90,
  streak: 5,
  level: "Novice"
};

const upcomingExercises = [
  { id: 1, name: "Seated Cat-Cow", duration: 2, type: "yoga" },
  { id: 2, name: "Elf Ear Stretch", duration: 1, type: "yoga" },
  { id: 3, name: "Pushing the Mountain", duration: 3, type: "tai-chi" }
];

const achievements = [
  { id: 1, title: "First Week Complete", earned: true },
  { id: 2, title: "10-Day Streak", earned: true },
  { id: 3, title: "Core Master", earned: false }
];

// Progress circular component
const CircularProgress = ({ value, size = 80 }) => {
  const radius = (size - 8) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;
  
  return (
    <div className="relative inline-flex" style={{ width: size, height: size }}>
      <svg className="w-full h-full" viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="text-gray-200"
          strokeWidth="4"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size/2}
          cy={size/2}
        />
        <circle
          className="text-green-500"
          strokeWidth="4"
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size/2}
          cy={size/2}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
            transformOrigin: 'center',
            transform: 'rotate(-90deg)',
            transition: 'stroke-dashoffset 0.5s ease'
          }}
        />
      </svg>
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
        <span className="text-lg font-bold">{value}%</span>
      </div>
    </div>
  );
};

// Dashboard component
const Dashboard = () => {
  const [showAllAchievements, setShowAllAchievements] = useState(false);
  
  // Calculate progress percentage
  const progressPercentage = Math.round((progress.daysCompleted / progress.totalDays) * 100);
  
  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Welcome Back, Susan!</h1>
      
      {/* Today's practice card */}
      <div className="bg-white rounded-lg shadow-md border-2 border-blue-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center mb-2">
              <Calendar size={20} className="text-blue-500 mr-2" />
              <h2 className="text-lg font-medium">Today's Practice</h2>
            </div>
            
            <h3 className="text-xl font-bold mb-2">{todayProgram.title}</h3>
            
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50">
                <Clock size={16} className="mr-1" /> {todayProgram.duration} min
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50">
                {todayProgram.focusArea}
              </span>
            </div>
          </div>
          
          <div className="w-full md:w-auto">
            <button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg text-lg flex items-center justify-center">
              <Play size={20} className="mr-2" /> Start Practice
            </button>
          </div>
        </div>
      </div>
      
      {/* Progress Section */}
      <h2 className="text-xl font-bold mb-4 mt-8">Your Progress</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <CircularProgress value={progressPercentage} />
          <p className="font-medium mt-2">Program Complete</p>
          <p className="text-gray-600 text-sm">
            {progress.daysCompleted} of {progress.totalDays} days
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="flex justify-center mb-2">
            <Heart size={60} className="text-red-500" />
          </div>
          <p className="text-2xl font-bold">{progress.streak}</p>
          <p className="font-medium">Day Streak</p>
          <p className="text-gray-600 text-sm">Keep it going!</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 col-span-1 md:col-span-2">
          <h3 className="font-bold mb-3">Coming Up Next</h3>
          <div>
            {upcomingExercises.map((exercise, index) => (
              <div key={exercise.id} className="mb-2">
                <div className="flex justify-between items-center py-2">
                  <div className="flex items-center">
                    <span className="font-medium">{exercise.name}</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      exercise.type === 'yoga' ? 'bg-purple-100' : 'bg-green-100'
                    }`}>
                      {exercise.type}
                    </span>
                  </div>
                  <span className="text-gray-600 text-sm">{exercise.duration} min</span>
                </div>
                {index < upcomingExercises.length - 1 && (
                  <div className="border-b border-gray-200"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Achievements Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Achievements</h2>
          <button 
            className="text-blue-600 flex items-center"
            onClick={() => setShowAllAchievements(!showAllAchievements)}
          >
            {showAllAchievements ? 'Show Less' : 'View All'}
            <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {achievements
            .slice(0, showAllAchievements ? achievements.length : 2)
            .map(achievement => (
              <div 
                key={achievement.id} 
                className={`bg-white rounded-lg shadow p-4 text-center ${
                  achievement.earned ? 'border-2 border-yellow-300' : 'opacity-70'
                }`}
              >
                <div className="p-2 mb-2 mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-yellow-50">
                  {achievement.earned ? (
                    <Award size={32} className="text-yellow-500" />
                  ) : (
                    <span role="img" aria-label="locked" className="text-3xl">🔒</span>
                  )}
                </div>
                <h3 className="font-bold">{achievement.title}</h3>
                <p className="text-gray-600 text-sm">
                  {achievement.earned ? 'Completed' : 'Keep practicing!'}
                </p>
              </div>
            ))}
        </div>
      </div>
      
      {/* Level Information */}
      <div className="bg-blue-50 rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <p className="text-gray-600 text-sm">Current Level</p>
            <h3 className="font-bold">{progress.level}</h3>
            <p className="mt-1 text-sm">
              You're making great progress! Just 2 more months to reach Active level.
            </p>
          </div>
          <div className="mt-3 md:mt-0">
            <button className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg">
              View Path
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;