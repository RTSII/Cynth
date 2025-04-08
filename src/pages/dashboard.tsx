import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, Clock, Award, ArrowRight, PlayCircle } from 'lucide-react';

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import CircularProgress from '../components/ui/CircularProgress';

import { useUser } from '../contexts/UserContext';
import { useProgress } from '../contexts/ProgressContext';
import { getProgramById } from '../data/programs';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { progress, getCurrentStreak, getTotalPracticeMinutes } = useProgress();
  
  const [greeting, setGreeting] = useState<string>('');
  const [todayDate, setTodayDate] = useState<string>('');
  
  // Get today's exercise info if available
  const chairYogaProgramId = user.selectedPrograms.chairYoga;
  const taiChiProgramId = user.selectedPrograms.taiChi;
  
  const chairYogaProgram = chairYogaProgramId ? getProgramById(chairYogaProgramId) : null;
  const taiChiProgram = taiChiProgramId ? getProgramById(taiChiProgramId) : null;
  
  // Calculate current streak
  const currentStreak = getCurrentStreak();
  const totalMinutes = getTotalPracticeMinutes();
  
  // Set greeting based on time of day
  useEffect(() => {
    const setAppropriateGreeting = () => {
      const now = new Date();
      const hour = now.getHours();
      
      let greetingText = '';
      if (hour < 12) {
        greetingText = 'Good Morning';
      } else if (hour < 18) {
        greetingText = 'Good Afternoon';
      } else {
        greetingText = 'Good Evening';
      }
      
      setGreeting(`${greetingText}, ${user.name}`);
      setTodayDate(format(now, 'EEEE, MMMM d'));
    };
    
    setAppropriateGreeting();
    
    // Update date every minute
    const interval = setInterval(setAppropriateGreeting, 60000);
    
    return () => clearInterval(interval);
  }, [user.name]);
  
  // Handle navigation to today's practice
  const handleStartPractice = () => {
    navigate('/today');
  };
  
  // Handle navigation to programs
  const handleBrowsePrograms = () => {
    navigate('/programs');
  };
  
  // Get latest achievement if there is one
  const latestAchievement = progress.achievements.length > 0
    ? progress.achievements[progress.achievements.length - 1]
    : null;
  
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-800">{greeting}</h1>
        <p className="text-neutral-600">{todayDate}</p>
      </div>
      
      {/* Today's Practice Card */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Today's Practice</CardTitle>
        </CardHeader>
        <CardContent>
          {(chairYogaProgram || taiChiProgram) ? (
            <div className="space-y-4">
              {chairYogaProgram && (
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-lg">Chair Yoga</h3>
                    <p className="text-neutral-600">{chairYogaProgram.title}</p>
                  </div>
                  <Button
                    variant="primary"
                    size="md"
                    rightIcon={<PlayCircle className="w-5 h-5" />}
                    onClick={handleStartPractice}
                  >
                    Start
                  </Button>
                </div>
              )}
              
              {taiChiProgram && (
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-lg">Tai Chi</h3>
                    <p className="text-neutral-600">{taiChiProgram.title}</p>
                  </div>
                  <Button
                    variant="primary"
                    size="md"
                    rightIcon={<PlayCircle className="w-5 h-5" />}
                    onClick={handleStartPractice}
                  >
                    Start
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-neutral-600 mb-4">You haven't selected any programs yet.</p>
              <Button
                variant="primary"
                size="lg"
                onClick={handleBrowsePrograms}
              >
                Browse Programs
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Progress Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col items-center">
              <Calendar className="w-8 h-8 text-primary-500 mb-2" />
              <span className="text-3xl font-semibold text-neutral-800">{currentStreak}</span>
              <span className="text-neutral-600">Day Streak</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col items-center">
              <Clock className="w-8 h-8 text-primary-500 mb-2" />
              <span className="text-3xl font-semibold text-neutral-800">{totalMinutes}</span>
              <span className="text-neutral-600">Total Minutes</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Monthly Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Progress</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <CircularProgress
            value={15} // This should be calculated based on actual monthly progress
            size="lg"
            thickness="thick"
            label="Completed"
            color="primary"
          />
        </CardContent>
      </Card>
      
      {/* Latest Achievement */}
      {latestAchievement && (
        <Card variant="elevated" className="bg-gradient-to-r from-primary-50 to-secondary-50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="w-5 h-5 text-primary-500 mr-2" />
              Latest Achievement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="bg-white p-3 rounded-full mr-4">
                <img
                  src={latestAchievement.iconUrl || '/assets/images/achievements/default.svg'}
                  alt={latestAchievement.title}
                  className="w-12 h-12"
                />
              </div>
              <div>
                <h3 className="font-medium text-lg">{latestAchievement.title}</h3>
                <p className="text-neutral-600">{latestAchievement.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Quick Access */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Quick Access</h2>
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            size="lg"
            isFullWidth
            rightIcon={<ArrowRight className="w-5 h-5" />}
            onClick={() => navigate('/programs')}
          >
            All Programs
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            isFullWidth
            rightIcon={<ArrowRight className="w-5 h-5" />}
            onClick={() => navigate('/inspiration')}
          >
            Inspiration
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
