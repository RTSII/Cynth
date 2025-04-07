import { Program, ProgramDay, Exercise } from '../types';

// Sample program data for CynthAI
export const programs: Program[] = [
  {
    id: 'chair-yoga-novice-month-1',
    title: 'Chair Yoga Foundations',
    description: 'A gentle introduction to chair yoga focusing on basic movements, proper breathing, and body awareness.',
    category: 'chair-yoga',
    level: 'Novice',
    month: 1,
    thumbnail: '/assets/images/programs/chair-yoga-foundations.jpg',
    focusAreas: ['Flexibility', 'Posture', 'Breathing'],
    totalDays: 30,
    totalDuration: 450, // 15 minutes average per day
    recommendedFor: ['Beginners', 'Limited Mobility', 'Seniors'],
    days: [
      {
        id: 'cy-nov-m1-d1',
        programId: 'chair-yoga-novice-month-1',
        dayNumber: 1,
        title: 'Introduction to Chair Yoga',
        description: 'Begin your chair yoga journey with gentle movements and proper breathing techniques.',
        duration: 15, // in minutes
        exercises: [
          {
            id: 'ex-cy-n1-1',
            title: 'Seated Breathing Awareness',
            description: 'Learn to focus on your breath while seated comfortably in a chair.',
            duration: 3, // in minutes
            type: 'warmup',
            focusArea: 'Breathing',
            difficulty: 'easy',
            videoUrl: 'https://player.vimeo.com/video/123456789',
            thumbnailUrl: '/assets/images/exercises/seated-breathing.jpg',
            instructions: [
              'Sit at the edge of your chair with feet flat on the floor',
              'Rest your hands on your thighs',
              'Close your eyes or maintain a soft gaze',
              'Breathe naturally, observing the breath without changing it',
              'Notice the sensation of air moving in and out of your body'
            ],
            benefits: [
              'Calms the nervous system',
              'Reduces stress and anxiety',
              'Improves focus and concentration',
              'Prepares the body for movement'
            ],
            modifications: [
              {
                id: 'mod-cy-n1-1-1',
                title: 'Back Support',
                description: 'For those who need back support during practice',
                forCondition: 'back discomfort',
                instructions: [
                  'Sit with your back against the chair',
                  'Place a small cushion or rolled towel at your lower back if needed',
                  'Keep your feet flat on the floor'
                ]
              }
            ],
            precautions: [
              'If you feel lightheaded, return to normal breathing',
              'Keep your shoulders relaxed, not hunched'
            ],
            repetitions: 5,
            holdTime: 30 // in seconds
          },
          {
            id: 'ex-cy-n1-2',
            title: 'Gentle Neck Stretches',
            description: 'Release tension in your neck with slow, controlled movements.',
            duration: 4, // in minutes
            type: 'core',
            focusArea: 'Neck',
            difficulty: 'easy',
            videoUrl: 'https://player.vimeo.com/video/123456790',
            thumbnailUrl: '/assets/images/exercises/neck-stretches.jpg',
            instructions: [
              'Sit tall with shoulders relaxed',
              'Slowly tilt your right ear toward your right shoulder',
              'Hold for 15-30 seconds, feeling a gentle stretch on the left side of your neck',
              'Return to center, then tilt your left ear toward your left shoulder',
              'Hold for 15-30 seconds',
              'Return to center, then gently lower your chin toward your chest',
              'Hold for 15-30 seconds, feeling the stretch in the back of your neck',
              'Return to center'
            ],
            benefits: [
              'Releases tension in neck muscles',
              'Improves range of motion',
              'Relieves headaches and upper back pain',
              'Promotes relaxation'
            ],
            modifications: [
              {
                id: 'mod-cy-n1-2-1',
                title: 'Reduced Range',
                description: 'For those with significant neck tension or discomfort',
                forCondition: 'neck pain',
                instructions: [
                  'Decrease the range of movement',
                  'Only move to the point of gentle sensation, not pain',
                  'Use a hand to provide gentle assistance if needed'
                ]
              }
            ],
            precautions: [
              'Move slowly and gently',
              'Never force a stretch',
              'Avoid this exercise if you have a recent neck injury',
              'Stop if you feel any sharp pain or dizziness'
            ],
            repetitions: 3,
            holdTime: 20 // in seconds
          },
          {
            id: 'ex-cy-n1-3',
            title: 'Seated Cat-Cow',
            description: 'A gentle spinal movement coordinated with breath to improve flexibility.',
            duration: 5, // in minutes
            type: 'core',
            focusArea: 'Spine',
            difficulty: 'easy',
            videoUrl: 'https://player.vimeo.com/video/123456791',
            thumbnailUrl: '/assets/images/exercises/seated-cat-cow.jpg',
            instructions: [
              'Sit at the edge of your chair with feet flat on the floor',
              'Place your hands on your knees',
              'As you inhale, arch your back and look up (cow pose)',
              'As you exhale, round your spine and look down (cat pose)',
              'Continue this flowing movement with your breath'
            ],
            benefits: [
              'Improves spinal flexibility',
              'Relieves back pain',
              'Promotes better posture',
              'Calms the mind'
            ],
            modifications: [
              {
                id: 'mod-cy-n1-3-1',
                title: 'Limited Mobility Version',
                description: 'For those with limited back mobility',
                forCondition: 'back pain',
                instructions: [
                  'Use a chair with armrests for support',
                  'Reduce the range of motion',
                  'Focus on the breath more than the movement'
                ]
              }
            ],
            precautions: [
              'Avoid this exercise if you have severe back pain',
              'Keep movements slow and controlled',
              'Stop if you feel any sharp pain'
            ],
            repetitions: 10
          },
          {
            id: 'ex-cy-n1-4',
            title: 'Seated Mountain Pose',
            description: 'Establish proper posture and alignment for your practice.',
            duration: 3, // in minutes
            type: 'cooldown',
            focusArea: 'Posture',
            difficulty: 'easy',
            videoUrl: 'https://player.vimeo.com/video/123456792',
            thumbnailUrl: '/assets/images/exercises/seated-mountain.jpg',
            instructions: [
              'Sit at the edge of your chair with feet flat on the floor',
              'Align your feet with your hips',
              'Stack your shoulders over your hips',
              'Lengthen your spine, reaching the crown of your head toward the ceiling',
              'Relax your shoulders down and back',
              'Rest your hands on your thighs',
              'Take deep, even breaths'
            ],
            benefits: [
              'Establishes proper seated posture',
              'Strengthens core muscles',
              'Improves breathing',
              'Promotes body awareness'
            ],
            modifications: [
              {
                id: 'mod-cy-n1-4-1',
                title: 'Back Support',
                description: 'For those who cannot sit at the edge of the chair',
                forCondition: 'balance issues',
                instructions: [
                  'Sit with your back against the chair',
                  'Focus on lengthening your spine against the back of the chair',
                  'Keep your feet firmly planted on the floor'
                ]
              }
            ],
            precautions: [
              'Do not strain to maintain the position',
              'Focus on being comfortable yet alert'
            ],
            repetitions: 1,
            holdTime: 60 // in seconds
          }
        ]
      },
      {
        id: 'cy-nov-m1-d2',
        programId: 'chair-yoga-novice-month-1',
        dayNumber: 2,
        title: 'Gentle Stretching',
        description: 'Focus on gentle stretches to improve flexibility and range of motion.',
        duration: 15,
        exercises: [
          {
            id: 'ex-cy-n1-5',
            title: 'Seated Side Bends',
            description: 'Stretch the sides of your body to improve lateral flexibility.',
            duration: 4,
            type: 'warmup',
            focusArea: 'Side Body',
            difficulty: 'easy',
            videoUrl: 'https://player.vimeo.com/video/123456793',
            thumbnailUrl: '/assets/images/exercises/seated-side-bends.jpg',
            instructions: [
              'Sit tall at the edge of your chair with feet flat on the floor',
              'Extend your right arm overhead',
              'Gently bend to the left, feeling a stretch along your right side',
              'Hold for 15-20 seconds, breathing deeply',
              'Return to center and repeat on the other side'
            ],
            benefits: [
              'Stretches intercostal muscles',
              'Improves lateral flexibility',
              'Enhances breathing capacity',
              'Relieves tension in the sides of the body'
            ],
            modifications: [
              {
                id: 'mod-cy-n1-5-1',
                title: 'Supported Side Bend',
                description: 'For those with limited mobility or balance issues',
                forCondition: 'balance issues',
                instructions: [
                  'Hold the seat of the chair with your opposite hand',
                  'Bend only as far as comfortable',
                  'Focus on keeping the sitting bones grounded'
                ]
              }
            ],
            precautions: [
              'Avoid bending too far to prevent strain',
              'Keep both sitting bones on the chair',
              'Breathe normally throughout the stretch'
            ],
            repetitions: 3,
            holdTime: 20
          },
          {
            id: 'ex-cy-n1-6',
            title: 'Seated Shoulder Rolls',
            description: 'Release tension in the shoulders with gentle circular movements.',
            duration: 3,
            type: 'warmup',
            focusArea: 'Shoulders',
            difficulty: 'easy',
            videoUrl: 'https://player.vimeo.com/video/123456794',
            thumbnailUrl: '/assets/images/exercises/shoulder-rolls.jpg',
            instructions: [
              'Sit tall with feet flat on the floor',
              'Roll both shoulders forward in large circles',
              'Complete 5-8 forward circles',
              'Reverse direction and roll shoulders backward',
              'Complete 5-8 backward circles'
            ],
            benefits: [
              'Relieves shoulder tension',
              'Improves shoulder mobility',
              'Enhances posture',
              'Prepares the upper body for movement'
            ],
            modifications: [
              {
                id: 'mod-cy-n1-6-1',
                title: 'One Side at a Time',
                description: 'For those with shoulder discomfort or limited mobility',
                forCondition: 'shoulder tension',
                instructions: [
                  'Roll one shoulder at a time',
                  'Use smaller movements if needed',
                  'Support the opposite arm on your lap if necessary'
                ]
              }
            ],
            precautions: [
              'Move slowly and gently',
              'Avoid if you have acute shoulder injury',
              'Use smaller movements if you feel any discomfort'
            ],
            repetitions: 8
          },
          {
            id: 'ex-cy-n1-7',
            title: 'Seated Spinal Twist',
            description: 'Improve spinal mobility with gentle twisting movements.',
            duration: 4,
            type: 'core',
            focusArea: 'Spine',
            difficulty: 'easy',
            videoUrl: 'https://player.vimeo.com/video/123456795',
            thumbnailUrl: '/assets/images/exercises/seated-twist.jpg',
            instructions: [
              'Sit tall at the edge of your chair',
              'Place your left hand on your right knee',
              'Place your right hand on the back of the chair or the chair seat',
              'Inhale to lengthen your spine',
              'Exhale as you gently twist to the right',
              'Hold for 15-20 seconds, breathing deeply',
              'Return to center and repeat on the other side'
            ],
            benefits: [
              'Improves spinal mobility',
              'Stimulates internal organs',
              'Relieves back tension',
              'Enhances digestion'
            ],
            modifications: [
              {
                id: 'mod-cy-n1-7-1',
                title: 'Gentle Twist',
                description: 'For those with spinal sensitivity or back pain',
                forCondition: 'back pain',
                instructions: [
                  'Keep the twist very gentle',
                  'Focus on length in the spine first',
                  'Use the chair back for support',
                  'Twist only as far as comfortable'
                ]
              }
            ],
            precautions: [
              'Avoid if you have acute back pain',
              'Twist from the mid-back, not the lower back',
              'Keep the movement gentle and controlled',
              'Never force the twist'
            ],
            repetitions: 2,
            holdTime: 20
          },
          {
            id: 'ex-cy-n1-8',
            title: 'Seated Forward Fold',
            description: 'Stretch the back of the body with a gentle forward bend.',
            duration: 4,
            type: 'cooldown',
            focusArea: 'Hamstrings and Back',
            difficulty: 'easy',
            videoUrl: 'https://player.vimeo.com/video/123456796',
            thumbnailUrl: '/assets/images/exercises/seated-forward-fold.jpg',
            instructions: [
              'Sit toward the front of your chair',
              'Place your feet flat on the floor, hip-width apart',
              'Inhale and lengthen your spine',
              'Exhale and hinge forward from your hips',
              'Let your hands rest on your legs or the floor',
              'Allow your head to hang gently',
              'Hold for 30-60 seconds, breathing deeply',
              'Slowly roll up to seated position, vertebra by vertebra'
            ],
            benefits: [
              'Stretches the entire back of the body',
              'Relieves tension in the spine',
              'Calms the nervous system',
              'Improves hamstring flexibility'
            ],
            modifications: [
              {
                id: 'mod-cy-n1-8-1',
                title: 'Supported Forward Fold',
                description: 'For those with tight hamstrings or back discomfort',
                forCondition: 'tight hamstrings',
                instructions: [
                  'Place a pillow or folded blanket on your legs',
                  'Rest your forehead on the support',
                  'Bend only as far as comfortable',
                  'Keep a slight bend in your knees if needed'
                ]
              }
            ],
            precautions: [
              'Bend from the hips, not the waist',
              'Avoid rounding the spine excessively',
              'Move slowly and gently',
              'Use support if you have difficulty bending forward'
            ],
            repetitions: 1,
            holdTime: 45
          }
        ]
      }
    ]
  },
  {
    id: 'tai-chi-novice-month-1',
    title: 'Tai Chi Basics',
    description: 'An introduction to the gentle flowing movements of Tai Chi, adapted for chair practice.',
    category: 'tai-chi',
    level: 'Novice',
    month: 1,
    thumbnail: '/assets/images/programs/tai-chi-basics.jpg',
    focusAreas: ['Balance', 'Coordination', 'Energy Flow'],
    totalDays: 30,
    totalDuration: 450, // 15 minutes average per day
    recommendedFor: ['Beginners', 'Stress Reduction', 'Seniors'],
    days: [
      {
        id: 'tc-nov-m1-d1',
        programId: 'tai-chi-novice-month-1',
        dayNumber: 1,
        title: 'Introduction to Tai Chi',
        description: 'Learn the basic principles of Tai Chi and begin with simple movements.',
        duration: 15,
        exercises: [
          {
            id: 'ex-tc-n1-1',
            title: 'Centering Breath',
            description: 'Focus on your breath and energy center to prepare for Tai Chi practice.',
            duration: 3,
            type: 'warmup',
            focusArea: 'Breathing',
            difficulty: 'easy',
            videoUrl: 'https://player.vimeo.com/video/123456797',
            thumbnailUrl: '/assets/images/exercises/centering-breath.jpg',
            instructions: [
              'Sit comfortably with feet flat on the floor',
              'Rest your hands on your lower abdomen (Dan Tien)',
              'Close your eyes or maintain a soft gaze',
              'Take slow, deep breaths, focusing on the lower abdomen',
              'Feel your breath expanding and contracting your center',
              'Visualize gathering energy at your Dan Tien'
            ],
            benefits: [
              'Centers the mind and body',
              'Builds energy awareness',
              'Reduces stress and anxiety',
              'Prepares for Tai Chi movements'
            ],
            modifications: [
              {
                id: 'mod-tc-n1-1-1',
                title: 'Supported Centering',
                description: 'For those who need additional back support',
                forCondition: 'back discomfort',
                instructions: [
                  'Sit with your back against the chair',
                  'Use a small cushion for lower back support if needed',
                  'Focus on your breath without trying to sit forward'
                ]
              }
            ],
            precautions: [
              'Breathe naturally, never forcing or straining',
              'Maintain a comfortable seated position',
              'If you feel dizzy, return to normal breathing'
            ],
            repetitions: 1,
            holdTime: 180 // 3 minutes
          },
          {
            id: 'ex-tc-n1-2',
            title: 'Floating Hands',
            description: 'A gentle beginning movement to develop awareness of energy in the hands.',
            duration: 4,
            type: 'core',
            focusArea: 'Arms and Energy Awareness',
            difficulty: 'easy',
            videoUrl: 'https://player.vimeo.com/video/123456798',
            thumbnailUrl: '/assets/images/exercises/floating-hands.jpg',
            instructions: [
              'Sit with feet flat on the floor, back straight',
              'Rest hands palms down on your thighs',
              'Inhale as you slowly raise your hands, palms up',
              'Lift to chest height, feeling as if your hands are floating',
              'At the top, gently turn palms to face down',
              'Exhale as you lower your hands back to your thighs',
              'Repeat the movement, coordinating with your breath'
            ],
            benefits: [
              'Develops energy awareness in the hands',
              'Coordinates breath with movement',
              'Improves focus and concentration',
              'Gently exercises the arms and shoulders'
            ],
            modifications: [
              {
                id: 'mod-tc-n1-2-1',
                title: 'Limited Range',
                description: 'For those with shoulder or arm limitations',
                forCondition: 'shoulder pain',
                instructions: [
                  'Raise hands only as high as comfortable',
                  'Use smaller, gentler movements',
                  'Focus more on the quality of movement than height'
                ]
              }
            ],
            precautions: [
              'Keep shoulders relaxed throughout the movement',
              'Move slowly and gently',
              'Never force the range of motion'
            ],
            repetitions: 8
          },
          {
            id: 'ex-tc-n1-3',
            title: 'Pushing Mountain',
            description: 'A fundamental Tai Chi movement adapted for seated practice.',
            duration: 5,
            type: 'core',
            focusArea: 'Arms and Core',
            difficulty: 'easy',
            videoUrl: 'https://player.vimeo.com/video/123456799',
            thumbnailUrl: '/assets/images/exercises/pushing-mountain.jpg',
            instructions: [
              'Sit with feet flat on the floor, back straight',
              'Begin with hands at center of chest, palms facing out',
              'Inhale and draw elbows back slightly',
              'Exhale as you extend arms forward, as if pushing something heavy',
              'Keep wrists aligned with forearms, fingers naturally spread',
              'Inhale as you return hands to center of chest',
              'Repeat the movement with slow, controlled pace'
            ],
            benefits: [
              'Builds arm and core strength',
              'Develops coordination',
              'Improves breath control',
              'Enhances focus and intention'
            ],
            modifications: [
              {
                id: 'mod-tc-n1-3-1',
                title: 'One Arm Version',
                description: 'For those with limited mobility on one side',
                forCondition: 'one-sided weakness',
                instructions: [
                  'Perform the movement with one arm at a time',
                  'Support the inactive arm in your lap',
                  'Focus on quality movement with the active arm'
                ]
              }
            ],
            precautions: [
              'Keep shoulders relaxed and down',
              'Avoid locking elbows when extending arms',
              'Maintain proper seated posture throughout'
            ],
            repetitions: 8
          },
          {
            id: 'ex-tc-n1-4',
            title: 'Gathering Energy',
            description: 'A calming movement to collect and center your energy.',
            duration: 3,
            type: 'cooldown',
            focusArea: 'Energy Integration',
            difficulty: 'easy',
            videoUrl: 'https://player.vimeo.com/video/123456800',
            thumbnailUrl: '/assets/images/exercises/gathering-energy.jpg',
            instructions: [
              'Sit with feet flat on the floor, back straight',
              'Begin with arms extended to sides at shoulder height',
              'Inhale as you bring arms in, crossing at wrists in front of chest',
              'Exhale as you lower hands to Dan Tien (lower abdomen)',
              'Feel as if you are gathering energy to your center',
              'Pause briefly at the center',
              'Inhale as you raise arms back out to sides',
              'Repeat the gathering motion several times'
            ],
            benefits: [
              'Centers and calms the mind',
              'Creates sense of completion',
              'Improves energy awareness',
              'Integrates the practice experience'
            ],
            modifications: [
              {
                id: 'mod-tc-n1-4-1',
                title: 'Smaller Movements',
                description: 'For those with limited arm mobility',
                forCondition: 'limited range of motion',
                instructions: [
                  'Keep arms lower than shoulder height',
                  'Use smaller circular movements',
                  'Focus on the gathering intention rather than large movements'
                ]
              }
            ],
            precautions: [
              'Keep movements slow and fluid',
              'Avoid straining to reach outward',
              'Maintain steady breathing throughout'
            ],
            repetitions: 6
          }
        ]
      },
      {
        id: 'tc-nov-m1-d2',
        programId: 'tai-chi-novice-month-1',
        dayNumber: 2,
        title: 'Basic Tai Chi Hand Movements',
        description: 'Learn fundamental hand positions and movements used in Tai Chi practice.',
        duration: 15,
        exercises: []
      }
    ]
  }
];

// Function to get program data by ID
export const getProgramData = (programId: string): Program | null => {
  return programs.find(program => program.id === programId) || null;
};

// Function to get program day by ID
export const getProgramDay = (programId: string, dayId: string): ProgramDay | null => {
  const program = getProgramData(programId);
  if (!program) return null;
  
  return program.days.find(day => day.id === dayId) || null;
};

// Function to get exercise data by ID
export const getExerciseData = (exerciseId: string): Exercise | null => {
  for (const program of programs) {
    for (const day of program.days) {
      const exercise = day.exercises.find(ex => ex.id === exerciseId);
      if (exercise) return exercise;
    }
  }
  return null;
};

// Function to get programs by category
export const getProgramsByCategory = (category: 'chair-yoga' | 'tai-chi'): Program[] => {
  return programs.filter(program => program.category === category);
};

// Function to get programs by level
export const getProgramsByLevel = (level: 'Novice' | 'Active' | 'Advanced'): Program[] => {
  return programs.filter(program => program.level === level);
};

// Function to get suggested next program
export const getSuggestedNextProgram = (currentProgramId: string): Program | null => {
  const currentProgram = getProgramData(currentProgramId);
  if (!currentProgram) return null;
  
  // Get programs of same category but next level or month
  let suggestedPrograms = programs.filter(program => 
    program.category === currentProgram.category && 
    ((program.level === currentProgram.level && program.month > currentProgram.month) ||
     (getLevelValue(program.level) > getLevelValue(currentProgram.level) && program.month === 1))
  );
  
  // Sort by level first, then month
  suggestedPrograms.sort((a, b) => {
    const levelDiff = getLevelValue(a.level) - getLevelValue(b.level);
    if (levelDiff !== 0) return levelDiff;
    return a.month - b.month;
  });
  
  return suggestedPrograms[0] || null;
};

// Helper function to convert level to numeric value
const getLevelValue = (level: 'Novice' | 'Active' | 'Advanced'): number => {
  switch (level) {
    case 'Novice': return 1;
    case 'Active': return 2;
    case 'Advanced': return 3;
    default: return 0;
  }
};