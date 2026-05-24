import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { JournalEntry, WorkoutLog, Post, CommentItem, ReplyItem, UserProfile } from './types';
import { ACADEMY_SECTIONS } from './academyCopy';
// @ts-ignore

// ─────────────────────────────────────────────────────────────────
import calimadeLogo from './assets/images/calimadehandlogo.png';
// APP-WIDE STATIC CONSTANTS
// ─────────────────────────────────────────────────────────────────

const WEEKLY_ROUTINE = [
  {
    day: 'Monday', short: 'MON',
    workouts: [
      {
        id: 'w1', name: 'Upper Body Power EMOM', duration: '20 min', type: 'Strength', color: '#3B6CC7', icon: '💪',
        exercises: [
          { name: 'Pull-Ups', reps: '6–8 reps' },
          { name: 'Push-Ups', reps: '12 reps' },
          { name: 'Dips', reps: '10 reps' },
          { name: 'Pike Push-Ups', reps: '10 reps' },
          { name: 'Inverted Rows', reps: '8 reps' },
          { name: 'Hollow Body Hold', reps: '30 secs' }
        ]
      }
    ]
  },
  {
    day: 'Tuesday', short: 'TUE',
    workouts: [
      {
        id: 'w2', name: 'Active Recovery & Mobility', duration: '30 min', type: 'Recovery', color: '#3dd68c', icon: '🧘',
        exercises: [
          { name: 'Cat-Cow Stretch', reps: '10 cycles' },
          { name: 'Hip Flexor Stretch', reps: '60 secs each' },
          { name: 'Thread-the-Needle', reps: '5 each side' },
          { name: 'Shoulder Circles', reps: '30 secs' },
          { name: 'Hamstring Stretch', reps: '60 secs each' },
          { name: 'Child\'s Pose', reps: '90 secs' }
        ]
      }
    ]
  },
  {
    day: 'Wednesday', short: 'WED',
    workouts: [
      {
        id: 'w3', name: 'Full Body Circuit EMOM', duration: '25 min', type: 'Endurance', color: '#f5c842', icon: '🔥',
        exercises: [
          { name: 'Burpees', reps: '8 reps' },
          { name: 'Jump Squats', reps: '10 reps' },
          { name: 'Push-Ups', reps: '12 reps' },
          { name: 'Mountain Climbers', reps: '20 total' },
          { name: 'V-Ups', reps: '10 reps' },
          { name: 'Bear Crawl', reps: '30 secs' }
        ]
      }
    ]
  },
  {
    day: 'Thursday', short: 'THU',
    workouts: [
      {
        id: 'w4', name: 'Endurance Cardio EMOM', duration: '15 min', type: 'Cardio', color: '#5A8DE8', icon: '🏃',
        exercises: [
          { name: 'High Knees', reps: '45 secs' },
          { name: 'Jumping Jacks', reps: '30 reps' },
          { name: 'Sprint in Place', reps: '30 secs' },
          { name: 'Star Jumps', reps: '15 reps' },
          { name: 'Lateral Hops', reps: '20 total' },
          { name: 'Box Jumps / Step-Ups', reps: '10 reps' }
        ]
      }
    ]
  },
  {
    day: 'Friday', short: 'FRI',
    workouts: [
      {
        id: 'w5', name: 'Core & Lower Body', duration: '20 min', type: 'Strength', color: '#e84343', icon: '⚡',
        exercises: [
          { name: 'Pistol Squats (assist)', reps: '5 each' },
          { name: 'Hollow Body Hold', reps: '40 secs' },
          { name: 'Glute Bridges', reps: '15 reps' },
          { name: 'L-Sit Hold', reps: '20 secs' },
          { name: 'Single-Leg Deadlift', reps: '8 each' },
          { name: 'Dragon Flags', reps: '5 reps' }
        ]
      }
    ]
  },
  {
    day: 'Saturday', short: 'SAT',
    workouts: [
      {
        id: 'w6', name: 'Long Endurance Session', duration: '35 min', type: 'Endurance', color: '#a855f7', icon: '🏆',
        exercises: [
          { name: 'Warm-up Jog', reps: '5 mins' },
          { name: 'Burpee Complex', reps: '10 reps' },
          { name: 'Pull-Ups', reps: '8 reps' },
          { name: 'Jump Squats', reps: '12 reps' },
          { name: 'Push-Up to Side Plank', reps: '6 each' },
          { name: 'Cool-down Stretch', reps: '5 mins' }
        ]
      }
    ]
  },
  {
    day: 'Sunday', short: 'SUN',
    workouts: []
  }
];

const DAY_PRESETS: Record<string, any[]> = {
  Push: [
    {
      id: 'p1', name: 'Calisthenics Push Day', duration: '30 min', type: 'Strength', color: '#3B6CC7', icon: '⚡',
      exercises: [
        { name: 'Standard Push-Ups', reps: '3 sets of 10-15 reps' },
        { name: 'Dips (Parallel Bars / Bench)', reps: '3 sets of 8-12 reps' },
        { name: 'Pike Push-Ups', reps: '3 sets of 8-10 reps' },
        { name: 'Diamond Push-Ups', reps: '3 sets of 8-12 reps' },
        { name: 'Bench Dips', reps: '3 sets of 12 reps' }
      ]
    }
  ],
  Pull: [
    {
      id: 'pl1', name: 'Calisthenics Pull Day', duration: '30 min', type: 'Strength', color: '#3B6CC7', icon: '💪',
      exercises: [
        { name: 'Pull-Ups', reps: '3 sets of 6-10 reps' },
        { name: 'Inverted Bodyweight Rows', reps: '3 sets of 8-12 reps' },
        { name: 'Chin-Ups', reps: '3 sets of 6-8 reps' },
        { name: 'Scapular Pulls', reps: '3 sets of 12 reps' },
        { name: 'Hollow Body Hold', reps: '3 sets of 30 secs' }
      ]
    }
  ],
  Legs: [
    {
      id: 'l1', name: 'Calisthenics Legs Day', duration: '30 min', type: 'Legs', color: '#f43f5e', icon: '🦵',
      exercises: [
        { name: 'Pistol Squat Progressions', reps: '3 sets of 5 reps per leg' },
        { name: 'Explosive Jump Squats', reps: '3 sets of 12 reps' },
        { name: 'Walking Lunges', reps: '3 sets of 20 steps' },
        { name: 'Single Leg Glute Bridges', reps: '3 sets of 12 reps per leg' },
        { name: 'Calf Raises', reps: '3 sets of 20 reps' }
      ]
    }
  ],
  Core: [
    {
      id: 'c1', name: 'Core Focus & L-Sit', duration: '20 min', type: 'Strength', color: '#3B6CC7', icon: '🤸',
      exercises: [
        { name: 'L-Sit Hold / Progression', reps: '4 sets of max hold' },
        { name: 'Hollow Body Rockers', reps: '3 sets of 30 secs' },
        { name: 'Hanging Knee Raises', reps: '3 sets of 10-12 reps' },
        { name: 'Standard Plank', reps: '3 sets of 60 secs' },
        { name: 'Russian Twists', reps: '3 sets of 30 reps' }
      ]
    }
  ],
  FullBody: [
    {
      id: 'fb1', name: 'Full Body Power Workout', duration: '35 min', type: 'Strength', color: '#3B6CC7', icon: '🔥',
      exercises: [
        { name: 'Pull-Ups', reps: '3 sets of 6-10 reps' },
        { name: 'Dips', reps: '3 sets of 8-12 reps' },
        { name: 'Air Squats', reps: '3 sets of 20 reps' },
        { name: 'Hanging Leg Raises', reps: '3 sets of 8-10 reps' },
        { name: 'Diamond Push-Ups', reps: '3 sets of 10 reps' }
      ]
    }
  ],
  Recovery: [
    {
      id: 'r1', name: 'Active Recovery & Mobility', duration: '25 min', type: 'Recovery', color: '#3dd68c', icon: '🧘',
      exercises: [
        { name: 'Cat-Cow Stretch', reps: '10 cycles' },
        { name: 'Hip Flexor Stretch', reps: '60 secs per leg' },
        { name: 'Shoulder Circles & Band Pulls', reps: '30 secs' },
        { name: 'Cobra Stretch', reps: '3 cycles of 30 secs' },
        { name: 'Child\'s Pose Hold', reps: '90 secs' }
      ]
    }
  ],
  Cardio: [
    {
      id: 'cd1', name: 'Endurance Cardio Burner', duration: '20 min', type: 'Endurance', color: '#f5c842', icon: '🏃',
      exercises: [
        { name: 'Burpees', reps: '3 sets of 8-12 reps' },
        { name: 'High Knees in Place', reps: '3 sets of 45 secs' },
        { name: 'Mountain Climbers', reps: '3 sets of 30 secs' },
        { name: 'Jumping Jacks', reps: '3 sets of 45 secs' },
        { name: 'Plank Jacks', reps: '3 sets of 30 secs' }
      ]
    }
  ],
  Rest: []
};

const EXERCISE_PRESETS = [
  { value: 'Pull-Ups', label: 'Pull-Ups (Back/Biceps)' },
  { value: 'Chin-Ups', label: 'Chin-Ups (Biceps/Back)' },
  { value: 'Standard Push-Ups', label: 'Standard Push-Ups (Chest/Triceps)' },
  { value: 'Diamond Push-Ups', label: 'Diamond Push-Ups (Triceps/Inner Chest)' },
  { value: 'Pike Push-Ups', label: 'Pike Push-Ups (Shoulders/Delts)' },
  { value: 'Parallel Bar Dips', label: 'Parallel Bar Dips (Triceps/Lower Chest)' },
  { value: 'Inverted Bodyweight Rows', label: 'Inverted Bodyweight Rows (Upper Back)' },
  { value: 'Muscle-Up Progressions', label: 'Muscle-Up Progressions (Explosive Upper)' },
  { value: 'Air Squats', label: 'Air Squats (Quads/Glutes)' },
  { value: 'Walking Lunges', label: 'Walking Lunges (Quads/Hamstrings)' },
  { value: 'Pistol Squat (Assist/Full)', label: 'Pistol Squats (Single-leg Strength)' },
  { value: 'Calf Raises', label: 'Calf Raises (Lower Legs)' },
  { value: 'Hollow Body Hold', label: 'Hollow Body Hold (Core Compression)' },
  { value: 'L-Sit Hold', label: 'L-Sit Hold (Core & Hip Flexor)' },
  { value: 'Plank Hold', label: 'Plank Hold (Core Stability)' },
  { value: 'Burpees', label: 'Burpees (Full Body/Conditioning)' },
  { value: 'Mountain Climbers', label: 'Mountain Climbers (Core/Cardio)' },
  { value: 'Hanging Leg Raises', label: 'Hanging Leg Raises (Lower Abs)' }
];

const CIRCUITS = {
  smallSweat: {
    label: 'Small Sweat', levelClass: 'beginner', rounds: 10, secsPerRound: 60,
    plans: [
      {
        name: '10-Min Endurance Builder', desc: '10 rounds · 1 min each · Full body',
        exercises: [
          { name: 'Jumping Jacks', reps: '20 reps' }, { name: 'Push-Ups', reps: '8–10 reps' },
          { name: 'Air Squats', reps: '15 reps' }, { name: 'High Knees', reps: '30 secs' },
          { name: 'Glute Bridges', reps: '15 reps' }, { name: 'Mountain Climbers', reps: '20 total' },
          { name: 'Step-Back Lunges', reps: '10 each leg' }, { name: 'Superman Hold', reps: '30 secs' },
          { name: 'Plank Hold', reps: '30–45 secs' }, { name: 'Burpees', reps: '5 reps' }
        ]
      },
      {
        name: '10-Min Aerobic Base', desc: '10 rounds · 1 min each · Cardio focus',
        exercises: [
          { name: 'Jog in Place', reps: '45 secs' }, { name: 'Inchworms', reps: '5 reps' },
          { name: 'Side Shuffles', reps: '30 secs each' }, { name: 'Squat Pulses', reps: '20 reps' },
          { name: 'Bear Crawl', reps: '30 secs' }, { name: 'Calf Raises', reps: '25 reps' },
          { name: 'Flutter Kicks', reps: '30 secs' }, { name: 'Skaters', reps: '20 total' },
          { name: 'Tricep Dips', reps: '10 reps' }, { name: 'Dead Bug', reps: '8 each side' }
        ]
      }
    ]
  },
  mediumHeat: {
    label: 'Medium Heat', levelClass: 'intermediate', rounds: 20, secsPerRound: 60,
    plans: [
      {
        name: '20-Min Power Endurance', desc: '20 rounds · 1 min each · Compound',
        exercises: [
          { name: 'Burpees', reps: '8 reps' }, { name: 'Push-Up Variations', reps: '12 reps' },
          { name: 'Jump Squats', reps: '10 reps' }, { name: 'Pull-Ups / Inverted Rows', reps: '6–8 reps' },
          { name: 'V-Ups', reps: '12 reps' }, { name: 'Box Jumps', reps: '8 reps' },
          { name: 'Pike Push-Ups', reps: '10 reps' }, { name: 'Tuck Jumps', reps: '8 reps' },
          { name: 'Plank Shoulder Taps', reps: '20 total' }, { name: 'Bulgarian Split Squat', reps: '8 each' },
          { name: 'Dips', reps: '10–12 reps' }, { name: 'Bear Crawl Circles', reps: '30 secs' },
          { name: 'Reverse Crunches', reps: '15 reps' }, { name: 'Plyometric Push-Ups', reps: '8 reps' },
          { name: 'Pistol Squat (assist)', reps: '5 each' }, { name: 'Hollow Body Hold', reps: '40 secs' },
          { name: 'Chest-to-Bar Pull-Ups', reps: '5 reps' }, { name: 'Lateral Bounds', reps: '10 each' },
          { name: 'L-Sit Hold', reps: '20 secs' }, { name: 'Max Effort Burpees', reps: 'Max 45 secs' }
        ]
      },
      {
        name: '20-Min Cardio Blast', desc: '20 rounds · 1 min each · Cardio focus',
        exercises: [
          { name: 'Sprint in Place', reps: '30 secs' }, { name: 'Burpee Broad Jump', reps: '6 reps' },
          { name: 'Jump Rope (imaginary)', reps: '45 secs' }, { name: 'Speed Squats', reps: '20 reps' },
          { name: 'Mountain Climbers', reps: '30 total' }, { name: 'Star Jumps', reps: '15 reps' },
          { name: 'Speed Push-Ups', reps: '15 reps' }, { name: 'High Knees Sprint', reps: '30 secs' },
          { name: 'Lateral Hops', reps: '20 total' }, { name: 'Plank Hold', reps: '45 secs' },
          { name: 'Jump Lunges', reps: '10 each' }, { name: 'Squat Jumps', reps: '12 reps' },
          { name: 'Inchworm Walk-Outs', reps: '6 reps' }, { name: 'Skaters', reps: '16 total' },
          { name: 'Explosive Push-Ups', reps: '8 reps' }, { name: 'Tuck Jumps', reps: '10 reps' },
          { name: 'Bear Crawl Forward/Back', reps: '30 secs' }, { name: 'Side Plank (each)', reps: '20 secs' },
          { name: 'Burpees', reps: '8 reps' }, { name: 'Max Sprint in Place', reps: '30 secs' }
        ]
      }
    ]
  },
  hardcore: {
    label: 'Hardcore', levelClass: 'advanced', rounds: 30, secsPerRound: 60,
    plans: [
      {
        name: '30-Min Elite EMOM', desc: '30 rounds · 1 min each · Elite endurance',
        exercises: [
          { name: 'Muscle-Up Negatives', reps: '3–5 reps' }, { name: 'Handstand Push-Ups', reps: '5–8 reps' },
          { name: 'Pistol Squats', reps: '6 each' }, { name: 'Ring Dips', reps: '10–12 reps' },
          { name: 'L-Sit to Tuck-Up', reps: '8 reps' }, { name: 'Bar Muscle-Ups', reps: '3–5 reps' },
          { name: 'Planche Tuck Hold', reps: '20 secs' }, { name: 'Dragon Flags', reps: '6 reps' },
          { name: 'One-Arm Push-Up Neg.', reps: '3 each' }, { name: 'Explosive Pull-Ups', reps: '8 reps' },
          { name: 'Typewriters', reps: '5 each' }, { name: 'Frog Stand Hold', reps: '30 secs' },
          { name: 'Clapping Push-Ups', reps: '10 reps' }, { name: 'Chin-Over-Bar Hold', reps: '30 secs' },
          { name: 'Ring Rows (2-sec hold)', reps: '10 reps' }, { name: 'Straddle L-Sit', reps: '20 secs' },
          { name: 'Archer Push-Ups', reps: '6 each' }, { name: 'Tuck Front Lever', reps: '20 secs' },
          { name: 'Burpee Pull-Up', reps: '8 reps' }, { name: 'Handstand Walk (wall)', reps: '30 secs' },
          { name: 'Muscle-Up', reps: '5 reps' }, { name: 'Skin-the-Cat', reps: '5 reps' },
          { name: 'One-Leg Pistol', reps: '5 each' }, { name: 'Planche Push-Up Neg.', reps: '4 reps' },
          { name: 'Human Flag (bent)', reps: '10 secs each' }, { name: 'Pull-Up to L-Sit', reps: '6 reps' },
          { name: 'Pseudo Planche Push-Up', reps: '10 reps' }, { name: 'Reverse Push-Ups', reps: '8 reps' },
          { name: 'Iron Cross Progression', reps: '15 secs' }, { name: 'Max Pull-Ups', reps: 'Max reps' }
        ]
      },
      {
        name: '30-Min Endurance Beast', desc: '30 rounds · 1 min each · Strength-endurance',
        exercises: [
          { name: 'Weighted Pull-Ups', reps: '5 reps' }, { name: 'Ring Push-Ups', reps: '12 reps' },
          { name: 'Single-Leg Squat', reps: '6 each' }, { name: 'Tuck Planche', reps: '20 secs' },
          { name: 'Hanging Leg Raises', reps: '12 reps' }, { name: 'Burpee Muscle-Up', reps: '3 reps' },
          { name: 'Handstand Push-Ups', reps: '6 reps' }, { name: 'Nordic Curls', reps: '5 reps' },
          { name: 'Dragon Flag', reps: '5 reps' }, { name: 'Explosive Rows', reps: '8 reps' },
          { name: 'Front Lever Row', reps: '5 reps' }, { name: 'Plyometric Dips', reps: '8 reps' },
          { name: 'Wall Runs', reps: '6 reps' }, { name: 'Back Lever Hold', reps: '10 secs' },
          { name: 'Ring Muscle-Up', reps: '3 reps' }, { name: 'Pistol Jump Squats', reps: '5 each' },
          { name: 'Maltese Progression', reps: '15 secs' }, { name: 'Hollow Rock', reps: '20 reps' },
          { name: 'Straddle Press HS', reps: '3 reps' }, { name: 'Ring L-Sit', reps: '20 secs' },
          { name: 'Weighted Dips', reps: '8 reps' }, { name: 'Bent Arm Planche', reps: '10 secs' },
          { name: 'Clapping Pull-Ups', reps: '5 reps' }, { name: 'Full Planche Hold', reps: '5 secs' },
          { name: 'Ring Fly Negative', reps: '4 reps' }, { name: 'One-Arm Ring Row', reps: '5 each' },
          { name: 'Press Handstand', reps: '3 reps' }, { name: 'Weighted Pull-Ups', reps: '5 reps' },
          { name: 'Full Body Tension Hold', reps: '30 secs' }, { name: 'All-Out Effort', reps: 'Max 45 secs' }
        ]
      }
    ]
  }
};

const INITIAL_TRENDING_POSTS: Post[] = [
  {
    id: 't-1',
    author: 'Jordan R.',
    initials: 'JR',
    avatarColor: 'linear-gradient(135deg, #1B3A7A, #3B6CC7)',
    text: 'Just destroyed the 30-min advanced EMOM! New PR on muscle-ups 🏆 Feel absolutely bulletproof today!',
    time: '2 hours ago',
    likes: 48,
    liked: false,
    comments: [
      {
        id: 'tc-1',
        author: 'Maya K.',
        initials: 'MK',
        avatarColor: 'linear-gradient(135deg, #3d1a7a, #8b5cf6)',
        text: 'Absolute beast mode Jordan! Those muscle-up ratios are pure inspiration.',
        likes: 5,
        liked: false,
        replies: [
          {
            id: 'tcr-1',
            author: 'Jordan R.',
            initials: 'JR',
            avatarColor: 'linear-gradient(135deg, #1B3A7A, #3B6CC7)',
            text: 'Thanks Maya! Keep grinding, you are amazing!',
            likes: 2,
            liked: false
          }
        ]
      }
    ]
  },
  {
    id: 't-2',
    author: 'Maya K.',
    initials: 'MK',
    avatarColor: 'linear-gradient(135deg, #3d1a7a, #8b5cf6)',
    text: 'Week 4 of CaliMade completed! My push-up count during EMOM went from 8 → 22 reps per round. Never thought I would survive burpees but with consistency magic is happening 😅🤸‍♀️',
    time: '5 hours ago',
    likes: 93,
    liked: false,
    comments: []
  }
];

const AVATAR_PALETTE = [
  'linear-gradient(135deg, #1B3A7A, #3B6CC7)',
  'linear-gradient(135deg, #3d1a7a, #8b5cf6)',
  'linear-gradient(135deg, #1a4a2e, #3dd68c)',
  'linear-gradient(135deg, #7a1b1b, #e84343)',
  'linear-gradient(135deg, #1a3a5e, #4a8fba)',
  'linear-gradient(135deg, #5a3000, #c87800)'
];

import { useAuth } from './AuthContext';
import { db, handleFirestoreError, OperationType } from './firebase';
import { collection, doc, onSnapshot, setDoc, query, orderBy, getDoc, getDocs, deleteDoc, writeBatch } from 'firebase/firestore';

const getTodayDateString = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const getCalendarDays = (year: number, month: number) => {
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday, 1 is Monday...
  const adjustedStart = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  
  const cells: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] = [];
  
  // Previous month filler days
  for (let i = adjustedStart - 1; i >= 0; i--) {
    const prevDay = daysInPrevMonth - i;
    const prevMonthStr = String(month === 0 ? 12 : month).padStart(2, '0');
    const prevYear = month === 0 ? year - 1 : year;
    cells.push({
      dateStr: `${prevYear}-${prevMonthStr}-${String(prevDay).padStart(2, '0')}`,
      dayNum: prevDay,
      isCurrentMonth: false
    });
  }
  
  // Current month days
  const currentMonthStr = String(month + 1).padStart(2, '0');
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({
      dateStr: `${year}-${currentMonthStr}-${String(i).padStart(2, '0')}`,
      dayNum: i,
      isCurrentMonth: true
    });
  }
  
  // Next month filler days
  const remainingCells = 42 - cells.length;
  const nextMonthStr = String(month === 11 ? 1 : month + 2).padStart(2, '0');
  const nextYear = month === 11 ? year + 1 : year;
  for (let i = 1; i <= remainingCells; i++) {
    cells.push({
      dateStr: `${nextYear}-${nextMonthStr}-${String(i).padStart(2, '0')}`,
      dayNum: i,
      isCurrentMonth: false
    });
  }
  
  return cells;
};

export default function App() {
  const { user, loading, signInWithGoogle, logOut } = useAuth();
  
  const [dataLoaded, setDataLoaded] = useState(false);

  const [userRoutineInner, setUserRoutineInner] = useState<any[]>(WEEKLY_ROUTINE);
  const [myCircuitsInner, setMyCircuitsInner] = useState<any[]>([]);
  const [myCircuitsHistory, setMyCircuitsHistory] = useState<any[][]>([]);
  const [myCircuitsFuture, setMyCircuitsFuture] = useState<any[][]>([]);

  const [routineHistory, setRoutineHistory] = useState<any[][]>([]);
  const [routineFuture, setRoutineFuture] = useState<any[][]>([]);
  
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Athlete',
    goal: 'Endurance & Strength',
    level: 'Intermediate',
    memberSince: 'Loading...'
  });

  // Onboarding survey states
  const [hasCompletedSurvey, setHasCompletedSurvey] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [coachAdvice, setCoachAdvice] = useState<string>('');
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const [surveyStep, setSurveyStep] = useState(1);
  const [surveyGoals, setSurveyGoals] = useState<string[]>([]);
  const [surveySkills, setSurveySkills] = useState<string[]>([]);
  const [surveyStrongestMuscles, setSurveyStrongestMuscles] = useState<string[]>([]);
  const [surveyWeakestMuscles, setSurveyWeakestMuscles] = useState<string[]>([]);
  const [surveyLevel, setSurveyLevel] = useState('Intermediate');
  const [surveyDays, setSurveyDays] = useState('3');
  const [surveyDuration, setSurveyDuration] = useState('30-60 min');
  const [surveyTime, setSurveyTime] = useState('Evening');
  const [surveyEquipment, setSurveyEquipment] = useState('Full Gym / Calisthenics Park');
  const [surveyLimitations, setSurveyLimitations] = useState('');
  const [generatingSchedule, setGeneratingSchedule] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem('cm_journal');
    return saved ? JSON.parse(saved) : [];
  });
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);
  const [journalTitle, setJournalTitle] = useState('');
  const [journalContent, setJournalContent] = useState('');

  // Custom Workout dropdown/selector states inside My Routine
  const [addWorkoutDayIdx, setAddWorkoutDayIdx] = useState<number | null>(null);
  const [addWorkoutMainTab, setAddWorkoutMainTab] = useState<'blank' | 'prebuilt'>('blank');
  const [addWorkoutSecondaryTab, setAddWorkoutSecondaryTab] = useState<'custom-routines' | 'prebuilt-presets'>('custom-routines');
  const [prebuiltActiveLevel, setPrebuiltActiveLevel] = useState<'small' | 'medium' | 'hardcore'>('small');
  const [customWorkoutName, setCustomWorkoutName] = useState('');
  const [customWorkoutFocus, setCustomWorkoutFocus] = useState('Strength');
  const [customWorkoutDuration, setCustomWorkoutDuration] = useState('25 min');

  useEffect(() => {
    localStorage.setItem('cm_journal', JSON.stringify(journalEntries));
  }, [journalEntries]);
  const [routineDone, setRoutineDone] = useState<Record<number, boolean>>({});
  
  const [gymSessions, setGymSessions] = useState<string[]>(() => {
    const saved = localStorage.getItem('cm_gym_sessions');
    if (saved) return JSON.parse(saved);
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    return [
      `${y}-${m}-04`,
      `${y}-${m}-08`,
      `${y}-${m}-11`,
      `${y}-${m}-15`,
      `${y}-${m}-18`,
      `${y}-${m}-22`
    ];
  });
  const [calendarYear, setCalendarYear] = useState<number>(new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState<number>(new Date().getMonth());

  useEffect(() => {
    localStorage.setItem('cm_gym_sessions', JSON.stringify(gymSessions));
  }, [gymSessions]);

  const toggleGymSession = (dateStr: string) => {
    setGymSessions(prev => {
      if (prev.includes(dateStr)) {
        return prev.filter(d => d !== dateStr);
      } else {
        return [...prev, dateStr];
      }
    });
  };

  const [communityPosts, setCommunityPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (!user) {
      setDataLoaded(false);
      return;
    }

    try {
      // Setup realtime listener for community posts
      const unsubPosts = onSnapshot(collection(db, 'communityPosts'), snapshot => {
        const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
        // simple sort by timestamp desc
        posts.sort((a,b) => (b.timestamp || 0) - (a.timestamp || 0));
        setCommunityPosts(posts);
      }, err => handleFirestoreError(err, OperationType.GET, 'communityPosts'));

      // load user data
      const loadUserContent = async () => {
        try {
          // get user profile
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setProfile(prev => ({ 
              ...prev, 
              name: userData?.displayName || 'Athlete',
              goal: userData?.goal || prev.goal,
              level: userData?.level || prev.level
            }));
            if (userData?.hasCompletedSurvey) {
              setHasCompletedSurvey(true);
            } else {
              setHasCompletedSurvey(false);
              setIsSurveyOpen(true);
            }
            if (userData?.coachAdvice) {
              setCoachAdvice(userData.coachAdvice);
            }
          } else {
            setHasCompletedSurvey(false);
            setIsSurveyOpen(true);
          }

          // get routine
          const routineDoc = await getDoc(doc(db, 'users', user.uid, 'routine', 'weekly'));
          if (routineDoc.exists() && routineDoc.data().days) {
            setUserRoutineInner(routineDoc.data().days);
          }
          
          // get custom circuits
          const customCircuitsDoc = await getDoc(doc(db, 'users', user.uid, 'customCircuits', 'list'));
          if (customCircuitsDoc.exists() && customCircuitsDoc.data().circuits) {
            setMyCircuitsInner(customCircuitsDoc.data().circuits);
          }

          // get logs
          const logsQuery = query(collection(db, 'users', user.uid, 'logs'), orderBy('timestamp', 'desc'));
          const logsSnap = await getDocs(logsQuery);
          const logsData = logsSnap.docs.map(d => ({ id: d.id, ...d.data() } as WorkoutLog));
          setLogs(logsData);

          setDataLoaded(true);
        } catch (e) {
          console.error('Failed to load user content', e);
          setDataLoaded(true); // render anyway
        }
      };

      loadUserContent();

      return () => {
        unsubPosts();
      };
    } catch(err) {
      console.error(err);
    }
  }, [user]);

  const [userRoutine, userRoutineState] = [userRoutineInner, setUserRoutineInner];
  const [myCircuits, myCircuitsState] = [myCircuitsInner, setMyCircuitsInner];

  const setMyCircuits = (updater: any) => {
    myCircuitsState(prev => {
        const next = typeof updater === 'function' ? updater(prev) : updater;
        if (JSON.stringify(prev) !== JSON.stringify(next)) {
           setMyCircuitsHistory(h => [...h, prev]);
           setMyCircuitsFuture([]);
        }
        if (user) {
          setDoc(doc(db, 'users', user.uid, 'customCircuits', 'list'), {
            userId: user.uid,
            circuits: next
          }).catch(e => handleFirestoreError(e, OperationType.WRITE, 'users/customCircuits'));
        }
        return next;
    });
  };

  const setUserRoutine = (updater: any) => {
    userRoutineState(prev => {
        const next = typeof updater === 'function' ? updater(prev) : updater;
        if (JSON.stringify(prev) !== JSON.stringify(next)) {
           setRoutineHistory(h => [...h, prev]);
           setRoutineFuture([]);
        }
        if (user) {
          setDoc(doc(db, 'users', user.uid, 'routine', 'weekly'), {
            userId: user.uid,
            days: next
          }).catch(e => handleFirestoreError(e, OperationType.WRITE, 'users/routine'));
        }
        return next;
    });
  };

  const handleGenerateSchedule = async () => {
    if (surveyGoals.length === 0) {
      setGenerationError("Please select at least one goal.");
      return;
    }
    setGeneratingSchedule(true);
    setGenerationError(null);

    try {
      const response = await fetch("/api/schedule/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goals: surveyGoals,
          targetSkills: surveySkills,
          strongestMuscle: surveyStrongestMuscles,
          weakestMuscle: surveyWeakestMuscles,
          experienceLevel: surveyLevel,
          workoutsPerWeek: surveyDays,
          duration: surveyDuration,
          timeOfDay: surveyTime,
          equipment: surveyEquipment,
          limitations: surveyLimitations,
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to generate your personalized program.");
      }

      const data = await response.json();
      if (!data.routine || !data.coachAdvice) {
        throw new Error("Invalid response received from AI engine.");
      }

      // Save custom routine and coach advice using state/persistence
      setUserRoutine(data.routine);
      setCoachAdvice(data.coachAdvice);
      setHasCompletedSurvey(true);
      
      // Update basic fields in profile locally
      setProfile(prev => ({
        ...prev,
        goal: surveyGoals.join(" & "),
        level: surveyLevel
      }));

      // Update in Firebase user doc
      if (user) {
        await setDoc(doc(db, "users", user.uid), {
          goal: surveyGoals.join(" & "),
          level: surveyLevel,
          hasCompletedSurvey: true,
          coachAdvice: data.coachAdvice
        }, { merge: true });
      }

      // successfully completed
      setIsSurveyOpen(false);
      setSurveyStep(1);

    } catch (e: any) {
      console.error(e);
      setGenerationError(e.message || "An unexpected error occurred during AI plan generation.");
    } finally {
      setGeneratingSchedule(false);
    }
  };

  const handleUndoMyCircuits = () => {
    if (myCircuitsHistory.length === 0) return;
    const prev = myCircuitsHistory[myCircuitsHistory.length - 1];
    setMyCircuitsHistory(h => h.slice(0, -1));
    myCircuitsState(current => {
       setMyCircuitsFuture(f => [current, ...f]);
       if (user) {
         setDoc(doc(db, 'users', user.uid, 'customCircuits', 'list'), {
           userId: user.uid, circuits: prev
         }).catch();
       }
       return prev;
    });
  };

  const handleRedoMyCircuits = () => {
    if (myCircuitsFuture.length === 0) return;
    const next = myCircuitsFuture[0];
    setMyCircuitsFuture(f => f.slice(1));
    myCircuitsState(current => {
       setMyCircuitsHistory(h => [...h, current]);
       if (user) {
         setDoc(doc(db, 'users', user.uid, 'customCircuits', 'list'), {
           userId: user.uid, circuits: next
         }).catch();
       }
       return next;
    });
  };

  const handleUndoRoutine = () => {
    if (routineHistory.length === 0) return;
    const prev = routineHistory[routineHistory.length - 1];
    setRoutineHistory(h => h.slice(0, -1));
    userRoutineState(current => {
       setRoutineFuture(f => [current, ...f]);
       if (user) {
         setDoc(doc(db, 'users', user.uid, 'routine', 'weekly'), {
           userId: user.uid, days: prev
         }).catch();
       }
       return prev;
    });
  };

  const handleRedoRoutine = () => {
    if (routineFuture.length === 0) return;
    const next = routineFuture[0];
    setRoutineFuture(f => f.slice(1));
    userRoutineState(current => {
       setRoutineHistory(h => [...h, current]);
       if (user) {
         setDoc(doc(db, 'users', user.uid, 'routine', 'weekly'), {
           userId: user.uid, days: next
         }).catch();
       }
       return next;
    });
  };

  type PromptConfig = {
    title: string;
    fields: { 
      id: string, 
      label: string, 
      defaultValue?: string,
      type?: 'text' | 'select',
      options?: {value: string, label: string}[]
    }[];
    onConfirm: (values: Record<string, string>) => void;
    onCancel: () => void;
  } | null;
  const [activePrompt, setActivePrompt] = useState<PromptConfig>(null);

  const [draggedEx, setDraggedEx] = useState<{dIdx: number, wIdx: number, eIdx: number} | null>(null);
  const [draggedWorkout, setDraggedWorkout] = useState<{dIdx: number, wIdx: number} | null>(null);

  // ── THEME CONFIG ──
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('cm_theme');
    return saved ? saved === 'dark' : false;
  });

  // Apply theme class to documentElement
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('cm_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // ── NAVIGATION & PAGE VIEW ──
  const [activePage, setActivePage] = useState<string>('home');
  const [activeWorkoutTab, setActiveWorkoutTab] = useState<string>('learn');
  const [academyTopic, setAcademyTopic] = useState<string | null>(null);

  // Collapse status in list of workouts
  const [expandedRoutineDays, setExpandedRoutineDays] = useState<Record<number, boolean>>({});
  const [expandedCircuits, setExpandedCircuits] = useState<Record<string, boolean>>({});

  const saveProfile = async (newProfile: UserProfile) => {
    setProfile(newProfile);
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), { displayName: newProfile.name }, { merge: true });
      } catch (e) {
        handleFirestoreError(e, OperationType.UPDATE, 'users');
      }
    }
  };

  const currentInitials = useMemo(() => {
    const n = profile.name || 'A';
    return n[0].toUpperCase();
  }, [profile.name]);

  // ── WORKOUT HISTORY & STATS ──
  // Streak status
  const streakDays = 7;

  // KPIs
  const totalWorkoutsCount = logs.length;
  const totalHoursTrained = useMemo(() => {
    const sumMins = logs.reduce((sum, item) => sum + item.dur, 0);
    return parseFloat((sumMins / 60).toFixed(1));
  }, [logs]);
  const prsCount = 18 + logs.filter(l => l.name.toLowerCase().includes('pr') || l.dur > 25).length;

  const totalJournalsCount = journalEntries.length;
  const thisWeekJournalsCount = useMemo(() => {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return journalEntries.filter(entry => entry.timestamp >= oneWeekAgo).length;
  }, [journalEntries]);
  const sessionsLast7DaysCount = useMemo(() => {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return logs.filter(log => (log.timestamp || 0) >= oneWeekAgo).length;
  }, [logs]);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCommunityTab, setActiveCommunityTab] = useState<string>('Trending');

  const filteredPosts = useMemo(() => {
    let list = [...communityPosts];
    if (activeCommunityTab === 'Trending') {
      list.sort((a, b) => b.likes - a.likes);
    } else if (activeCommunityTab === 'Recent') {
      list.sort((a, b) => b.id.localeCompare(a.id));
    } else if (activeCommunityTab === 'PRs') {
      list = list.filter(p => p.text.toLowerCase().includes('pr') || p.text.includes('🏆'));
    } else if (activeCommunityTab === 'Workouts') {
      list = list.filter(p => p.text.toLowerCase().includes('emom') || p.text.toLowerCase().includes('circuit'));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => p.author.toLowerCase().includes(q) || p.text.toLowerCase().includes(q));
    }
    
    // Sort pinned posts first
    list.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return 0;
    });

    return list;
  }, [communityPosts, activeCommunityTab, searchQuery]);

  // Collapse variables for comments/replies
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});
  const [openReplies, setOpenReplies] = useState<Record<string, boolean>>({});

  // Input states for inserting items
  const [newCommentTexts, setNewCommentTexts] = useState<Record<string, string>>({});
  const [newReplyTexts, setNewReplyTexts] = useState<Record<string, string>>({});

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // ── EMOM TIMER CONTROL ENGINE ──
  const [emomTitle, setEmomTitle] = useState<string>('EMOM TIMER');
  const [emomSubtitle, setEmomSubtitle] = useState<string>('Load a circuit above or use the timer below');
  const [emomTotalSeconds, setEmomTotalSeconds] = useState<number>(60);
  const [emomSecondsLeft, setEmomSecondsLeft] = useState<number>(60);
  const [emomRound, setEmomRound] = useState<number>(1);
  const [emomTotalRounds, setEmomTotalRounds] = useState<number>(10);
  const [emomLevelLabel, setEmomLevelLabel] = useState<string>('');
  const [emomLevelClass, setEmomLevelClass] = useState<string>('');
  const [emomExercises, setEmomExercises] = useState<Array<{ name: string; reps: string }>>([
    { name: 'Load a circuit above or tap Play', reps: 'Free Timer Mode' }
  ]);
  const [emomCircuitType, setEmomCircuitType] = useState<string>('emom');
  const [emomIsRunning, setEmomIsRunning] = useState<boolean>(false);

  const emomIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play audio beep tone via Web Audio API 
  const triggerAudioBeep = (doubleTone = false) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      
      const playFreq = (freq: number, startDelay: number) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + startDelay);
        gainNode.gain.setValueAtTime(0.2, ctx.currentTime + startDelay);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startDelay + 0.3);
        osc.start(ctx.currentTime + startDelay);
        osc.stop(ctx.currentTime + startDelay + 0.3);
      };

      playFreq(600, 0);
      if (doubleTone) {
        playFreq(800, 0.18);
      }
    } catch (e) {
      console.warn('Audio feedback failed or not supported in this frame: ', e);
    }
  };

  // Timer loop tick
  useEffect(() => {
    if (emomIsRunning) {
      emomIntervalRef.current = setInterval(() => {
        setEmomSecondsLeft(prev => {
          if (emomCircuitType === 'untimed') {
             return prev + 1; // Stopwatch counting up, rounds manually advanced
          }
          if (emomCircuitType === 'timed') {
             // Straight countdown, no auto round change
             if (prev <= 1) {
                setEmomIsRunning(false);
                triggerAudioBeep(true);
                return 0;
             }
             return prev - 1;
          }
          // EMOM or PYRAMID behavior (Timer resets each round)
          if (prev <= 1) {
            // Next round
            let isFinish = false;
            setEmomRound(curr => {
              if (emomCircuitType === 'pyramid') {
                 // Pyramid counts down from total to 1
                 if (curr <= 1) {
                   isFinish = true;
                   return curr;
                 }
                 triggerAudioBeep(true);
                 return curr - 1;
              } else {
                 // EMOM counts up from 1 to total
                 if (curr >= emomTotalRounds) {
                   isFinish = true;
                   return curr;
                 }
                 triggerAudioBeep(true);
                 return curr + 1;
              }
            });

            if (isFinish) {
              setEmomIsRunning(false);
              triggerAudioBeep(true);
              setTimeout(() => triggerAudioBeep(true), 150);
              return 0;
            }
            return emomTotalSeconds;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (emomIntervalRef.current) {
        clearInterval(emomIntervalRef.current);
      }
    }

    return () => {
      if (emomIntervalRef.current) clearInterval(emomIntervalRef.current);
    };
  }, [emomIsRunning, emomTotalSeconds, emomTotalRounds, emomCircuitType]);

  const loadWorkoutIntoEmom = (cfg: {
    title: string;
    subtitle: string;
    rounds: number;
    secsPerRound: number;
    exercises: Array<{ name: string; reps: string }>;
    levelClass: string;
    levelLabel: string;
    circuitType?: string;
  }) => {
    setEmomIsRunning(false);
    setEmomTitle(cfg.title);
    setEmomSubtitle(cfg.subtitle);
    setEmomTotalRounds(cfg.rounds);
    setEmomRound(cfg.circuitType === 'pyramid' ? cfg.rounds : 1);
    setEmomTotalSeconds(cfg.secsPerRound);
    setEmomSecondsLeft(cfg.circuitType === 'untimed' ? 0 : cfg.secsPerRound);
    setEmomExercises(cfg.exercises);
    setEmomLevelClass(cfg.levelClass);
    setEmomLevelLabel(cfg.levelLabel);
    setEmomCircuitType(cfg.circuitType || 'emom');
  };

  const handleEmomToggle = () => {
    setEmomIsRunning(prev => !prev);
    triggerAudioBeep(false);
  };

  const handleEmomReset = () => {
    setEmomIsRunning(false);
    setEmomSecondsLeft(emomCircuitType === 'untimed' ? 0 : emomTotalSeconds);
    setEmomRound(emomCircuitType === 'pyramid' ? emomTotalRounds : 1);
  };

  const handleEmomSkip = () => {
    if (emomCircuitType === 'pyramid') {
      if (emomRound > 1) {
        triggerAudioBeep(true);
        setEmomRound(prev => prev - 1);
        setEmomSecondsLeft(emomTotalSeconds);
      } else {
        setEmomIsRunning(false);
        setEmomSecondsLeft(0);
        triggerAudioBeep(true);
      }
    } else {
      if (emomRound < emomTotalRounds) {
        triggerAudioBeep(true);
        setEmomRound(prev => prev + 1);
        setEmomSecondsLeft(emomCircuitType === 'untimed' ? 0 : emomTotalSeconds);
      } else {
        // Completed
        setEmomIsRunning(false);
        setEmomSecondsLeft(0);
        triggerAudioBeep(true);
      }
    }
  };

  // Active exercises calculations
  const emomActiveIndex = emomCircuitType === 'pyramid' ? (emomTotalRounds - emomRound) % emomExercises.length : (emomRound - 1) % emomExercises.length;
  const currentEx = emomExercises[emomActiveIndex] || { name: '—', reps: '' };
  const nextEx = emomExercises[(emomActiveIndex + 1) % emomExercises.length];

  // ── MODALS STATE CONTROL ──
  const [isWritePostOpen, setIsWritePostOpen] = useState<boolean>(false);
  const [postComposeText, setPostComposeText] = useState<string>('');
  const [attachedFile, setAttachedFile] = useState<{
    url: string;
    type: 'image' | 'video' | 'file';
    name: string;
  } | null>(null);

  const [isLogWorkoutOpen, setIsLogWorkoutOpen] = useState<boolean>(false);
  const [logWorkoutName, setLogWorkoutName] = useState<string>('');
  const [logDuration, setLogDuration] = useState<string>('');
  const [logExercisesCount, setLogExercisesCount] = useState<string>('');
  const [logNotes, setLogNotes] = useState<string>('');

  // ── GENERAL ACTIONS ──
  const handleAddMyCircuit = () => {
    setActivePrompt({
      title: 'Create Custom Circuit',
      fields: [
        { id: 'name', label: 'Circuit Name', defaultValue: '' },
        { id: 'desc', label: 'Description (e.g., Full Body Burn)', defaultValue: '' },
        { 
          id: 'circuitType', 
          label: 'Circuit Type', 
          defaultValue: 'emom',
          type: 'select',
          options: [
            { value: 'emom', label: 'EMOM (Every Minute on the Minute)' },
            { value: 'timed', label: 'Timed (Running Timer)' },
            { value: 'untimed', label: 'Untimed (Self-paced)' },
            { value: 'pyramid', label: 'Pyramid (X Down/Up)' },
          ]
        },
        { id: 'rounds', label: 'Number of Rounds (or logic val)', defaultValue: '10' },
        { id: 'secs', label: 'Seconds per round / Timer Length', defaultValue: '60' }
      ],
      onCancel: () => setActivePrompt(null),
      onConfirm: (vals) => {
        const name = vals.name.trim();
        const desc = vals.desc.trim();
        const circuitType = vals.circuitType || 'emom';
        const rounds = parseInt(vals.rounds, 10) || 10;
        const secs = parseInt(vals.secs, 10) || 60;
        if (!name) return;
        setMyCircuits(prev => [
          ...prev,
          { name, desc, circuitType, rounds, secsPerRound: secs, exercises: [] }
        ]);
      }
    });
  };

  const handleAddMyCircuitExercise = (cIdx: number) => {
    setActivePrompt({
      title: 'Add Exercise',
      fields: [
        { id: 'name', label: 'Exercise Name', defaultValue: '' },
        { id: 'reps', label: 'Reps/Duration', defaultValue: '10 reps' }
      ],
      onCancel: () => setActivePrompt(null),
      onConfirm: (vals) => {
        const name = vals.name.trim();
        const reps = vals.reps.trim();
        if (!name || !reps) return;
        setMyCircuits(prev => {
          const updated = [...prev];
          const circuit = { ...updated[cIdx] };
          circuit.exercises = [...circuit.exercises, { name, reps }];
          updated[cIdx] = circuit;
          return updated;
        });
      }
    });
  };

  const handleDeleteMyCircuitExercise = (cIdx: number, eIdx: number) => {
    setMyCircuits(prev => {
      const updated = [...prev];
      const circuit = { ...updated[cIdx] };
      circuit.exercises = circuit.exercises.filter((_: any, i: number) => i !== eIdx);
      updated[cIdx] = circuit;
      return updated;
    });
  };

  const handleDeleteMyCircuit = (cIdx: number) => {
    if (confirm('Are you sure you want to delete this custom circuit?')) {
      setMyCircuits(prev => prev.filter((_, i) => i !== cIdx));
    }
  };

  const handleApplyDayPreset = (dIdx: number, pName: string) => {
    setUserRoutine(prev => {
      const updated = [...prev];
      const day = { ...updated[dIdx] };
      day.presetName = pName;
      if (pName === 'Custom') {
        // Just unlinks the preset name mapping
      } else {
        const presetWorkouts = DAY_PRESETS[pName];
        day.workouts = JSON.parse(JSON.stringify(presetWorkouts || []));
      }
      updated[dIdx] = day;
      localStorage.setItem('cm_userRoutine', JSON.stringify(updated));
      return updated;
    });
  };

  const handleAddWorkout = (dIdx: number) => {
    setAddWorkoutDayIdx(dIdx);
    setAddWorkoutMainTab('blank');
    setAddWorkoutSecondaryTab('custom-routines');
    setPrebuiltActiveLevel('small');
    setCustomWorkoutName('');
    setCustomWorkoutFocus('Strength');
    setCustomWorkoutDuration('25 min');
  };

  const handleDropInCircuit = (targetDIdx: number, p: any) => {
    let color = '#3B6CC7'; // default blue
    if (p.circuitType === 'pyramid') color = '#a855f7'; // Skills / Purple
    if (p.circuitType === 'timed') color = '#f5c842'; // Endurance / Gold
    if (p.circuitType === 'untimed') color = '#3dd68c'; // Recovery / Green
    if (p.circuitType === 'emom') color = '#3B6CC7'; // Strength / Blue

    const lName = p.name.toLowerCase();
    if (lName.includes('leg') || lName.includes('squat') || lName.includes('lung')) {
      color = '#f43f5e'; // Legs / Rose
    }

    setUserRoutine(prev => {
      const updated = [...prev];
      const day = {...updated[targetDIdx]};
      day.workouts = [...day.workouts, {
        id: Date.now().toString() + '-' + Math.floor(Math.random() * 10000),
        name: p.name,
        type: p.circuitType === 'untimed' ? 'Recovery' : p.circuitType === 'pyramid' ? 'Skills' : p.circuitType === 'timed' ? 'Endurance' : 'Strength',
        duration: p.desc || '30 min',
        color,
        icon: p.circuitType === 'pyramid' ? '🔺' : p.circuitType === 'timed' ? '⏱️' : p.circuitType === 'untimed' ? '📋' : '⚡',
        exercises: JSON.parse(JSON.stringify(p.exercises || [])) // deep copy
      }];
      updated[targetDIdx] = day;
      return updated;
    });
    setAddWorkoutDayIdx(null); // close modal
  };

  const handleConfirmCustomWorkout = () => {
    if (addWorkoutDayIdx === null) return;
    const name = customWorkoutName.trim();
    if (!name) return;
    const type = customWorkoutFocus.trim() || 'Strength';
    const duration = customWorkoutDuration.trim() || '25 min';

    let color = '#3B6CC7';
    let icon = '⚡';
    if (type === 'Strength') { color = '#3B6CC7'; icon = '⚡'; }
    else if (type === 'Recovery') { color = '#3dd68c'; icon = '😴'; }
    else if (type === 'Endurance') { color = '#f5c842'; icon = '⏱️'; }
    else if (type === 'Skills') { color = '#a855f7'; icon = '🔺'; }
    else if (type === 'Legs') { color = '#f43f5e'; icon = '🦵'; }

    setUserRoutine(prev => {
      const updated = [...prev];
      const day = {...updated[addWorkoutDayIdx]};
      day.workouts = [...day.workouts, {
        id: Date.now().toString() + '-' + Math.floor(Math.random() * 10000),
        name, type, duration, color, icon,
        exercises: []
      }];
      updated[addWorkoutDayIdx] = day;
      return updated;
    });
    setAddWorkoutDayIdx(null); // close modal
  };

  const handleAddExercise = (dIdx: number, wIdx: number) => {
    setActivePrompt({
      title: 'Add Exercise',
      fields: [
        { 
          id: 'preset', 
          label: 'Choose Preset Exercise (Optional)', 
          defaultValue: 'custom', 
          type: 'select',
          options: [
            { value: 'custom', label: '✍️ Type Custom Name Below' },
            ...EXERCISE_PRESETS.map(ep => ({ value: ep.value, label: ep.label }))
          ]
        },
        { id: 'name', label: 'Or Exercise Name (Custom)', defaultValue: '' },
        { id: 'reps', label: 'Reps/Duration', defaultValue: '3 sets of 10 reps' }
      ],
      onCancel: () => setActivePrompt(null),
      onConfirm: (vals) => {
        let name = vals.name.trim();
        const presetVal = vals.preset;
        if (presetVal && presetVal !== 'custom') {
          name = presetVal;
        }
        const reps = vals.reps.trim() || '3 sets of 10 reps';
        if (!name) return;
        setUserRoutine(prev => {
          const updated = [...prev];
          const day = {...updated[dIdx]};
          const workouts = [...day.workouts];
          const workout = {...workouts[wIdx]};
          workout.exercises = [...workout.exercises, { name, reps }];
          workouts[wIdx] = workout;
          day.workouts = workouts;
          updated[dIdx] = day;
          return updated;
        });
      }
    });
  };

  const handleDeleteExercise = (dIdx: number, wIdx: number, eIdx: number) => {
    setUserRoutine(prev => {
      const updated = [...prev];
      const day = {...updated[dIdx]};
      const workouts = [...day.workouts];
      const workout = {...workouts[wIdx]};
      const exercises = [...workout.exercises];
      exercises.splice(eIdx, 1);
      workout.exercises = exercises;
      workouts[wIdx] = workout;
      day.workouts = workouts;
      updated[dIdx] = day;
      return updated;
    });
  };

  const handleDeleteWorkout = (dIdx: number, wIdx: number) => {
    setUserRoutine(prev => {
      const updated = [...prev];
      const day = {...updated[dIdx]};
      const workouts = [...day.workouts];
      workouts.splice(wIdx, 1);
      day.workouts = workouts;
      updated[dIdx] = day;
      return updated;
    });
  };

  const toggleRoutineDayExpanded = (idx: number) => {
    setExpandedRoutineDays(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleCircuitExpanded = (id: string) => {
    setExpandedCircuits(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDayCompleteToggle = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setRoutineDone(prev => {
      const isCurrentlyDone = prev[idx] || false;
      const nextDone = !isCurrentlyDone;
      
      const todayStr = getTodayDateString();
      if (nextDone) {
        setGymSessions(gs => gs.includes(todayStr) ? gs : [...gs, todayStr]);
      } else {
        setGymSessions(gs => gs.filter(d => d !== todayStr));
      }

      return { ...prev, [idx]: nextDone };
    });
  };

  const handleEditProfileName = () => {
    setActivePrompt({
      title: 'Edit Athlete Profile',
      fields: [
        { id: 'name', label: 'Athlete Name', defaultValue: profile.name }
      ],
      onCancel: () => setActivePrompt(null),
      onConfirm: (vals) => {
        const raw = vals.name;
        if (raw && raw.trim()) {
          saveProfile({ ...profile, name: raw.trim() });
        }
      }
    });
  };

  const triggerPostModal = () => {
    setPostComposeText('');
    setAttachedFile(null);
    setIsWritePostOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const resultStr = event.target?.result as string;
      
      let type: 'image' | 'video' | 'file' = 'file';
      if (file.type.startsWith('image/')) {
        type = 'image';
        const img = new Image();
        img.src = resultStr;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const max_width = 800;
          const max_height = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > max_width) {
              height *= max_width / width;
              width = max_width;
            }
          } else {
            if (height > max_height) {
              width *= max_height / height;
              height = max_height;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.65);
          setAttachedFile({
            url: compressed,
            type: 'image',
            name: file.name
          });
        };
      } else if (file.type.startsWith('video/')) {
        type = 'video';
        if (file.size > 1024 * 1024) { // Limit to 1MB
          alert('Video size is too large (maximum 1MB for peer-to-peer preview)');
          return;
        }
        setAttachedFile({
          url: resultStr,
          type: 'video',
          name: file.name
        });
      } else {
        type = 'file';
        if (file.size > 1024 * 1024) { // Limit to 1MB
          alert('File size is too large (maximum 1MB for peer-to-peer storage)');
          return;
        }
        setAttachedFile({
          url: resultStr,
          type: 'file',
          name: file.name
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePublishPost = async () => {
    if (!postComposeText.trim() || !user) return;
    const authorName = profile.name || 'Athlete';
    const newPost: Post = {
      id: 'custom-' + Date.now(),
      author: authorName,
      authorId: user.uid,
      initials: authorName[0].toUpperCase(),
      avatarColor: AVATAR_PALETTE[Math.floor(Math.random() * AVATAR_PALETTE.length)],
      text: postComposeText.trim(),
      time: 'Just now',
      timestamp: Date.now(),
      likes: 0,
      liked: false,
      likedBy: [],
      comments: [],
      mediaUrl: attachedFile?.url || '',
      mediaType: attachedFile?.type || undefined,
      mediaName: attachedFile?.name || ''
    };
    setIsWritePostOpen(false);
    setAttachedFile(null);
    try {
      await setDoc(doc(db, 'communityPosts', newPost.id), newPost);
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, 'communityPosts');
    }
  };

  const handleTogglePin = async (postId: string) => {
    if (!user) return;
    const p = communityPosts.find(x => x.id === postId);
    if (!p) return;

    try {
      await setDoc(doc(db, 'communityPosts', postId), { pinned: !p.pinned }, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, 'communityPosts');
    }
  };

  const handleEditPost = (post: Post) => {
    setActivePrompt({
      title: 'Edit Post Content',
      fields: [
        { id: 'text', label: 'Post Text', defaultValue: post.text }
      ],
      onCancel: () => setActivePrompt(null),
      onConfirm: async (vals) => {
        const raw = vals.text;
        if (raw && raw.trim()) {
          try {
            await setDoc(doc(db, 'communityPosts', post.id), { text: raw.trim() }, { merge: true });
          } catch (e) {
            handleFirestoreError(e, OperationType.UPDATE, 'communityPosts');
          }
        }
      }
    });
  };

  const handleDeletePost = async (postId: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'communityPosts', postId));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, 'communityPosts');
    }
  };

  const handleLikePost = async (postId: string) => {
    if (!user) return;
    const p = communityPosts.find(x => x.id === postId);
    if (!p) return;
    const isLiked = p.likedBy?.includes(user.uid) || (!p.likedBy && p.liked);
    
    let newLikes = p.likes;
    let newLikedBy = p.likedBy ? [...p.likedBy] : [];
    
    if (isLiked) {
      newLikes = Math.max(0, newLikes - 1);
      newLikedBy = newLikedBy.filter(u => u !== user.uid);
    } else {
      newLikes++;
      newLikedBy.push(user.uid);
    }
    
    try {
      await setDoc(doc(db, 'communityPosts', postId), { likes: newLikes, likedBy: newLikedBy }, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, 'communityPosts');
    }
  };

  const handleToggleComments = (postId: string) => {
    setOpenComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handlePostCommentSubmit = async (postId: string) => {
    const textStr = newCommentTexts[postId] || '';
    if (!textStr.trim() || !user) return;
    
    const p = communityPosts.find(x => x.id === postId);
    if (!p) return;

    const newComment: CommentItem = {
      id: 'comment-' + Date.now(),
      author: profile.name || 'Athlete',
      initials: currentInitials,
      avatarColor: AVATAR_PALETTE[Math.floor(Math.random() * AVATAR_PALETTE.length)],
      text: textStr.trim(),
      likes: 0,
      liked: false,
      replies: []
    };
    
    setNewCommentTexts(prev => ({ ...prev, [postId]: '' }));

    try {
      await setDoc(doc(db, 'communityPosts', postId), { comments: [...(p.comments || []), newComment] }, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, 'communityPosts');
    }
  };

  const handleLikeComment = async (postId: string, commentId: string) => {
    if (!user) return;
    const p = communityPosts.find(x => x.id === postId);
    if (!p) return;
    
    const comments = p.comments.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          liked: !c.liked,
          likes: c.likes + (c.liked ? -1 : 1)
        };
      }
      return c;
    });

    try {
      await setDoc(doc(db, 'communityPosts', postId), { comments }, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, 'communityPosts');
    }
  };

  const handleToggleReplies = (commentId: string) => {
    setOpenReplies(prev => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const handlePostReplySubmit = async (postId: string, commentId: string) => {
    const textStr = newReplyTexts[commentId] || '';
    if (!textStr.trim() || !user) return;

    const p = communityPosts.find(x => x.id === postId);
    if (!p) return;

    const comments = p.comments.map(c => {
      if (c.id === commentId) {
        const newReply: ReplyItem = {
          id: 'reply-' + Date.now(),
          author: profile.name || 'Athlete',
          initials: currentInitials,
          avatarColor: AVATAR_PALETTE[Math.floor(Math.random() * AVATAR_PALETTE.length)],
          text: textStr.trim(),
          likes: 0,
          liked: false
        };
        return { ...c, replies: [...(c.replies || []), newReply] };
      }
      return c;
    });

    setNewReplyTexts(prev => ({ ...prev, [commentId]: '' }));
    
    try {
      await setDoc(doc(db, 'communityPosts', postId), { comments }, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, 'communityPosts');
    }
  };

  const handleLikeReply = async (postId: string, commentId: string, replyId: string) => {
    if (!user) return;
    const p = communityPosts.find(x => x.id === postId);
    if (!p) return;

    const comments = p.comments.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          replies: c.replies.map(r => {
            if (r.id === replyId) {
              return { ...r, liked: !r.liked, likes: r.likes + (r.liked ? -1 : 1) };
            }
            return r;
          })
        };
      }
      return c;
    });

    try {
      await setDoc(doc(db, 'communityPosts', postId), { comments }, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, 'communityPosts');
    }
  };

  const handleSaveLoggedWorkout = async () => {
    const wName = logWorkoutName.trim() || 'Custom Training Session';
    const durVal = parseInt(logDuration, 10) || 20;
    const exCount = parseInt(logExercisesCount, 10) || 5;

    const newLogItem: WorkoutLog = {
      id: 'log-' + Date.now(),
      name: wName,
      dur: durVal,
      exercises: exCount,
      notes: logNotes.trim() || undefined,
      date: 'Today',
      icon: '💪',
      timestamp: Date.now(),
      userId: user?.uid || ''
    };

    setLogs(prev => [newLogItem, ...prev]);
    setIsLogWorkoutOpen(false);

    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid, 'logs', newLogItem.id), newLogItem);
      } catch (e) {
        handleFirestoreError(e, OperationType.CREATE, 'users/logs');
      }
    }

    // clear fields
    setLogWorkoutName('');
    setLogDuration('');
    setLogExercisesCount('');
    setLogNotes('');
  };

  const handleSaveJournalEntry = () => {
    if (!journalTitle.trim() && !journalContent.trim()) return;
    const newEntry: JournalEntry = {
      id: 'journal-' + Date.now(),
      title: journalTitle.trim() || 'Untitled Note',
      content: journalContent.trim(),
      timestamp: Date.now()
    };
    setJournalEntries(prev => [newEntry, ...prev]);
    setJournalTitle('');
    setJournalContent('');
    setIsJournalModalOpen(false);
  };

  if (loading || (user && !dataLoaded)) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--bg)] text-[var(--text)]">
        <div className="w-full max-w-sm rounded-[24px] border border-[var(--border)] p-8 text-center bg-[var(--surface)] shadow-2xl">
          <img src={calimadeLogo} alt="CaliMade Logo" className="w-20 auto mx-auto mb-6" />
          <h1 className="text-3xl font-black uppercase tracking-widest mb-2 font-sans bg-clip-text text-transparent bg-gradient-to-r from-[var(--text)] to-[var(--blue-light)]">CALIMADE</h1>
          <p className="text-sm font-semibold text-[var(--gray-light)] mb-8">Sign in to track workouts, create custom circuits, and join the global athlete community.</p>
          <button 
            onClick={signInWithGoogle}
            className="w-full py-4 rounded-xl bg-white text-black font-bold uppercase tracking-widest text-sm cursor-pointer shadow-[0_4px_14px_0_rgba(255,255,255,0.39)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.23)] hover:bg-[rgba(255,255,255,0.9)] transition-all flex items-center justify-center gap-3"
          >
            <svg width="24" height="24" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col no-scrollbar">
      {/* ── HEADER NAVIGATION BAR ── */}
      <header className="h-[var(--header-h)] bg-[var(--surface)] border-b border-[var(--border)] backdrop-blur-md flex items-center justify-between px-4 sticky top-0 z-[110] transition-colors duration-200">
        <div 
          className="flex items-center gap-3 cursor-pointer" 
          onClick={() => setActivePage('home')}
          id="header-sidebar-logo"
        >
          <img 
            src={calimadeLogo} 
            alt="CaliMade" 
            className="w-9 h-9 object-contain" 
            referrerPolicy="no-referrer"
          />
          <span className="font-extrabold text-[21px] tracking-[2px] font-sans bg-clip-text text-transparent bg-gradient-to-r from-[var(--text)] to-[var(--blue-light)] leading-none pt-1">
            CALIMADE
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Notifications Trigger */}
          <div className="relative">
            <button 
              className={`relative w-10 h-10 rounded-full flex items-center justify-center cursor-pointer text-base active:scale-95 transition-all duration-300 ${!hasCompletedSurvey ? 'border-2 border-red-500 ring-4 ring-red-500/40 bg-red-950/20 animate-pulse' : 'bg-[var(--card)] border border-[var(--border)]'}`}
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              id="notifs-trigger-btn"
            >
              🔔
              <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[var(--red)] border border-[var(--surface)]" id="bullet-red-dot"></div>
            </button>

            {isNotificationOpen && (
              <div className="absolute right-0 mt-2.5 w-80 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl p-4 z-[500] animate-fade-in text-left">
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-[var(--border)]">
                  <span className="text-[10px] font-mono tracking-wider text-[var(--gray-light)] uppercase font-bold">Athlete Messages</span>
                  <button 
                    onClick={() => setIsNotificationOpen(false)}
                    className="text-[10px] text-[var(--gray)] hover:text-white font-bold uppercase transition-colors"
                  >
                    Close
                  </button>
                </div>
                
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {!hasCompletedSurvey ? (
                    <div className="p-3 bg-red-950/25 border border-red-500/35 rounded-xl space-y-2.5">
                      <div className="flex gap-2 items-start">
                        <span className="text-base shrink-0">⚠️</span>
                        <div className="space-y-0.5">
                          <div className="text-[11px] font-black text-red-400 uppercase tracking-wide">Survey Form Needed</div>
                          <p className="text-[10px] leading-relaxed text-[var(--gray-light)]">
                            Your weekly calisthenics prescriptions are currently locked. Complete the survey to unlock your custom routine and coach tips!
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setIsNotificationOpen(false);
                          setIsSurveyOpen(true);
                          setSurveyStep(1);
                        }}
                        className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-black text-[10px] uppercase tracking-wider py-2 rounded-lg transition-all cursor-pointer shadow-md text-center"
                      >
                        ⚡ Complete Survey
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 bg-green-950/20 border border-green-500/25 rounded-xl">
                      <div className="flex gap-2 items-start">
                        <span className="text-base shrink-0">🟢</span>
                        <div className="space-y-0.5">
                          <div className="text-[11px] font-black text-green-400 uppercase tracking-wide">Analysis Ready</div>
                          <p className="text-[10px] leading-relaxed text-[var(--gray-light)]">
                            Survey completed successfully. The AI engine has synced your tailored weekly prescriptions.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-3 bg-[var(--card)] border border-[var(--border)] rounded-xl opacity-75">
                    <div className="flex gap-2 items-start">
                      <span className="text-base shrink-0">🔔</span>
                      <div className="space-y-0.5">
                        <div className="text-[11px] font-bold text-[var(--text)] uppercase tracking-wide">Welcome to CaliMade</div>
                        <p className="text-[10px] leading-relaxed text-[var(--gray-light)]">
                          Track routines, view community progress, and share achievements.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* User Profile Emblem */}
          <div 
            className="w-9 h-9 rounded-full bg-gradient-to-tr from-[var(--navy)] to-[var(--blue)] flex items-center justify-center font-bold text-sm text-[var(--text)] border-2 border-[var(--blue)] cursor-pointer active:scale-95 transition-transform"
            onClick={() => setActivePage('profile')}
            id="user-profile-icon"
          >
            {currentInitials}
          </div>
        </div>
      </header>

      {/* ── CENTRAL APP PAGES AREA ── */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden pb-[calc(var(--nav-h)+24px)] max-w-2xl mx-auto w-full">
        
        {/* ── 1. HOME PANEL ── */}
        {activePage === 'home' && (
          <div className="animate-fade-in" id="page-home">
            {/* HERO MODULE */}
            <div className="relative overflow-hidden bg-gradient-to-b from-[rgba(27,58,122,0.15)] to-transparent border-b border-[var(--border)] px-4 py-8">
              <div className="hero-greeting text-xs font-semibold uppercase tracking-[2.5px] text-[var(--blue-light)] mb-1">
                Welcome back,
              </div>
              <div className="hero-name font-black text-4xl tracking-[1.5px] text-[var(--text)] uppercase leading-tight mb-4" id="athletic-banner-name">
                {profile.name}
              </div>
              
              {/* STREAK WIDGET */}
              <div className="absolute top-6 right-4 bg-gradient-to-tr from-[var(--navy)] to-[var(--blue)] rounded-xl px-4 py-2.5 text-center shadow-lg border border-[rgba(90,141,232,0.25)]">
                <div className="text-xl leading-none">🔥</div>
                <div className="font-extrabold text-xl leading-tight text-white font-mono mt-0.5">{streakDays}</div>
                <div className="text-[9px] uppercase tracking-[0.5px] text-zinc-300 font-semibold">Day Streak</div>
              </div>

              {/* ATHLETE QUICK KPIS */}
              <div className="flex gap-6 mt-6 pt-3 border-t border-[rgba(255,255,255,0.04)]">
                <div>
                  <div className="text-2xl font-black text-[var(--text)] font-sans">{totalJournalsCount}</div>
                  <div className="text-[10px] text-[var(--gray)] uppercase tracking-wide">Total Journals</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-[var(--text)] font-sans">{thisWeekJournalsCount}</div>
                  <div className="text-[10px] text-[var(--gray)] uppercase tracking-wide">This Week's</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-[var(--text)] font-sans">{sessionsLast7DaysCount}</div>
                  <div className="text-[10px] text-[var(--gray)] uppercase tracking-wide">Last 7 Days</div>
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS BANNER */}
            <div className="mx-4 mt-5">
              <div 
                className="bg-gradient-to-r from-[var(--navy)] via-[#0f2055] to-zinc-950 rounded-2xl p-4.5 flex items-center gap-4 cursor-pointer border border-[rgba(59,108,199,0.25)] hover:border-[var(--blue)] transition-all duration-200 shadow-md group"
                onClick={() => {
                  setActivePage('workouts');
                  setActiveWorkoutTab('circuits');
                }}
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--blue)] flex items-center justify-center text-2xl text-white shadow-lg group-hover:scale-105 transition-transform duration-200">
                  ⚡
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm tracking-wide text-white font-sans uppercase">Today's Workout Loaded</div>
                  <div className="text-xs text-zinc-400 mt-0.5">20-Min EMOM · Intermediate · Compound</div>
                </div>
                <div className="text-lg text-[var(--blue-light)] group-hover:translate-x-1.5 transition-transform">
                  ▶
                </div>
              </div>
            </div>

            {/* INTERACTIVE NAVIGATION BUTTONS */}
            <div className="grid grid-cols-2 gap-3 p-4">
              <div 
                className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-4.5 cursor-pointer active:scale-[0.98] hover:border-violet-500 transition-all relative overflow-hidden"
                onClick={() => setActivePage('intro')}
              >
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-violet-500"></div>
                <div className="text-2xl mb-1.5">🏁</div>
                <div className="font-extrabold text-sm tracking-wide text-[var(--text)] uppercase">App Info</div>
                <div className="text-[11px] text-[var(--gray-light)] leading-relaxed mt-1">Get started & system tutorial</div>
              </div>

              <div 
                className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-4.5 cursor-pointer active:scale-[0.98] hover:border-blue-500 transition-all relative overflow-hidden"
                onClick={() => {
                  setActivePage('workouts');
                  setActiveWorkoutTab('circuits');
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-blue-500"></div>
                <div className="text-2xl mb-1.5">⚡</div>
                <div className="font-extrabold text-sm tracking-wide text-[var(--text)] uppercase">Workouts</div>
                <div className="text-[11px] text-[var(--gray-light)] leading-relaxed mt-1">Structured EMOM & Circuits</div>
              </div>

              <div 
                className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-4.5 cursor-pointer active:scale-[0.98] hover:border-emerald-500 transition-all relative overflow-hidden"
                onClick={() => setActivePage('progress')}
              >
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-emerald-500"></div>
                <div className="text-2xl mb-1.5">📈</div>
                <div className="font-extrabold text-sm tracking-wide text-[var(--text)] uppercase">Progress</div>
                <div className="text-[11px] text-[var(--gray-light)] leading-relaxed mt-1">Charts, histories & gains</div>
              </div>

              <div 
                className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-4.5 cursor-pointer active:scale-[0.98] hover:border-amber-500 transition-all relative overflow-hidden"
                onClick={() => setActivePage('community')}
              >
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-amber-500"></div>
                <div className="text-2xl mb-1.5">🌎</div>
                <div className="font-extrabold text-sm tracking-wide text-[var(--text)] uppercase">Community</div>
                <div className="text-[11px] text-[var(--gray-light)] leading-relaxed mt-1">Athlete feed & motivation</div>
              </div>
            </div>

            {/* DYNAMIC TRENDING FEED SEGMENT */}
            <div className="px-4 mt-2">
              <div className="text-xs font-bold tracking-[1.5px] uppercase text-[var(--gray-light)] mb-4 flex items-center gap-2">
                🔥 Trending Fitness Feed
                <div className="flex-1 h-[1px] bg-[var(--border)]"></div>
              </div>

              {/* Feed lists */}
              <div className="space-y-3.5">
                {communityPosts.slice(0, 2).map(post => (
                  <div 
                    key={post.id} 
                    className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-4 cursor-pointer hover:border-[var(--blue)] transition-colors duration-150"
                    onClick={() => setActivePage('community')}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs text-white" style={{ background: post.avatarColor }}>
                        {post.initials}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-[var(--text)]">{post.author}</div>
                        <div className="text-[10px] text-[var(--gray)]">{post.time}</div>
                      </div>
                    </div>
                    <div className="text-xs leading-relaxed text-[var(--text2)] line-clamp-3 mb-3">{post.text}</div>
                    <div className="flex items-center gap-4 text-xs text-[var(--gray-light)]">
                      <span>❤️ {post.likes}</span>
                      <span>💬 {post.comments.length}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── 2. INTRO INFORMATION PANEL ── */}
        {activePage === 'intro' && (
          <div className="animate-fade-in" id="page-intro">
            <div className="flex flex-col bg-gradient-to-b from-[rgba(27,58,122,0.1)] to-transparent px-4 py-8">
              <div className="flex flex-col items-center text-center">
                <img 
                  src={calimadeLogo} 
                  alt="CaliMade" 
                  className="w-24 h-24 object-contain animate-logo-pulse mb-4" 
                  referrerPolicy="no-referrer"
                />
                <div className="font-black text-3xl tracking-[3px] text-center leading-none mt-2 bg-clip-text text-transparent bg-gradient-to-r from-[var(--text)] to-[var(--blue-light)]">
                  BUILT FOR ENDURANCE
                </div>
                <div className="text-xs text-[var(--gray-light)] leading-relaxed max-w-sm mt-3.5">
                  The ultimate calisthenics & endurance training helper — engineered for athletes who refuse to plateau.
                </div>
              </div>

              {/* CORE APP BENEFITS GRID */}
              <div className="space-y-4 mt-8">
                <div className="flex gap-4 p-4 rounded-2xl bg-[rgba(27,58,122,0.12)] border border-[rgba(59,108,199,0.15)]">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[var(--navy)] to-[var(--blue)] flex items-center justify-center text-xl shrink-0 text-white">
                    ⏱️
                  </div>
                  <div>
                    <h4 className="font-bold text-sm tracking-wide text-[var(--text)]">EMOM Timers & Circuits</h4>
                    <p className="text-xs text-[var(--gray-light)] leading-relaxed mt-1">Every Minute On The Minute routines with custom audio cues and customizable cycles.</p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 rounded-2xl bg-[rgba(27,58,122,0.12)] border border-[rgba(59,108,199,0.15)]">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[var(--navy)] to-[var(--blue)] flex items-center justify-center text-xl shrink-0 text-white">
                    📅
                  </div>
                  <div>
                    <h4 className="font-bold text-sm tracking-wide text-[var(--text)]">7-Day Weekly Program</h4>
                    <p className="text-xs text-[var(--gray-light)] leading-relaxed mt-1">A structured workout plan tailored for cardiovascular and calisthenics athletes.</p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 rounded-2xl bg-[rgba(27,58,122,0.12)] border border-[rgba(59,108,199,0.15)]">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[var(--navy)] to-[var(--blue)] flex items-center justify-center text-xl shrink-0 text-white">
                    📈
                  </div>
                  <div>
                    <h4 className="font-bold text-sm tracking-wide text-[var(--text)]">Advanced Progress Analytics</h4>
                    <p className="text-xs text-[var(--gray-light)] leading-relaxed mt-1">Track logged metrics and visualize workout progress with clean built-in vector charts.</p>
                  </div>
                </div>
              </div>

              {/* CONVERSATION STARTER BUTTON */}
              <button 
                className="mt-8 bg-gradient-to-tr from-[var(--navy)] to-[var(--blue)] rounded-xl py-4 font-bold text-sm tracking-widest text-center text-white cursor-pointer active:scale-98 shadow-lg hover:shadow-cyan-900/30 transition-all border border-[rgba(59,108,199,0.25)]"
                onClick={() => {
                  setActivePage('workouts');
                  setActiveWorkoutTab('routine');
                }}
              >
                START TRAINING NOW
              </button>
            </div>
          </div>
        )}

        {/* ── 3. WORKOUTS SECTIONS (MAIN TRAINING CENTER) ── */}
        {activePage === 'workouts' && (
          <div className="animate-fade-in" id="page-workouts">
            <div className="px-4 pt-5 pb-1">
              <h1 className="font-extrabold text-2xl tracking-wide text-[var(--text)] uppercase leading-none">WORKOUTS</h1>
              <p className="text-xs text-[var(--gray-light)] mt-1.5 m-0 p-0">Choose your performance mode below</p>
            </div>

            {/* THREE LARGE WORKOUT SUB-TABS */}
            <div className="grid grid-cols-3 gap-2 px-4 py-3">
              <button 
                className={`py-3 px-2 rounded-xl text-center cursor-pointer transition-all border ${activeWorkoutTab === 'learn' ? 'bg-[var(--navy)] border-[var(--blue)] text-white shadow-md' : 'bg-[var(--card)] border-[var(--border)] text-[var(--text)]'}`}
                onClick={() => setActiveWorkoutTab('learn')}
              >
                <div className="text-lg mb-1">📚</div>
                <div className="font-bold text-xs font-mono tracking-wide">LEARN</div>
              </button>
              
              <button 
                className={`py-3 px-2 rounded-xl text-center cursor-pointer transition-all border ${activeWorkoutTab === 'routine' ? 'bg-[var(--navy)] border-[var(--blue)] text-white shadow-md' : 'bg-[var(--card)] border-[var(--border)] text-[var(--text)]'}`}
                onClick={() => setActiveWorkoutTab('routine')}
              >
                <div className="text-lg mb-1">📅</div>
                <div className="font-bold text-xs font-mono tracking-wide text-xs">MY ROUTINE</div>
              </button>

              <button 
                className={`py-3 px-2 rounded-xl text-center cursor-pointer transition-all border ${activeWorkoutTab === 'circuits' ? 'bg-[var(--navy)] border-[var(--blue)] text-white shadow-md' : 'bg-[var(--card)] border-[var(--border)] text-[var(--text)]'}`}
                onClick={() => setActiveWorkoutTab('circuits')}
              >
                <div className="text-lg mb-1">⚡</div>
                <div className="font-bold text-xs font-mono tracking-wide">CIRCUITS</div>
              </button>
            </div>

            {/* SUBTAB 3A: LEARN */}
            {activeWorkoutTab === 'learn' && (
              <div className="px-5 py-8 flex flex-col items-center animate-fade-in" id="wsec-learn">
                {!academyTopic ? (
                  <>
                    <div className="text-62 mb-4">📚</div>
                    <h3 className="font-mono text-xl font-bold tracking-wide text-[var(--text)] mb-8 text-center">CaliMade Academy</h3>
                    
                    <div className="w-full flex flex-col gap-3">
                      {Object.keys(ACADEMY_SECTIONS).map((key) => {
                        const section = ACADEMY_SECTIONS[key];
                        return (
                          <button
                            key={key}
                            onClick={() => setAcademyTopic(key)}
                            className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 flex items-center justify-between shadow-sm active:scale-95 transition-all text-left w-full hover:border-[var(--blue-light)] hover:shadow-cyan-900/10"
                          >
                            <div className="flex items-center gap-4">
                              <div className="text-3xl w-12 h-12 flex items-center justify-center bg-[var(--bg)] rounded-xl border border-[var(--border)] shrink-0">
                                {section.icon}
                              </div>
                              <span className="font-bold text-sm tracking-wide text-[var(--text)] font-sans">{section.title}</span>
                            </div>
                            <div className="text-[var(--blue)] font-bold text-lg">→</div>
                          </button>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="w-full max-w-none pt-2 pb-12">
                    <button
                      onClick={() => setAcademyTopic(null)}
                      className="mb-8 flex items-center gap-2 text-xs font-bold font-mono text-[var(--gray-light)] uppercase tracking-widest hover:text-[var(--text)] transition-colors py-2 px-4 rounded-full border border-[var(--border)] bg-[var(--card)]"
                    >
                      ← Back to menu
                    </button>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="text-4xl">{ACADEMY_SECTIONS[academyTopic].icon}</div>
                      <h2 className="font-bold text-2xl font-sans tracking-tight text-[var(--text)] m-0">{ACADEMY_SECTIONS[academyTopic].title}</h2>
                    </div>
                    <div className="markdown-body text-left w-full max-w-none text-[var(--text)] prose prose-sm prose-invert prose-headings:font-bold prose-h1:text-xl prose-h3:text-[var(--blue-light)] prose-a:text-[var(--blue)] prose-strong:text-[var(--text)] leading-relaxed">
                      <ReactMarkdown>{ACADEMY_SECTIONS[academyTopic].content}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SUBTAB 3B: MY ROUTINE */}
            {activeWorkoutTab === 'routine' && (
              <div className="px-4 space-y-4 animate-fade-in" id="wsec-routine">
                {!hasCompletedSurvey ? (
                  <div className="bg-[var(--card)] rounded-3xl border border-[var(--border)] p-6 text-center shadow-lg py-12 max-w-md mx-auto my-4">
                    <div className="w-16 h-16 bg-[rgba(59,108,199,0.1)] text-[var(--blue-light)] rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 border border-[rgba(59,108,199,0.25)] shadow-inner">
                      📋
                    </div>
                    <h3 className="text-base font-black tracking-wide text-[var(--text)] uppercase">Locked Personal Schedule</h3>
                    <p className="text-xs text-[var(--gray-light)] leading-relaxed mt-2.5 max-w-sm mx-auto">
                      Fill out our quick onboarding survey about goals, experience level, workout habits, and body limitations so we can compile your accurate, personalized weekly calisthenics routine and tips!
                    </p>
                    <button
                      onClick={() => {
                        setIsSurveyOpen(true);
                        setSurveyStep(1);
                        setSurveyGoals([]);
                        setSurveySkills([]);
                        setSurveyLimitations('');
                        setGenerationError(null);
                      }}
                      className="mt-6 w-full bg-gradient-to-r from-[var(--navy)] to-[var(--blue)] hover:from-[var(--blue)] hover:to-[var(--blue-light)] py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-widest text-white shadow-md active:scale-98 cursor-pointer transition-all border border-[rgba(255,255,255,0.05)]"
                    >
                      🚀 Start Athlete Onboarding Survey
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Coach Advice Banner / Card */}
                    {coachAdvice && (
                      <div className="bg-[var(--card)] border-l-4 border-l-[var(--blue)] border-y border-r border-[var(--border)] rounded-2xl p-5 shadow-md mb-2">
                        <div className="flex items-center justify-between mb-3 border-b border-[var(--border)] pb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🏆</span>
                            <h4 className="font-extrabold text-[11px] tracking-[1.5px] uppercase text-[var(--blue-light)] font-mono">Your Personal Routine</h4>
                          </div>
                          <button
                            onClick={() => {
                              setIsSurveyOpen(true);
                              setSurveyStep(1);
                              setGenerationError(null);
                            }}
                            className="text-[9px] font-bold uppercase tracking-wider text-[var(--blue-light)] bg-transparent hover:text-white transition-colors cursor-pointer border border-[var(--border)] px-2.5 py-1 rounded-lg"
                          >
                            ✏️ Re-run Survey
                          </button>
                        </div>
                        <div className="prose prose-sm prose-invert text-left text-xs text-[var(--text2)] space-y-2 leading-relaxed max-h-[220px] overflow-y-auto pr-1">
                          <ReactMarkdown>{coachAdvice}</ReactMarkdown>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between py-1 mb-2">
                      <h3 className="text-[10px] font-black uppercase tracking-[2px] text-[var(--gray-light)]">Your Weekly Prescriptions</h3>
                      <div className="flex gap-2">
                        <button 
                          onClick={handleUndoRoutine} 
                          disabled={routineHistory.length === 0}
                          className={`w-7 h-7 flex items-center justify-center rounded-lg border border-[var(--border)] transition-colors ${routineHistory.length > 0 ? 'bg-[var(--card)] hover:bg-[var(--blue)] text-[var(--text)]' : 'bg-transparent text-[var(--gray)] opacity-50 cursor-not-allowed'}`}
                          title="Undo"
                        >
                          ↩
                        </button>
                        <button 
                          onClick={handleRedoRoutine} 
                          disabled={routineFuture.length === 0}
                          className={`w-7 h-7 flex items-center justify-center rounded-lg border border-[var(--border)] transition-colors ${routineFuture.length > 0 ? 'bg-[var(--card)] hover:bg-[var(--blue)] text-[var(--text)]' : 'bg-transparent text-[var(--gray)] opacity-50 cursor-not-allowed'}`}
                          title="Redo"
                        >
                          ↪
                        </button>
                      </div>
                    </div>


                    {/* Routine Map begins */}
                    {userRoutine.map((day, dIdx) => {
                  const isRest = day.workouts.length === 0;
                  const isCompleted = routineDone[dIdx] || false;
                  const isExpanded = expandedRoutineDays[dIdx] || false;

                  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                  const todayName = daysOfWeek[new Date().getDay()];
                  const isToday = day.day.toLowerCase() === todayName.toLowerCase();

                  return (
                    <div 
                      key={day.day + dIdx} 
                      className={`bg-[var(--card)] rounded-2xl border ${isToday ? 'border-[var(--green)] border-2 shadow-[0_0_12px_rgba(16,185,129,0.25)]' : 'border-[var(--border)]'} overflow-hidden transition-all duration-200 ${isRest ? 'opacity-70' : ''}`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = 'move';
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // If dropping a workout from another day
                        if (draggedWorkout) {
                          const srcDIdx = draggedWorkout.dIdx;
                          const srcWIdx = draggedWorkout.wIdx;
                          if (srcDIdx === dIdx) {
                            setDraggedWorkout(null);
                            return; // Could support same-day reorder, but skip for simplicity
                          }
                          setUserRoutine(prev => {
                            const updated = [...prev];
                            const srcDay = {...updated[srcDIdx]};
                            const srcWorkouts = [...srcDay.workouts];
                            const [removed] = srcWorkouts.splice(srcWIdx, 1);
                            srcDay.workouts = srcWorkouts;
                            updated[srcDIdx] = srcDay;

                            const dstDay = {...updated[dIdx]};
                            dstDay.workouts = [...dstDay.workouts, removed];
                            updated[dIdx] = dstDay;
                            localStorage.setItem('cm_userRoutine', JSON.stringify(updated));
                            return updated;
                          });
                          setDraggedWorkout(null);
                        }
                      }}
                    >
                      <div 
                        className="flex items-center gap-3 p-3.5 cursor-pointer"
                        onClick={() => toggleRoutineDayExpanded(dIdx)}
                      >
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs text-white shrink-0" 
                          style={{ backgroundColor: isRest ? '#6e7781' : day.workouts[0]?.color }}
                        >
                          {day.short}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] text-[var(--gray)] font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                            {day.day}
                            {isToday && (
                              <span className="text-[8px] font-black uppercase tracking-widest bg-emerald-950/50 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded leading-none font-sans">
                                Today
                              </span>
                            )}
                          </div>
                          <div className="text-sm font-bold text-[var(--text)] truncate">
                            {isRest ? 'Rest Day' : day.workouts.length === 1 ? day.workouts[0].name : `${day.workouts.length} Workouts`}
                          </div>
                          <div className="text-xs text-[var(--gray-light)] mt-0.5">
                            {isRest ? '—' : day.workouts.map(w => w.type).join(', ')}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1.5 sm:gap-2.5">
                          {/* Day Preset Selector */}
                          <select
                            value={day.presetName || "Custom"}
                            onChange={(e) => handleApplyDayPreset(dIdx, e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[var(--card2)] hover:bg-[var(--border)] border border-[var(--border)] text-[var(--text)] font-semibold text-[10px] uppercase tracking-wider rounded-lg px-2 py-1 pr-1 outline-none focus:border-[var(--blue)] transition-colors cursor-pointer max-w-[95px] text-center"
                            title="Set Day Preset"
                          >
                            <option value="Custom" className="bg-[var(--card)] text-[var(--text)]">🛠️ Custom</option>
                            <option value="Push" className="bg-[var(--card)] text-[var(--text)]">💪 Push</option>
                            <option value="Pull" className="bg-[var(--card)] text-[var(--text)]">🧗 Pull</option>
                            <option value="Legs" className="bg-[var(--card)] text-[var(--text)]">🦵 Legs</option>
                            <option value="Core" className="bg-[var(--card)] text-[var(--text)]">🤸 Core</option>
                            <option value="FullBody" className="bg-[var(--card)] text-[var(--text)]">🔥 Full Body</option>
                            <option value="Recovery" className="bg-[var(--card)] text-[var(--text)]">🧘 Recovery</option>
                            <option value="Cardio" className="bg-[var(--card)] text-[var(--text)]">🏃 Cardio</option>
                            <option value="Rest" className="bg-[var(--card)] text-[var(--text)]">😴 Rest</option>
                          </select>

                          {/* Complete Day Checkbox */}
                          {!isRest ? (
                            <button
                              className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold transition-all ${isCompleted ? 'bg-[var(--green)] border-[var(--green)] text-white' : 'bg-[var(--card2)] border-[var(--border)]'}`}
                              onClick={(e) => handleDayCompleteToggle(dIdx, e)}
                            >
                              {isCompleted ? '✓' : ''}
                            </button>
                          ) : (
                            <span className="text-xl">😴</span>
                          )}
                          <button 
                            className="w-6 h-6 rounded-full bg-[var(--card2)] hover:bg-[var(--border)] text-[var(--text)] flex items-center justify-center transition-colors"
                            onClick={(e) => { e.stopPropagation(); handleAddWorkout(dIdx); }}
                            title="Add Workout"
                          >
                            +
                          </button>
                          <span className={`text-[11px] text-[var(--gray-light)] transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                            ▼
                          </span>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="px-4 pb-4 pt-1.5 border-t border-[var(--border)] bg-[var(--card2)] transition-all animate-fade-in relative flex flex-col gap-4">
                          {isRest && (
                            <div className="py-2 text-xs text-[var(--gray)] font-medium">Enjoy your Rest Day! Use the '+' icon above to add a workout.</div>
                          )}
                          {day.workouts.map((workout, wIdx) => (
                            <div 
                              key={workout.id + wIdx}
                              className={`bg-[var(--card)] rounded-xl border border-[var(--border)] p-3 shadow-sm ${draggedWorkout?.dIdx === dIdx && draggedWorkout?.wIdx === wIdx ? 'opacity-30' : 'opacity-100'}`}
                              draggable
                              onDragStart={(e) => {
                                setDraggedWorkout({dIdx, wIdx});
                                e.currentTarget.classList.add('opacity-30');
                                e.dataTransfer.effectAllowed = 'move';
                              }}
                              onDragEnd={(e) => {
                                e.currentTarget.classList.remove('opacity-30');
                                setDraggedWorkout(null);
                              }}
                            >
                              <div className="flex items-center justify-between mb-3 border-b border-[var(--border)] pb-2 cursor-grab active:cursor-grabbing" title="Drag to move workout">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{workout.icon}</span>
                                  <div className="font-bold text-sm text-[var(--text)] tracking-tight">{workout.name}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="text-[10px] text-[var(--gray-light)]">{workout.duration}</div>
                                  <button
                                    onClick={() => handleDeleteWorkout(dIdx, wIdx)}
                                    className="text-red-500 hover:text-red-400 opacity-60 hover:opacity-100 transition-opacity"
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </div>

                              <div className="flex items-center justify-between mb-2">
                                <div className="text-[10px] font-bold text-[var(--gray-light)] tracking-wider uppercase">Exercises</div>
                                <button 
                                  onClick={() => handleAddExercise(dIdx, wIdx)} 
                                  className="w-5 h-5 flex items-center justify-center bg-[var(--border)] hover:bg-[var(--blue)] hover:text-white rounded text-xs font-bold transition-colors text-[var(--text)]"
                                >
                                  +
                                </button>
                              </div>

                              {workout.exercises.length > 0 ? (
                                <div className="divide-y divide-[rgba(255,255,255,0.03)] flex flex-col">
                                  {workout.exercises.map((ex, eIdx) => (
                                    <div 
                                      key={ex.name + eIdx} 
                                      className={`flex items-center justify-between py-2 text-xs transition-opacity duration-200 ${draggedEx?.dIdx === dIdx && draggedEx?.wIdx === wIdx && draggedEx?.eIdx === eIdx ? 'opacity-30' : 'opacity-100'}`}
                                      draggable
                                      onDragStart={(e) => {
                                        setDraggedEx({dIdx, wIdx, eIdx});
                                        e.currentTarget.classList.add('opacity-30');
                                        e.dataTransfer.effectAllowed = 'move';
                                      }}
                                      onDragEnd={(e) => {
                                        e.currentTarget.classList.remove('opacity-30');
                                        setDraggedEx(null);
                                      }}
                                      onDragOver={(e) => {
                                        e.preventDefault();
                                        e.dataTransfer.dropEffect = 'move';
                                      }}
                                      onDrop={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (!draggedEx) return;
                                        if (draggedEx.dIdx !== dIdx || draggedEx.wIdx !== wIdx) return;
                                        
                                        const srcIdx = draggedEx.eIdx;
                                        const dstIdx = eIdx;
                                        if (srcIdx === dstIdx) return;
                                        
                                        setUserRoutine(prev => {
                                          const updated = [...prev];
                                          const newDay = {...updated[dIdx]};
                                          const newWorkouts = [...newDay.workouts];
                                          const newWorkout = {...newWorkouts[wIdx]};
                                          const exercises = [...newWorkout.exercises];
                                          const [removed] = exercises.splice(srcIdx, 1);
                                          exercises.splice(dstIdx, 0, removed);
                                          newWorkout.exercises = exercises;
                                          newWorkouts[wIdx] = newWorkout;
                                          newDay.workouts = newWorkouts;
                                          updated[dIdx] = newDay;
                                          localStorage.setItem('cm_userRoutine', JSON.stringify(updated));
                                          return updated;
                                        });
                                        setDraggedEx(null);
                                      }}
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className="text-[10px] text-[var(--gray)] cursor-grab active:cursor-grabbing hover:text-[var(--text)] transition-colors">
                                          ☰
                                        </div>
                                        <span className="font-mono font-bold text-[var(--blue-light)] w-4 text-center">{eIdx + 1}</span>
                                        <span className="font-medium text-[var(--text)]">{ex.name}</span>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <span className="text-[var(--gray)] font-semibold">{ex.reps}</span>
                                        <button 
                                          onClick={() => handleDeleteExercise(dIdx, wIdx, eIdx)} 
                                          className="text-red-500 hover:text-red-400 opacity-60 hover:opacity-100 transition-opacity text-xs"
                                        >
                                          🗑️
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="py-2 text-[10px] text-[var(--gray)] font-medium">No exercises added yet.</div>
                              )}

                              <button 
                                className="mt-2 w-full bg-gradient-to-r from-[var(--navy)] to-[var(--blue)] hover:from-[var(--blue)] hover:to-[var(--navy-light)] rounded-lg py-2 font-semibold text-xs text-white uppercase tracking-widest cursor-pointer transition-all"
                                onClick={() => {
                                  loadWorkoutIntoEmom({
                                    title: workout.name,
                                    subtitle: `${workout.duration} · ${workout.type}`,
                                    rounds: workout.exercises.length,
                                    secsPerRound: 60,
                                    exercises: workout.exercises,
                                    levelClass: 'intermediate',
                                    levelLabel: workout.type
                                  });
                                  setTimeout(() => {
                                    document.getElementById('emomWrap')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                  }, 100);
                                }}
                              >
                                🚀 LOAD EMOM
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}

            {/* SUBTAB 3C: CIRCUITS */}
            {activeWorkoutTab === 'circuits' && (
              <div className="animate-fade-in" id="wsec-circuits">
                
                {/* INTERACTIVE PLANS GRID */}
                <div className="px-4 space-y-5">
                  {/* MY CIRCUITS SECTION */}
                  <div key="myCircuits">
                    <div className="text-[11px] font-bold tracking-[2px] uppercase text-[var(--gray-light)] mb-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1 mr-2">
                        My Circuit designs
                        <div className="flex-1 h-[1px] bg-[var(--border)]"></div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={handleUndoMyCircuits} 
                          disabled={myCircuitsHistory.length === 0}
                          className={`w-6 h-6 flex items-center justify-center rounded-lg border border-[var(--border)] transition-colors ${myCircuitsHistory.length > 0 ? 'bg-[var(--card)] hover:bg-[var(--blue)] text-[var(--text)]' : 'bg-[var(--card2)] text-[var(--gray)] opacity-50 cursor-not-allowed'}`}
                          title="Undo Custom Circuit Changes"
                        >
                          ↩
                        </button>
                        <button 
                          onClick={handleRedoMyCircuits} 
                          disabled={myCircuitsFuture.length === 0}
                          className={`w-6 h-6 flex items-center justify-center rounded-lg border border-[var(--border)] transition-colors ${myCircuitsFuture.length > 0 ? 'bg-[var(--card)] hover:bg-[var(--blue)] text-[var(--text)]' : 'bg-[var(--card2)] text-[var(--gray)] opacity-50 cursor-not-allowed'}`}
                          title="Redo Custom Circuit Changes"
                        >
                          ↪
                        </button>
                        <button
                          onClick={handleAddMyCircuit}
                          className="w-6 h-6 flex-shrink-0 rounded-full bg-[var(--card2)] border border-[var(--border)] hover:bg-[var(--blue)] hover:text-white text-[var(--text)] flex items-center justify-center transition-colors shadow-sm ml-1"
                          title="Create custom circuit"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {myCircuits.length === 0 && (
                        <div className="text-xs text-[var(--gray)] italic py-2 text-center bg-[var(--card2)] rounded-xl border border-[var(--border)]">
                          No custom circuits yet. Tap '+' to build one.
                        </div>
                      )}
                      {myCircuits.map((p, pIdx) => {
                        const idStr = `my-${pIdx}`;
                        const isExpanded = expandedCircuits[idStr] || false;

                        return (
                          <div key={p.name + pIdx} className="bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden">
                            <div 
                              className="flex items-center justify-between p-3.5 cursor-pointer"
                              onClick={() => toggleCircuitExpanded(idStr)}
                            >
                              <div className="flex-1 pr-4">
                                <span className="inline-block text-[9px] font-black uppercase tracking-wider bg-[rgba(232,67,67,0.1)] text-[var(--red)] border border-[rgba(232,67,67,0.25)] rounded-full px-2.5 py-0.5 mb-1.5 mr-2">
                                  Custom Plan
                                </span>
                                {p.circuitType === 'pyramid' && <span className="inline-block text-[9px] font-black uppercase tracking-wider bg-[rgba(150,100,250,0.1)] text-purple-400 border border-[rgba(150,100,250,0.25)] rounded-full px-2.5 py-0.5 mb-1.5 mr-2">Pyramid</span>}
                                {p.circuitType === 'untimed' && <span className="inline-block text-[9px] font-black uppercase tracking-wider bg-[rgba(100,200,250,0.1)] text-cyan-400 border border-[rgba(100,200,250,0.25)] rounded-full px-2.5 py-0.5 mb-1.5 mr-2">Untimed</span>}
                                {p.circuitType === 'timed' && <span className="inline-block text-[9px] font-black uppercase tracking-wider bg-[rgba(250,150,50,0.1)] text-orange-400 border border-[rgba(250,150,50,0.25)] rounded-full px-2.5 py-0.5 mb-1.5 mr-2">Timed</span>}
                                {(!p.circuitType || p.circuitType === 'emom') && <span className="inline-block text-[9px] font-black uppercase tracking-wider bg-[rgba(61,214,140,0.1)] text-[var(--green)] border border-[rgba(61,214,140,0.25)] rounded-full px-2.5 py-0.5 mb-1.5 mr-2">EMOM</span>}
                                <h3 className="font-extrabold text-sm tracking-wide text-[var(--text)]">{p.name}</h3>
                                <p className="text-xs text-[var(--gray-light)] mt-0.5 leading-none line-clamp-1">{p.desc}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <button className="w-6 h-6 flex items-center justify-center bg-[var(--card2)] rounded-full hover:bg-zinc-700 transition" onClick={(e) => { e.stopPropagation(); handleDeleteMyCircuit(pIdx); }}>✕</button>
                                <span className={`text-[11px] text-[var(--gray-light)] transition-transform duration-250 ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                              </div>
                            </div>

                            {isExpanded && (
                              <div className="px-4 pb-4 pt-1.5 border-t border-[var(--border)] bg-[var(--card2)] animate-fade-in">
                                <div className="flex items-center justify-between mb-2">
                                   <div className="text-[10px] font-bold text-[var(--gray-light)] tracking-wider uppercase">Exercises</div>
                                   <button 
                                     onClick={() => handleAddMyCircuitExercise(pIdx)} 
                                     className="w-5 h-5 flex items-center justify-center bg-[var(--border)] hover:bg-[var(--blue)] hover:text-white rounded text-xs font-bold transition-colors text-[var(--text)]"
                                   >
                                     +
                                   </button>
                                </div>
                                <div className="divide-y divide-[rgba(255,255,255,0.03)] text-xs">
                                  {p.exercises.length === 0 && <div className="py-2 text-[var(--gray)]">No exercises added.</div>}
                                  {p.exercises.map((ex: any, eIdx: number) => (
                                    <div key={eIdx} className="flex justify-between py-2 text-xs group">
                                      <div className="flex items-center gap-3">
                                        <span className="font-mono font-bold text-[var(--blue-light)] w-4 text-center">{eIdx + 1}</span>
                                        <span className="font-medium text-[var(--text)]">{ex.name}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-zinc-400 font-semibold">{ex.reps}</span>
                                        <button 
                                          onClick={() => handleDeleteMyCircuitExercise(pIdx, eIdx)}
                                          className="text-[10px] text-[var(--red)] opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                          ✕
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                <button 
                                  className="mt-3.5 w-full bg-gradient-to-r from-[var(--navy)] to-[var(--blue)] hover:from-[var(--blue)] hover:to-[var(--navy-light)] rounded-xl py-3 font-semibold text-xs text-white uppercase tracking-widest cursor-pointer active:scale-[0.99] transition-all disabled:opacity-50"
                                  disabled={p.exercises.length === 0}
                                  onClick={() => {
                                    loadWorkoutIntoEmom({
                                      title: p.name,
                                      subtitle: p.desc,
                                      rounds: p.rounds || p.exercises.length,
                                      secsPerRound: p.secsPerRound || 60,
                                      exercises: p.exercises,
                                      levelClass: 'advanced', // just some color
                                      levelLabel: p.circuitType === 'pyramid' ? 'Pyramid' : p.circuitType === 'timed' ? 'Timed' : p.circuitType === 'untimed' ? 'Untimed' : 'Custom Plan',
                                      circuitType: p.circuitType
                                    });
                                    setTimeout(() => {
                                      document.getElementById('emomWrap')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }, 100);
                                  }}
                                >
                                  {p.circuitType === 'untimed' ? '📋 LOAD WORKOUT' : p.circuitType === 'timed' ? '⏱ LOAD TIMED WORKOUT' : p.circuitType === 'pyramid' ? '🔺 LOAD PYRAMID' : '⏱ LOAD INTO EMOM TIMER'}
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {Object.entries(CIRCUITS).map(([lvlKey, group]) => (
                    <div key={lvlKey}>
                      <div className="text-[11px] font-bold tracking-[2px] uppercase text-[var(--gray-light)] mb-2.5 flex items-center gap-2">
                        {group.label} Circuits
                        <div className="flex-1 h-[1px] bg-[var(--border)]"></div>
                      </div>

                      <div className="space-y-2">
                        {group.plans.map((p, pIdx) => {
                          const idStr = `${lvlKey}-${pIdx}`;
                          const isExpanded = expandedCircuits[idStr] || false;

                          return (
                            <div key={p.name} className="bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden">
                              <div 
                                className="flex items-center justify-between p-3.5 cursor-pointer"
                                onClick={() => toggleCircuitExpanded(idStr)}
                              >
                                <div>
                                  <span className="inline-block text-[9px] font-black uppercase tracking-wider bg-[rgba(59,108,199,0.1)] text-[var(--blue-light)] border border-[rgba(59,108,199,0.25)] rounded-full px-2.5 py-0.5 mb-1.5">
                                    {group.label} Plan
                                  </span>
                                  <h3 className="font-extrabold text-sm tracking-wide text-[var(--text)]">{p.name}</h3>
                                  <p className="text-xs text-[var(--gray-light)] mt-0.5 leading-none">{p.desc}</p>
                                </div>
                                <span className={`text-[11px] text-[var(--gray-light)] transition-transform duration-250 ${isExpanded ? 'rotate-180' : ''}`}>
                                  ▼
                                </span>
                              </div>

                              {isExpanded && (
                                <div className="px-4 pb-4 pt-1.5 border-t border-[var(--border)] bg-[var(--card2)] animate-fade-in">
                                  <div className="divide-y divide-[rgba(255,255,255,0.03)]">
                                    {p.exercises.map((ex, eIdx) => (
                                      <div key={eIdx} className="flex justify-between py-2 text-xs">
                                        <div className="flex items-center gap-3">
                                          <span className="font-mono font-bold text-[var(--blue-light)] w-4 text-center">{eIdx + 1}</span>
                                          <span className="font-medium text-[var(--text)]">{ex.name}</span>
                                        </div>
                                        <span className="text-zinc-400 font-semibold">{ex.reps}</span>
                                      </div>
                                    ))}
                                  </div>

                                  <button 
                                    className="mt-3.5 w-full bg-gradient-to-r from-[var(--navy)] to-[var(--blue)] hover:from-[var(--blue)] hover:to-[var(--navy-light)] rounded-xl py-3 font-semibold text-xs text-white uppercase tracking-widest cursor-pointer active:scale-[0.99] transition-all"
                                    onClick={() => {
                                      loadWorkoutIntoEmom({
                                        title: p.name,
                                        subtitle: p.desc,
                                        rounds: group.rounds,
                                        secsPerRound: group.secsPerRound,
                                        exercises: p.exercises,
                                        levelClass: group.levelClass,
                                        levelLabel: group.label
                                      });
                                      // Scroll directly to EMOM section
                                      setTimeout(() => {
                                        document.getElementById('emomWrap')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                      }, 100);
                                    }}
                                  >
                                    ⏱ LOAD CIRCUIT
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* CIRCUIT TIMER MODULE */}
                <div className="mx-4 mt-6" id="emomWrap">
                  <div className="text-[11px] font-bold tracking-[2px] uppercase text-[var(--gray-light)] mb-2.5 flex items-center gap-2">
                    ⏱️ {emomCircuitType === 'emom' ? 'Live EMOM Countdown' : emomCircuitType === 'timed' ? 'Live Timed Circuit' : emomCircuitType === 'untimed' ? 'Untimed Session' : 'Pyramid Round Tracker'}
                    <div className="flex-1 h-[1px] bg-[var(--border)]"></div>
                  </div>

                  <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden shadow-xl">
                    {/* Header */}
                    <div className="bg-gradient-to-b from-[#1B3A7A] to-[#0f2055] p-4 flex justify-between items-center">
                      <div>
                        <h4 className="font-extrabold text-sm tracking-widest text-white uppercase">{emomTitle}</h4>
                        <p className="text-[11px] text-zinc-300 mt-1 max-w-xs">{emomSubtitle}</p>
                      </div>
                      
                      {emomLevelLabel && (
                        <div className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${emomLevelClass === 'beginner' ? 'bg-[rgba(61,214,140,0.2)] text-[var(--green)] border-[rgba(61,214,140,0.3)]' : emomLevelClass === 'intermediate' ? 'bg-[rgba(245,200,66,0.2)] text-[var(--gold)] border-[rgba(245,200,66,0.3)]' : 'bg-[rgba(232,67,67,0.2)] text-[var(--red)] border-[rgba(232,67,67,0.3)]'}`}>
                          {emomLevelLabel}
                        </div>
                      )}
                    </div>

                    {/* Progress Fill */}
                    {emomCircuitType !== 'untimed' && (
                      <div className="h-[3px] bg-[var(--border)]">
                        <div 
                          className="h-full bg-gradient-to-r from-[var(--navy-light)] to-[var(--blue-light)] transition-all duration-1000 ease-linear"
                          style={{ width: `${(emomSecondsLeft / emomTotalSeconds) * 100}%` }}
                        ></div>
                      </div>
                    )}

                    {/* Clock display */}
                    <div className="p-6 text-center border-b border-[var(--border)]">
                      <div className="text-xs font-bold tracking-[2px] text-[var(--blue-light)] uppercase mb-1">
                        Round {emomRound} / {emomTotalRounds}
                      </div>
                      
                      <div className={`text-6xl font-black font-mono tracking-widest leading-none ${emomCircuitType === 'untimed' ? 'text-[var(--text)]' : emomSecondsLeft <= 5 ? 'text-[var(--red)] drop-shadow-[0_0_15px_rgba(232,67,67,0.4)]' : emomSecondsLeft <= 15 ? 'text-[var(--gold)]' : 'text-[var(--text)]'}`}>
                        {Math.floor(emomSecondsLeft / 60)}:{String(emomSecondsLeft % 60).padStart(2, '0')}
                      </div>
                    </div>

                    {/* Active exercise details */}
                    <div className="p-4 bg-[var(--card2)] border-b border-[var(--border)] text-center">
                      <span className="text-[10px] font-bold text-[var(--gray)] tracking-widest uppercase block mb-1">Active Set</span>
                      <h3 className="font-extrabold text-xl text-[var(--text)] font-sans uppercase">
                        {currentEx.name}
                      </h3>
                      <p className="text-sm font-bold text-[var(--blue-light)] mt-1.5">{currentEx.reps}</p>
                      
                      {emomRound < emomTotalRounds && nextEx && nextEx.name !== currentEx.name && (
                        <span className="block text-[11px] text-[var(--gray)] mt-3 leading-none italic">
                          ▶ Next Set: {nextEx.name}
                        </span>
                      )}
                    </div>

                    {/* Controls buttons row */}
                    <div className="flex items-center justify-center gap-4 py-4">
                      <button 
                        className="w-11 h-11 rounded-full bg-[var(--card2)] border border-[var(--border)] flex items-center justify-center text-lg hover:bg-[var(--border)] cursor-pointer active:scale-90 transition-all font-mono"
                        onClick={handleEmomReset}
                        title="Reset timer"
                      >
                        ↺
                      </button>

                      <button 
                        className="w-16 h-16 rounded-full bg-gradient-to-tr from-[var(--navy)] to-[var(--blue)] flex items-center justify-center text-2xl text-white shadow-lg shadow-[var(--blue-glow)] hover:scale-105 active:scale-95 cursor-pointer transition-all duration-150"
                        onClick={handleEmomToggle}
                      >
                        {emomIsRunning ? '⏸' : '▶'}
                      </button>

                      <button 
                        className="w-11 h-11 rounded-full bg-[var(--card2)] border border-[var(--border)] flex items-center justify-center text-lg hover:bg-[var(--border)] cursor-pointer active:scale-90 transition-all font-mono"
                        onClick={handleEmomSkip}
                        title="Skip to next round"
                      >
                        ⏭
                      </button>
                    </div>

                    {/* Status round dots wrapper */}
                    <div className="flex flex-wrap justify-center gap-1.5 px-4 pb-4 border-t border-[rgba(255,255,255,0.03)] pt-3.5">
                      {Array.from({ length: emomTotalRounds }).map((_, idx) => {
                        const roundNum = emomCircuitType === 'pyramid' ? emomTotalRounds - idx : idx + 1;
                        let dotClass = 'bg-[var(--border)] w-2 h-2';
                        
                        if (emomCircuitType === 'pyramid') {
                           if (roundNum > emomRound) dotClass = 'bg-[var(--blue-light)] w-2 h-2';
                           else if (roundNum === emomRound) dotClass = 'bg-[var(--green)] w-2.5 h-2.5 ring-2 ring-[rgba(61,214,140,0.4)] scale-110';
                        } else {
                           if (roundNum < emomRound) dotClass = 'bg-[var(--blue-light)] w-2 h-2';
                           else if (roundNum === emomRound) dotClass = 'bg-[var(--green)] w-2.5 h-2.5 ring-2 ring-[rgba(61,214,140,0.4)] scale-110';
                        }

                        return (
                          <div 
                            key={idx} 
                            className={`rounded-full transition-all duration-300 ${dotClass}`}
                            title={`Round ${roundNum}`}
                          ></div>
                        );
                      })}
                    </div>

                  </div>
                </div>

              </div>
            )}

          </div>
        )}

        {/* ── 4. PROGRESS REPORT PANEL (WITH VECTOR SVG CHARTS) ── */}
        {activePage === 'progress' && (
          <div className="animate-fade-in" id="page-progress">
            <div className="bg-gradient-to-b from-[rgba(27,58,122,0.13)] to-transparent p-4">
              <h1 className="font-extrabold text-2xl tracking-wide text-[var(--text)] uppercase leading-none">JOURNAL</h1>
              <p className="text-xs text-[var(--gray-light)] mt-1.5 m-0 p-0">Track your athletic metrics and personal notes</p>
              
              {/* KPIS ROW */}
              <div className="grid grid-cols-3 gap-2 mt-5">
                <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-3 text-center">
                  <div className="font-black text-2xl leading-none text-[var(--text)]">{totalJournalsCount}</div>
                  <div className="text-[10px] text-[var(--gray)] font-bold uppercase tracking-wider mt-1.5 leading-none">Total Journals</div>
                  <div className="text-[9px] text-[var(--gray)] font-semibold mt-1">all-time notes</div>
                </div>

                <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-3 text-center">
                  <div className="font-black text-2xl leading-none text-[var(--text)]">{thisWeekJournalsCount}</div>
                  <div className="text-[10px] text-[var(--gray)] font-bold uppercase tracking-wider mt-1.5 leading-none">This Week's</div>
                  <div className="text-[9px] text-[var(--blue-light)] font-semibold mt-1">added notes</div>
                </div>

                <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-3 text-center">
                  <div className="font-black text-2xl leading-none text-[var(--text)]">{sessionsLast7DaysCount}</div>
                  <div className="text-[10px] text-[var(--gray)] font-bold uppercase tracking-wider mt-1.5 leading-none">Last 7 Days</div>
                  <div className="text-[9px] text-[var(--green)] font-semibold mt-1">workouts done</div>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {/* TRIGGER CUSTOM LOGGER */}
              <button 
                className="w-full bg-gradient-to-tr from-[var(--navy)] to-[var(--blue)] hover:from-[var(--blue)] hover:to-[var(--navy-light)] rounded-xl py-4 font-extrabold text-xs text-white uppercase tracking-widest cursor-pointer active:scale-98 shadow-md"
                onClick={() => setIsLogWorkoutOpen(true)}
              >
                + LOG TRAINING SESSION
              </button>

              {/* GYM SESSIONS CALENDAR TRACKER */}
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 shadow-sm text-left">
                <div className="flex items-center justify-between mb-3.5 border-b border-[var(--border)] pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📅</span>
                    <div>
                      <h4 className="font-extrabold text-[11px] tracking-[1.5px] uppercase text-[var(--blue-light)] font-mono">Gym Session Tracker</h4>
                      <p className="text-[9px] text-[var(--gray)] font-mono uppercase tracking-wider mt-0.5">Track your training days overtime</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5 bg-[var(--card2)] border border-[var(--border)] p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => {
                        if (calendarMonth === 0) {
                          setCalendarMonth(11);
                          setCalendarYear(prev => prev - 1);
                        } else {
                          setCalendarMonth(prev => prev - 1);
                        }
                      }}
                      className="text-[10px] font-bold text-[var(--gray-light)] hover:text-white transition-colors cursor-pointer w-6 h-6 flex items-center justify-center rounded-lg bg-[var(--card)] border border-[var(--border)]"
                      title="Previous Month"
                    >
                      ◀
                    </button>
                    <span className="text-[9px] font-extrabold uppercase font-mono tracking-wider text-[var(--text)] px-1 whitespace-nowrap">
                      {new Date(calendarYear, calendarMonth).toLocaleString('default', { month: 'short', year: 'numeric' })}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (calendarMonth === 11) {
                          setCalendarMonth(0);
                          setCalendarYear(prev => prev + 1);
                        } else {
                          setCalendarMonth(prev => prev + 1);
                        }
                      }}
                      className="text-[10px] font-bold text-[var(--gray-light)] hover:text-white transition-colors cursor-pointer w-6 h-6 flex items-center justify-center rounded-lg bg-[var(--card)] border border-[var(--border)]"
                      title="Next Month"
                    >
                      ▶
                    </button>
                  </div>
                </div>

                {/* Quick metrics */}
                <div className="flex items-center justify-between text-[10px] bg-[rgba(255,255,255,0.01)] border border-[var(--border)] p-2 rounded-xl mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[9px] text-[var(--gray-light)] uppercase tracking-wider font-mono">
                      Active Sessions (this month): <strong className="text-emerald-400 font-extrabold">{
                        gymSessions.filter(date => {
                          const prefix = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}`;
                          return date.startsWith(prefix);
                        }).length
                      }</strong>
                    </span>
                  </div>
                  <span className="text-[8px] text-[var(--gray)] font-mono uppercase tracking-wider hidden sm:inline">
                    Tap cell to log/unlog
                  </span>
                </div>

                {/* Week Header */}
                <div className="grid grid-cols-7 gap-1 text-center mb-1">
                  {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((wd) => (
                    <span key={wd} className="text-[8px] font-mono font-black text-[var(--gray-light)] tracking-widest">
                      {wd}
                    </span>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {getCalendarDays(calendarYear, calendarMonth).map((cell, idx) => {
                    const isSession = gymSessions.includes(cell.dateStr);
                    const isCellToday = cell.dateStr === getTodayDateString();
                    
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => toggleGymSession(cell.dateStr)}
                        className={`relative aspect-square rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer text-[10px] font-bold select-none border ${
                          isSession 
                            ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30 font-extrabold' 
                            : 'bg-[var(--card2)] hover:bg-[var(--border)] text-[var(--text2)] border-[var(--border)]'
                        } ${!cell.isCurrentMonth ? 'opacity-25' : 'opacity-100'} ${
                          isCellToday 
                            ? 'border-emerald-500 border-2 shadow-[0_0_8px_rgba(16,185,129,0.4)] z-10' 
                            : ''
                        }`}
                      >
                        <span className="relative z-10 font-mono">{cell.dayNum}</span>
                        {isSession && (
                          <span className="absolute bottom-0.5 text-[7px] leading-none text-emerald-400 block select-none">
                            🏋️
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* VECTOR CHART A: WEEKLY SESSIONS BAR VECTOR */}
              <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-4 shadow-sm">
                <div className="text-[11px] font-bold tracking-[1.5px] uppercase text-[var(--gray-light)] mb-4 block">
                  📊 Weekly Training Session Counts
                </div>
                
                {/* SVG Bar Chart rendering */}
                <div className="w-full flex items-center justify-center">
                  <svg viewBox="0 0 350 120" className="w-full h-[120px]">
                    <g transform="translate(0, 10)">
                      {/* Grid Lines */}
                      <line x1="10" y1="80" x2="340" y2="80" stroke={isDark ? "#222" : "#e4e6eb"} strokeWidth="1" />
                      <line x1="10" y1="45" x2="340" y2="45" stroke={isDark ? "#222" : "#e4e6eb"} strokeWidth="1" />
                      <line x1="10" y1="10" x2="340" y2="10" stroke={isDark ? "#222" : "#e4e6eb"} strokeWidth="1" />
                      
                      {/* Bars dataset */}
                      {[
                        { day: 'Mon', val: 1 },
                        { day: 'Tue', val: 2 },
                        { day: 'Wed', val: 0 },
                        { day: 'Thu', val: 1 },
                        { day: 'Fri', val: 2 },
                        { day: 'Sat', val: 3 },
                        { day: 'Sun', val: 1 },
                      ].map((item, idx) => {
                        const barWidth = 24;
                        const xOffset = 25 + idx * 44;
                        const chartHeight = 80;
                        const maxVal = 3;
                        const height = (item.val / maxVal) * chartHeight;
                        const barY = chartHeight - height;

                        return (
                          <g key={idx} className="group">
                            {/* Bar gradient block */}
                            <defs>
                              <linearGradient id={`bar-grad-${idx}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#5A8DE8" />
                                <stop offset="100%" stopColor="#1B3A7A" />
                              </linearGradient>
                            </defs>
                            
                            {item.val > 0 && (
                              <rect 
                                x={xOffset} 
                                y={barY} 
                                width={barWidth} 
                                height={height} 
                                fill={`url(#bar-grad-${idx})`}
                                rx="3"
                                className="transition-all duration-300 hover:opacity-85"
                              />
                            )}

                            {/* Label text */}
                            <text 
                              x={xOffset + barWidth/2} 
                              y="96" 
                              fill={isDark ? "#777" : "#57606a"} 
                              fontSize="10" 
                              textAnchor="middle"
                              fontWeight="600"
                            >
                              {item.day}
                            </text>

                            {/* Value label */}
                            <text 
                              x={xOffset + barWidth/2} 
                              y={item.val > 0 ? barY - 4 : 74} 
                              fill={isDark ? "#ccc" : "#0d1117"} 
                              fontSize="10" 
                              textAnchor="middle" 
                              fontWeight="bold"
                            >
                              {item.val}
                            </text>
                          </g>
                        );
                      })}
                    </g>
                  </svg>
                </div>
              </div>



              {/* RECENT SESSION ENTRIES HISTORY LIST */}
              <div className="mt-4">
                <span className="text-[11px] font-bold tracking-[2.5px] uppercase text-[var(--gray-light)] block mb-3">
                  📋 Activity History Log
                </span>

                <div className="space-y-2.5">
                  {logs.slice(0, 3).map((log) => (
                    <div 
                      key={log.id} 
                      className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-3.5 flex items-center gap-3.5 shadow-sm"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[rgba(59,108,199,0.12)] border border-[rgba(59,108,199,0.25)] flex items-center justify-center text-xl shrink-0">
                        {log.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="font-extrabold text-sm text-[var(--text)] truncate leading-snug">{log.name}</div>
                        <div className="text-[11px] text-[var(--gray-light)] mt-0.5 font-medium">
                          {log.date} · {log.dur} mins {log.exercises ? `· ${log.exercises} exercises` : ''}
                        </div>
                        {log.notes && (
                          <div className="text-[11px] text-[var(--gray)] mt-1 truncate">
                            Note: {log.notes}
                          </div>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-lg font-black text-[var(--blue-light)] font-mono">{log.dur}m</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* JOURNAL ENTRIES SECTION */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold tracking-[2.5px] uppercase text-[var(--gray-light)] block">
                    📝 Personal Journal
                  </span>
                  <button 
                    className="bg-[var(--card)] hover:bg-[var(--card2)] text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-full border border-[var(--border)] transition-colors"
                    onClick={() => setIsJournalModalOpen(true)}
                  >
                    + New Note
                  </button>
                </div>

                <div className="space-y-3">
                  {journalEntries.length === 0 ? (
                    <div className="text-center p-6 border border-[var(--border)] rounded-2xl bg-[var(--card)] border-dashed text-[var(--gray-light)] text-sm">
                      No journal entries yet. Tap + New Note to start journaling.
                    </div>
                  ) : (
                    journalEntries.map(entry => (
                      <div key={entry.id} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 shadow-sm flex flex-col items-start text-left w-full relative">
                        <div className="font-extrabold text-sm mb-1">{entry.title}</div>
                        <div className="text-[10px] text-[var(--gray)] mb-2.5 font-medium">{new Date(entry.timestamp).toLocaleDateString()}</div>
                        <div className="text-xs text-[var(--text2)] leading-relaxed w-full whitespace-pre-wrap">
                          {entry.content}
                        </div>
                        <button
                          onClick={() => setJournalEntries(prev => prev.filter(e => e.id !== entry.id))}
                          className="absolute top-3 right-3 text-xs text-[var(--red)] font-bold uppercase tracking-widest opacity-80 hover:opacity-100"
                        >
                          Del
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ── 5. COMMUNITY FORUM CHAT/FEED ── */}
        {activePage === 'community' && (
          <div className="animate-fade-in" id="page-community">
            <div className="bg-gradient-to-b from-[rgba(27,58,122,0.13)] to-transparent px-4 pt-5 pb-3">
              {/* SEARCH INPUT BAR */}
              <div className="bg-[var(--input-bg)] border border-[var(--border)] rounded-xl flex items-center gap-2.5 px-3 py-2">
                <span className="text-sm">🔍</span>
                <input 
                  type="text" 
                  placeholder="Search athletes, exercises, or posts..." 
                  className="bg-transparent border-none outline-none text-sm text-[var(--text)] flex-1 min-w-0 font-sans"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button className="text-xs text-[var(--gray)]" onClick={() => setSearchQuery('')}>✕</button>
                )}
              </div>

              {/* TIMELINE CATEGORY TABS */}
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar pt-3">
                {['Trending', 'Recent', 'Workouts', 'PRs'].map(tab => (
                  <button 
                    key={tab}
                    className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer font-sans tracking-wide ${activeCommunityTab === tab ? 'bg-[var(--blue)] border-[var(--blue)] text-white' : 'bg-[var(--card)] border-[var(--border)] text-[var(--gray)]'}`}
                    onClick={() => setActiveCommunityTab(tab)}
                  >
                    {tab === 'Trending' ? '🔥 ' : tab === 'Recent' ? '🕐 ' : tab === 'Workouts' ? '💪 ' : '🏆 '}
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* ACTIONABLE FEED WRAP */}
            <div className="px-4 space-y-4">
              {/* MINI COMPOSE TRIGGER WIDGET */}
              <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-4 flex items-center gap-3.5 shadow-sm">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[var(--navy)] to-[var(--blue)] flex items-center justify-center font-bold text-xs text-white">
                  {currentInitials}
                </div>
                <div 
                  className="flex-1 bg-[var(--input-bg)] border border-[var(--border)] rounded-full px-4 py-2 text-xs text-[var(--gray-light)] font-medium cursor-pointer hover:border-[var(--blue-light)] transition-colors duration-150"
                  onClick={triggerPostModal}
                >
                  Tell the community something athletic...
                </div>
              </div>

              {/* DYNAMIC POST CARD FEED */}
              {filteredPosts.length > 0 ? (
                <div className="space-y-3.5">
                  {filteredPosts.map(post => {
                    const isCommentsListOpen = openComments[post.id] || false;
                    const commText = newCommentTexts[post.id] || '';

                    return (
                      <div key={post.id} className="bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden shadow-sm" id={`post-${post.id}`}>
                        {post.pinned && (
                          <div className="bg-[var(--navy)] text-[var(--blue-light)] text-[10px] uppercase font-bold px-4 py-1 flex items-center gap-1">
                            📌 Pinned Message
                          </div>
                        )}
                        {/* Upper Content */}
                        <div className="p-4">
                          <div className="flex items-center gap-3.5 mb-3">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-inner" style={{ background: post.avatarColor }}>
                              {post.initials}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-extrabold text-xs text-[var(--text)]">{post.author}</div>
                              <div className="text-[10px] text-[var(--gray)] font-medium mt-0.5">@{post.author.toLowerCase().replace(/\s/g,'')} · CaliMade</div>
                            </div>
                            <div className="text-[10px] text-[var(--gray)] font-medium self-start">{post.time}</div>
                          </div>

                          <div className="text-xs text-[var(--text2)] leading-relaxed tracking-wide mb-3">
                            {post.text}
                          </div>

                          {post.mediaUrl && (
                            <div className="mb-4">
                              {post.mediaType === 'image' && (
                                <div className="rounded-xl overflow-hidden border border-[var(--border)] max-h-[350px] bg-[var(--card2)] flex items-center justify-center">
                                  <img 
                                    src={post.mediaUrl} 
                                    alt="Post attachment" 
                                    className="w-full h-full object-contain max-h-[350px] block" 
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                              )}
                              {post.mediaType === 'video' && (
                                <div className="rounded-xl overflow-hidden border border-[var(--border)] max-h-[350px] bg-black flex items-center justify-center">
                                  <video 
                                    src={post.mediaUrl} 
                                    controls 
                                    className="w-full h-full max-h-[350px]"
                                  />
                                </div>
                              )}
                              {post.mediaType === 'file' && (
                                <a 
                                  href={post.mediaUrl} 
                                  download={post.mediaName || "attachment"}
                                  className="p-3 bg-[var(--card2)] hover:bg-[var(--card)] border border-[var(--border)] hover:border-[var(--blue-light)] rounded-xl flex items-center justify-between gap-3 text-left transition-all group cursor-pointer block"
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="w-10 h-10 rounded-lg bg-[var(--card)] flex items-center justify-center border border-[var(--border)] text-lg shrink-0">
                                      📄
                                    </div>
                                    <div className="min-w-0">
                                      <div className="text-xs font-bold truncate text-[var(--text)] group-hover:text-[var(--blue-light)] transition-colors">{post.mediaName || "attachment"}</div>
                                      <div className="text-[9px] text-[var(--gray)] uppercase tracking-wider font-semibold mt-0.5 font-mono">Attachment · click to save</div>
                                    </div>
                                  </div>
                                  <div className="text-[10px] text-[var(--gray-light)] font-bold uppercase tracking-wider bg-[var(--card)] border border-[var(--border)] px-2.5 py-1.5 rounded-lg group-hover:text-[var(--text)] group-hover:border-[var(--gray)] transition-colors whitespace-nowrap">
                                    DL File
                                  </div>
                                </a>
                              )}
                            </div>
                          )}

                          {/* Action Items Footer */}
                          <div className="flex items-center gap-1.5 pt-2 border-t border-[rgba(255,255,255,0.02)]">
                            <button 
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs cursor-pointer transition-all ${post.liked ? 'text-[var(--red)] border-[rgba(232,67,67,0.3)] bg-[rgba(232,67,67,0.05)]' : 'text-[var(--gray)] border-transparent hover:bg-[var(--card2)]'}`}
                              onClick={() => handleLikePost(post.id)}
                            >
                              ❤️ <span>{post.likes}</span>
                            </button>

                            <button 
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs cursor-pointer transition-all ${isCommentsListOpen ? 'text-[var(--blue-light)] border-[rgba(90,141,232,0.3)] bg-[rgba(90,141,232,0.05)]' : 'text-[var(--gray)] border-transparent hover:bg-[var(--card2)]'}`}
                              onClick={() => handleToggleComments(post.id)}
                            >
                              💬 <span>{post.comments?.length || 0} Comments</span>
                            </button>

                            {(profile?.name === '@Ajcali' || (user && post.authorId === user.uid)) && (
                              <>
                                <div className="flex-1"></div>
                                <button
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[var(--blue-light)] border-transparent hover:bg-[var(--card2)] text-xs cursor-pointer transition-all"
                                  onClick={() => handleEditPost(post)}
                                >
                                  ✏️ <span>Edit</span>
                                </button>
                                <button
                                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs cursor-pointer transition-all ${post.pinned ? 'text-[var(--blue-light)] border-[rgba(90,141,232,0.3)] bg-[rgba(90,141,232,0.05)]' : 'text-[var(--gray)] border-transparent hover:bg-[var(--card2)]'}`}
                                  onClick={() => handleTogglePin(post.id)}
                                >
                                  📌 <span>{post.pinned ? 'Unpin' : 'Pin'}</span>
                                </button>
                                <button
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[var(--red)] border-transparent hover:bg-[rgba(232,67,67,0.1)] text-xs cursor-pointer transition-all"
                                  onClick={() => handleDeletePost(post.id)}
                                >
                                  🗑️ <span>Delete</span>
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        {/* NESTED COMMENTS DRAWER */}
                        {isCommentsListOpen && (
                          <div className="border-t border-[var(--border)] bg-[var(--card2)] p-4 animate-fade-in">
                            <div className="space-y-3.5 max-h-[300px] overflow-y-auto no-scrollbar pr-1">
                              {post.comments.map(comment => {
                                const isRepliesOpen = openReplies[comment.id] || false;
                                const rText = newReplyTexts[comment.id] || '';

                                return (
                                  <div key={comment.id} className="text-xs" id={`comment-${comment.id}`}>
                                    <div className="flex gap-3 items-start">
                                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] text-white shrink-0" style={{ background: comment.avatarColor }}>
                                        {comment.initials}
                                      </div>
                                      <div className="flex-1">
                                        <div className="bg-[var(--card)] border border-[var(--border)] rounded-tr-xl rounded-b-xl p-3">
                                          <div className="font-extrabold text-[10px] text-[var(--text)] mb-0.5">{comment.author}</div>
                                          <div className="text-xs text-[var(--text2)] leading-relaxed">{comment.text}</div>
                                        </div>
                                        
                                        <div className="flex gap-4 mt-1.5 px-1.5 text-[10px] text-[var(--gray-light)]">
                                          <button 
                                            className={`font-semibold cursor-pointer ${comment.liked ? 'text-[var(--red)]' : ''}`}
                                            onClick={() => handleLikeComment(post.id, comment.id)}
                                          >
                                            ❤️ {comment.likes}
                                          </button>
                                          <button 
                                            className="font-semibold cursor-pointer"
                                            onClick={() => handleToggleReplies(comment.id)}
                                          >
                                            ↩ Reply {comment.replies.length > 0 ? `(${comment.replies.length})` : ''}
                                          </button>
                                        </div>
                                      </div>
                                    </div>

                                    {/* NESTED REPLIES */}
                                    {isRepliesOpen && (
                                      <div className="mt-3 pl-8 space-y-3 border-l border-[rgba(255,255,255,0.03)] animate-fade-in">
                                        {comment.replies.map(reply => (
                                          <div key={reply.id} className="flex gap-2.5 items-start">
                                            <div className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[8px] text-white shrink-0" style={{ background: reply.avatarColor }}>
                                              {reply.initials}
                                            </div>
                                            <div className="flex-1 bg-[var(--card)] border border-[var(--border)] rounded-tr-lg rounded-b-lg p-2.5">
                                              <div className="font-extrabold text-[9px] text-[var(--text)] mb-0.5">{reply.author}</div>
                                              <div className="text-xs text-[var(--text2)] leading-relaxed">{reply.text}</div>
                                              
                                              <div className="mt-1">
                                                <button 
                                                  className={`text-[9px] font-semibold cursor-pointer ${reply.liked ? 'text-[var(--red)]' : 'text-[var(--gray-light)]'}`}
                                                  onClick={() => handleLikeReply(post.id, comment.id, reply.id)}
                                                >
                                                  ❤️ {reply.likes}
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        ))}

                                        {/* Reply input field */}
                                        <div className="flex gap-2.5 items-center mt-2 pl-1">
                                          <input 
                                            className="flex-1 bg-[var(--card)] border border-[var(--border)] rounded-full px-3 py-1.5 text-xs text-[var(--text)] outline-none focus:border-[var(--blue-light)]"
                                            placeholder="Reply to this comment..."
                                            value={rText}
                                            onChange={(e) => setNewReplyTexts(prev => ({ ...prev, [comment.id]: e.target.value }))}
                                            onKeyDown={(e) => {
                                              if (e.key === 'Enter') handlePostReplySubmit(post.id, comment.id);
                                            }}
                                          />
                                          <button 
                                            className="w-7 h-7 rounded-full bg-[var(--blue)] flex items-center justify-center text-white shrink-0 active:scale-90 transition-transform"
                                            onClick={() => handlePostReplySubmit(post.id, comment.id)}
                                          >
                                            ↑
                                          </button>
                                        </div>

                                      </div>
                                    )}

                                  </div>
                                );
                              })}
                            </div>

                            {/* Comment Input Widget */}
                            <div className="flex gap-3 items-center mt-3 border-t border-[rgba(255,255,255,0.03)] pt-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--navy)] to-[var(--blue)] flex items-center justify-center font-bold text-xs text-white shrink-0">
                                {currentInitials}
                              </div>
                              <input 
                                type="text"
                                className="flex-1 bg-[var(--card)] border border-[var(--border)] rounded-full px-4 py-2 text-xs text-[var(--text)] outline-none focus:border-[var(--blue-light)]"
                                placeholder="Add an athletic comment..."
                                value={commText}
                                onChange={(e) => setNewCommentTexts(prev => ({ ...prev, [post.id]: e.target.value }))}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handlePostCommentSubmit(post.id);
                                }}
                              />
                              <button 
                                className="w-8 h-8 rounded-full bg-[var(--blue)] flex items-center justify-center text-white shrink-0 active:scale-90 transition-transform"
                                onClick={() => handlePostCommentSubmit(post.id)}
                              >
                                ↑
                              </button>
                            </div>
                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-20 text-center text-[var(--gray-light)]">
                  <div className="text-3xl mb-2">🔍</div>
                  <div className="text-xs">No community posts match your criteria. Just launch a conversation above!</div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ── 6. ATHLETE PROFILE SETTINGS PANEL ── */}
        {activePage === 'profile' && (
          <div className="animate-fade-in text-center" id="page-profile">
            {/* Header user overview */}
            <div className="relative overflow-hidden bg-gradient-to-b from-[rgba(27,58,122,0.14)] to-transparent px-4 py-8 flex flex-col items-center border-b border-[var(--border)]">
              {/* Theme Toggle placed prominently in Profile Header */}
              <button
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[var(--card)] border border-[var(--border)] flex items-center justify-center cursor-pointer text-base transition-colors duration-150 active:scale-95 shadow-sm"
                onClick={() => setIsDark(prev => !prev)}
                title="Toggle Theme"
              >
                {isDark ? '🌙' : '☀️'}
              </button>

              <div className="relative mb-3.5">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[var(--navy)] to-[var(--blue)] flex items-center justify-center font-bold text-4xl text-white border-4 border-[var(--blue)] shadow-xl shadow-[var(--blue-glow)]">
                  {currentInitials}
                </div>
                <div 
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[var(--blue)] border-2 border-[var(--bg)] flex items-center justify-center cursor-pointer text-sm shadow-md text-white active:scale-90 transition-transform"
                  onClick={handleEditProfileName}
                  title="Edit custom name"
                >
                  ✏️
                </div>
              </div>

              <h2 className="font-extrabold text-2xl text-[var(--text)] font-sans tracking-wide uppercase leading-none">
                {profile.name}
              </h2>
              <p className="text-xs text-[var(--gray-light)] mt-1.5">
                @{profile.name.toLowerCase().replace(/\s/g, '')} · CaliMade Athlete
              </p>

              <div className="inline-flex items-center gap-1.5 bg-[rgba(59,108,199,0.12)] border border-[rgba(59,108,199,0.3)] rounded-full px-3.5 py-1 text-xs text-[var(--blue-light)] font-bold mt-3">
                ⚡ Level 3 — {profile.level}
              </div>
            </div>

            {/* Quick stats grid */}
            <div className="flex border-b border-[var(--border)] bg-[var(--card2)]">
              <div className="flex-1 py-4 text-center border-r border-[var(--border)]">
                <div className="font-extrabold text-2xl text-[var(--text)] font-sans">{totalJournalsCount}</div>
                <div className="text-[10px] text-[var(--gray)] uppercase tracking-wider font-semibold mt-1">Total Journals</div>
              </div>
              <div className="flex-1 py-4 text-center border-r border-[var(--border)]">
                <div className="font-extrabold text-2xl text-[var(--text)] font-sans">{thisWeekJournalsCount}</div>
                <div className="text-[10px] text-[var(--gray)] uppercase tracking-wider font-semibold mt-1">This Week's</div>
              </div>
              <div className="flex-1 py-4 text-center">
                <div className="font-extrabold text-2xl text-[var(--text)] font-sans">{sessionsLast7DaysCount}</div>
                <div className="text-[10px] text-[var(--gray)] uppercase tracking-wider font-semibold mt-1">Last 7 Days</div>
              </div>
            </div>

            {/* Detailed profile properties */}
            <div className="px-4 py-5 text-left">
              <span className="text-[10px] font-bold tracking-[2.5px] uppercase text-[var(--gray-light)] block mb-3">
                Personal Athlete Profile
              </span>

              <div className="space-y-2">
                <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-3.5 flex justify-between items-center">
                  <span className="text-[10px] text-[var(--gray)] font-bold uppercase tracking-wider">Athlete Name</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[var(--text)]">{profile.name}</span>
                    <button className="text-[11px] text-[var(--blue-light)] font-semibold" onClick={handleEditProfileName}>✏️</button>
                  </div>
                </div>

                <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-3.5 flex justify-between items-center">
                  <span className="text-[10px] text-[var(--gray)] font-bold uppercase tracking-wider">Performance Level</span>
                  <span className="text-xs font-bold text-[var(--text)]">{profile.level}</span>
                </div>

                <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-3.5 flex justify-between items-center">
                  <span className="text-[10px] text-[var(--gray)] font-bold uppercase tracking-wider">Main Goals</span>
                  <span className="text-xs font-bold text-[var(--text)]">{profile.goal}</span>
                </div>

                <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-3.5 flex justify-between items-center">
                  <span className="text-[10px] text-[var(--gray)] font-bold uppercase tracking-wider">Member Since</span>
                  <span className="text-xs font-bold text-[var(--text)]">{profile.memberSince}</span>
                </div>
              </div>
            </div>

            {/* Achievement badges showcase */}
            <div className="px-4 pb-12 text-left">
              <span className="text-[10px] font-bold tracking-[2.5px] uppercase text-[var(--gray-light)] block mb-3">
                Earned Achievement Badges
              </span>

              <div className="flex flex-wrap gap-2.5 mb-8">
                <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-3.5 flex flex-col items-center text-center w-[100px] shrink-0">
                  <div className="text-2xl mb-1">🔥</div>
                  <span className="text-[10px] font-bold text-[var(--text)]">7-Day Streak</span>
                </div>
                <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-3.5 flex flex-col items-center text-center w-[100px] shrink-0">
                  <div className="text-2xl mb-1">💪</div>
                  <span className="text-[10px] font-bold text-[var(--text)]">First PR</span>
                </div>
                <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-3.5 flex flex-col items-center text-center w-[100px] shrink-0">
                  <div className="text-2xl mb-1">⚡</div>
                  <span className="text-[10px] font-bold text-[var(--text)]">EMOM Master</span>
                </div>
                <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-3.5 flex flex-col items-center text-center w-[100px] shrink-0">
                  <div className="text-2xl mb-1">🌎</div>
                  <span className="text-[10px] font-bold text-[var(--text)]">Community</span>
                </div>
                <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-3.5 flex flex-col items-center text-center w-[100px] shrink-0">
                  <div className="text-2xl mb-1">🏆</div>
                  <span className="text-[10px] font-bold text-[var(--text)]">30-Day Club</span>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  onClick={logOut}
                  className="w-full py-3.5 rounded-xl border border-[var(--red)] text-[var(--red)] font-bold text-xs uppercase tracking-[2px] active:scale-[0.98] transition-transform"
                >
                  Log Out
                </button>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* ── FOOTER TAB NAVIGATION BAR ── */}
      <nav className="h-[var(--nav-h)] bg-[var(--surface)] border-t border-[var(--border)] flex items-center justify-around fixed bottom-0 left-0 right-0 z-[110] px-3 pb-safe shadow-lg transition-colors">
        
        <button 
          className={`flex-1 flex flex-col items-center gap-1 py-1.5 cursor-pointer transition-all duration-150 ${activePage === 'home' ? 'text-[var(--blue)] scale-102 font-bold' : 'text-[var(--gray)]'}`}
          onClick={() => setActivePage('home')}
        >
          <div className="text-xl">🏠</div>
          <span className="text-[10px] tracking-wide uppercase font-sans font-bold">Home</span>
        </button>

        <button 
          className={`flex-1 flex flex-col items-center gap-1 py-1.5 cursor-pointer transition-all duration-150 ${activePage === 'workouts' ? 'text-[var(--blue)] scale-102 font-bold' : 'text-[var(--gray)]'}`}
          onClick={() => setActivePage('workouts')}
        >
          <div className="text-xl">⚡</div>
          <span className="text-[10px] tracking-wide uppercase font-sans font-bold">Training</span>
        </button>

        <button 
          className={`flex-1 flex flex-col items-center gap-1 py-1.5 cursor-pointer transition-all duration-150 ${activePage === 'progress' ? 'text-[var(--blue)] scale-102 font-bold' : 'text-[var(--gray)]'}`}
          onClick={() => setActivePage('progress')}
        >
          <div className="text-xl">📈</div>
          <span className="text-[10px] tracking-wide uppercase font-sans font-bold">Journal</span>
        </button>

        <button 
          className={`flex-1 flex flex-col items-center gap-1 py-1.5 cursor-pointer transition-all duration-150 ${activePage === 'community' ? 'text-[var(--blue)] scale-102 font-bold' : 'text-[var(--gray)]'}`}
          onClick={() => setActivePage('community')}
        >
          <div className="text-xl">🌎</div>
          <span className="text-[10px] tracking-wide uppercase font-sans font-bold">Feed</span>
        </button>

        <button 
          className={`flex-1 flex flex-col items-center gap-1 py-1.5 cursor-pointer transition-all duration-150 ${activePage === 'profile' ? 'text-[var(--blue)] scale-102 font-bold' : 'text-[var(--gray)]'}`}
          onClick={() => setActivePage('profile')}
        >
          <div className="text-xl">👤</div>
          <span className="text-[10px] tracking-wide uppercase font-sans font-bold">Profile</span>
        </button>

      </nav>

      {/* ── MODAL COVERS ── */}

      {/* MODAL A: NEW SOCIAL WRITTEN POST */}
      {isWritePostOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-[2px] z-[200] flex items-end justify-center">
          <div className="bg-[var(--surface)] border-t border-x border-[var(--border)] rounded-t-3xl w-full max-w-xl p-5 animate-slide-up pb-7 shadow-2xl">
            <div className="w-10 h-1 bg-[var(--border)] rounded-full mx-auto mb-4"></div>
            <h3 className="font-extrabold text-[17px] tracking-widest text-[var(--text)] uppercase mb-3 text-center">
              CREATE COMMunity Post
            </h3>
            
            <textarea 
              className="w-full min-h-[120px] max-h-[220px] bg-[var(--input-bg)] border border-[var(--border)] rounded-xl p-3 text-xs text-[var(--text)] outline-none line-height-relaxed resize-none focus:border-[var(--blue-light)]"
              placeholder="Tell other athletes about your workouts or consistency gains..."
              value={postComposeText}
              onChange={(e) => setPostComposeText(e.target.value)}
            ></textarea>

            {/* Attachment preview */}
            {attachedFile && (
              <div className="mt-3 p-3 bg-[var(--card2)] border border-[var(--border)] rounded-xl flex items-center justify-between gap-3 animate-fade-in text-left">
                <div className="flex items-center gap-2.5 min-w-0">
                  {attachedFile.type === 'image' && (
                    <img 
                      src={attachedFile.url} 
                      alt="Attachment preview" 
                      className="w-12 h-12 rounded-lg object-cover border border-[var(--border)] shrink-0" 
                      referrerPolicy="no-referrer"
                    />
                  )}
                  {attachedFile.type === 'video' && (
                    <div className="w-12 h-12 rounded-lg bg-[var(--navy)] flex items-center justify-center shrink-0 border border-[var(--border)] text-lg">
                      🎥
                    </div>
                  )}
                  {attachedFile.type === 'file' && (
                    <div className="w-12 h-12 rounded-lg bg-[var(--card)] flex items-center justify-center shrink-0 border border-[var(--border)] text-lg">
                      📄
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate text-[var(--text)]">{attachedFile.name}</div>
                    <div className="text-[10px] text-[var(--gray)] uppercase tracking-wider font-semibold mt-0.5">{attachedFile.type} media</div>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => setAttachedFile(null)} 
                  className="w-7 h-7 rounded-full bg-[rgba(232,67,67,0.1)] text-[var(--red)] border border-transparent flex items-center justify-center text-xs hover:border-[rgba(232,67,67,0.3)] transition-all cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Media Upload Actions Row */}
            <div className="mt-3 flex items-center gap-2">
              <label className="flex-1 bg-[var(--card)] hover:bg-[var(--card2)] border border-[var(--border)] hover:border-[var(--blue-light)] rounded-xl py-2.5 px-4 flex items-center justify-center gap-2 cursor-pointer transition-all">
                <span className="text-sm">📁</span>
                <span className="text-xs font-bold text-[var(--gray-light)] uppercase tracking-wider">Attach Media / File</span>
                <input 
                  type="file" 
                  accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.txt" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
              </label>
            </div>

            <button 
              className="w-full py-3.5 bg-gradient-to-r from-[var(--navy)] to-[var(--blue)] rounded-xl font-bold text-sm tracking-widest uppercase text-white mt-4 cursor-pointer active:scale-98 shadow-md"
              onClick={handlePublishPost}
            >
              PUBLISH ATHLETE POST
            </button>
            
            <button 
              className="w-full py-3 bg-transparent border border-[var(--border)] rounded-xl font-semibold text-xs tracking-wider text-[var(--gray-light)] mt-2 cursor-pointer"
              onClick={() => setIsWritePostOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* MODAL B: LOG CUSTOM FITNESS SESSION */}
      {isLogWorkoutOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-[2px] z-[200] flex items-end justify-center">
          <div className="bg-[var(--surface)] border-t border-x border-[var(--border)] rounded-t-3xl w-full max-w-xl p-5 animate-slide-up pb-7 shadow-2xl">
            <div className="w-10 h-1 bg-[var(--border)] rounded-full mx-auto mb-4"></div>
            <h3 className="font-extrabold text-[17px] tracking-widest text-[var(--text)] uppercase mb-4 text-center">
              LOG PERSONAL SESSION
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-[var(--gray)] uppercase tracking-wider block mb-1">Workout Label name</label>
                <input 
                  type="text" 
                  className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-xl p-3 text-xs text-[var(--text)] outline-none focus:border-[var(--blue-light)]"
                  placeholder="e.g. 20-Min Compound EMOM"
                  value={logWorkoutName}
                  onChange={(e) => setLogWorkoutName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[10px] font-bold text-[var(--gray)] uppercase tracking-wider block mb-1">Duration (minutes)</label>
                  <input 
                    type="number" 
                    className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-xl p-3 text-xs text-[var(--text)] outline-none focus:border-[var(--blue-light)]"
                    placeholder="25"
                    value={logDuration}
                    onChange={(e) => setLogDuration(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[var(--gray)] uppercase tracking-wider block mb-1">Active Exercises</label>
                  <input 
                    type="number" 
                    className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-xl p-3 text-xs text-[var(--text)] outline-none focus:border-[var(--blue-light)]"
                    placeholder="6"
                    value={logExercisesCount}
                    onChange={(e) => setLogExercisesCount(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-[var(--gray)] uppercase tracking-wider block mb-1">Private Session Notes (optional)</label>
                <input 
                  type="text" 
                  className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-xl p-3 text-xs text-[var(--text)] outline-none focus:border-[var(--blue-light)]"
                  placeholder="Felt absolute core power today, beat Monday PR!"
                  value={logNotes}
                  onChange={(e) => setLogNotes(e.target.value)}
                />
              </div>
            </div>

            <button 
              className="w-full py-3.5 bg-gradient-to-r from-[var(--navy)] to-[var(--blue)] rounded-xl font-bold text-sm tracking-widest uppercase text-white mt-5 cursor-pointer active:scale-98 shadow-md"
              onClick={handleSaveLoggedWorkout}
            >
              SAVE FITNESS RECORD
            </button>
            
            <button 
              className="w-full py-3 bg-transparent border border-[var(--border)] rounded-xl font-semibold text-xs tracking-wider text-[var(--gray-light)] mt-2 cursor-pointer"
              onClick={() => setIsLogWorkoutOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* MODAL C: CREATE JOURNAL ENTRY */}
      {isJournalModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-[2px] z-[200] flex items-end justify-center">
          <div className="bg-[var(--surface)] border-t border-x border-[var(--border)] rounded-t-3xl w-full max-w-lg p-5 animate-slide-up pb-7 shadow-2xl">
            <div className="w-10 h-1 bg-[var(--border)] rounded-full mx-auto mb-4"></div>
            <h3 className="font-extrabold text-[17px] tracking-widest text-[var(--text)] uppercase mb-4 text-center">
              NEW JOURNAL NOTE
            </h3>
            
            <div className="space-y-3.5 mb-5">
              <input 
                type="text" 
                placeholder="Title (e.g., Felt strong today)" 
                className="w-full bg-[var(--input-bg)] border border-[var(--border)] outline-none rounded-xl text-sm p-3.5 text-[var(--text)] font-sans"
                value={journalTitle}
                onChange={e => setJournalTitle(e.target.value)}
              />
              <textarea 
                placeholder="Write your personal note here..." 
                className="w-full bg-[var(--input-bg)] border border-[var(--border)] outline-none rounded-xl text-sm p-3.5 text-[var(--text)] min-h-[140px] resize-none font-sans"
                value={journalContent}
                onChange={e => setJournalContent(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <button 
                className="flex-1 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--card2)] py-3.5 text-xs font-bold uppercase tracking-widest text-[var(--gray)] transition-colors"
                onClick={() => setIsJournalModalOpen(false)}
              >
                CANCEL
              </button>
              <button 
                className="flex-1 rounded-xl bg-gradient-to-tr from-[var(--navy)] to-[var(--blue)] py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-md active:scale-98 transition-transform"
                onClick={handleSaveJournalEntry}
              >
                SAVE NOTE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ACTIVE PROMPT MODAL ── */}
      {activePrompt && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-[var(--surface)] w-full max-w-sm rounded-[24px] border border-[var(--border)] p-6 shadow-2xl animate-fade-in flex flex-col">
            <h3 className="text-xl font-black tracking-tight text-[var(--text)] mb-6 uppercase">{activePrompt.title}</h3>
            <div className="space-y-5">
              {activePrompt.fields.map(f => (
                <div key={f.id}>
                  <label className="text-[10px] uppercase font-bold text-[var(--gray-light)] tracking-[2px] mb-2 block">{f.label}</label>
                  {f.type === 'select' ? (
                    <select
                      id={`prompt-field-${f.id}`}
                      defaultValue={f.defaultValue}
                      className="w-full bg-[var(--card2)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm font-semibold text-[var(--text)] outline-none focus:border-[var(--blue)] transition-colors appearance-none"
                    >
                      {f.options?.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  ) : (
                    <input 
                      id={`prompt-field-${f.id}`}
                      defaultValue={f.defaultValue}
                      className="w-full bg-[var(--card2)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm font-semibold text-[var(--text)] outline-none focus:border-[var(--blue)] transition-colors"
                      autoFocus={activePrompt.fields[0].id === f.id}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 mt-8">
              <button 
                onClick={activePrompt.onCancel}
                className="flex-1 py-3.5 rounded-xl border border-[var(--border)] font-bold text-xs uppercase tracking-widest text-[var(--text)] hover:bg-[var(--card)] transition-colors"
                id="prompt-cancel-btn"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  const vals: Record<string, string> = {};
                  activePrompt.fields.forEach(f => {
                    const el = document.getElementById(`prompt-field-${f.id}`) as HTMLInputElement;
                    vals[f.id] = el ? el.value : '';
                  });
                  activePrompt.onConfirm(vals);
                  setActivePrompt(null);
                }}
                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[var(--navy)] to-[var(--blue)] font-bold text-xs uppercase tracking-widest text-white shadow-md active:scale-95 transition-transform"
                id="prompt-confirm-btn"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CUSTOM ADD WORKOUT SELECTOR MODAL ── */}
      {addWorkoutDayIdx !== null && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/75 p-4 backdrop-blur-[2px]">
          <div className="bg-[var(--surface)] w-full max-w-md rounded-[28px] border border-[var(--border)] p-6 shadow-2xl animate-fade-in flex flex-col max-h-[85vh] text-left">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-[var(--border)] shrink-0">
              <div>
                <span className="text-[9px] font-mono tracking-widest uppercase text-[var(--blue-light)] font-bold">Add Prescription to</span>
                <h3 className="font-extrabold text-base text-[var(--text)] uppercase tracking-tight">
                  {userRoutine[addWorkoutDayIdx]?.day}'s Routine
                </h3>
              </div>
              <button 
                onClick={() => setAddWorkoutDayIdx(null)}
                className="w-7 h-7 rounded-full bg-[var(--card)] hover:bg-[rgba(255,255,255,0.05)] border border-[var(--border)] flex items-center justify-center text-[var(--text)] font-mono transition-all text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Primary Tabs Row */}
            <div className="flex gap-1 bg-[var(--card2)] p-1 rounded-xl border border-[var(--border)] mb-4 shrink-0">
              <button
                type="button"
                onClick={() => setAddWorkoutMainTab('blank')}
                className={`flex-1 py-2 px-3 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all text-center whitespace-nowrap cursor-pointer ${
                  addWorkoutMainTab === 'blank' ? 'bg-[var(--blue)] text-white shadow-sm' : 'text-[var(--gray-light)] hover:text-white'
                }`}
              >
                New Routine
              </button>
              <button
                type="button"
                onClick={() => {
                  setAddWorkoutMainTab('prebuilt');
                  setAddWorkoutSecondaryTab('custom-routines');
                }}
                className={`flex-1 py-2 px-3 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all text-center whitespace-nowrap cursor-pointer ${
                  addWorkoutMainTab === 'prebuilt' ? 'bg-[var(--blue)] text-white shadow-sm' : 'text-[var(--gray-light)] hover:text-white'
                }`}
              >
                Pre-Built Routines
              </button>
            </div>

            {/* Second-level choices when Prebuilt Routines is active */}
            {addWorkoutMainTab === 'prebuilt' && (
              <div className="flex gap-1 bg-[var(--card2)] p-1 rounded-xl border border-[var(--border)] mb-4 shrink-0">
                <button
                  type="button"
                  onClick={() => setAddWorkoutSecondaryTab('custom-routines')}
                  className={`flex-1 py-1.5 px-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all text-center whitespace-nowrap cursor-pointer ${
                    addWorkoutSecondaryTab === 'custom-routines' ? 'bg-[var(--blue)] text-white shadow-sm' : 'text-[var(--gray-light)] hover:text-white'
                  }`}
                >
                  My Custom Routines
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAddWorkoutSecondaryTab('prebuilt-presets');
                    setPrebuiltActiveLevel('small');
                  }}
                  className={`flex-1 py-1.5 px-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all text-center whitespace-nowrap cursor-pointer ${
                    addWorkoutSecondaryTab === 'prebuilt-presets' ? 'bg-[var(--blue)] text-white shadow-sm' : 'text-[var(--gray-light)] hover:text-white'
                  }`}
                >
                  Pre-Built Routines
                </button>
              </div>
            )}

            {/* Third-level level filter when Prebuilt Presets is selected */}
            {addWorkoutMainTab === 'prebuilt' && addWorkoutSecondaryTab === 'prebuilt-presets' && (
              <div className="flex gap-1 p-0.5 rounded-lg bg-[var(--card)] border border-[var(--border)] mb-4 overflow-x-auto shrink-0 scrollbar-none">
                <button
                  type="button"
                  onClick={() => setPrebuiltActiveLevel('small')}
                  className={`flex-1 py-1 px-2.5 text-[8px] font-black uppercase tracking-widest rounded transition-all text-center whitespace-nowrap cursor-pointer ${
                    prebuiltActiveLevel === 'small' ? 'bg-emerald-950/40 text-emerald-400 font-extrabold' : 'text-[var(--gray-light)] hover:text-white'
                  }`}
                >
                  🟢 Small Sweat
                </button>
                <button
                  type="button"
                  onClick={() => setPrebuiltActiveLevel('medium')}
                  className={`flex-1 py-1 px-2.5 text-[8px] font-black uppercase tracking-widest rounded transition-all text-center whitespace-nowrap cursor-pointer ${
                    prebuiltActiveLevel === 'medium' ? 'bg-amber-950/40 text-amber-400 font-extrabold' : 'text-[var(--gray-light)] hover:text-white'
                  }`}
                >
                  🟡 Medium Heat
                </button>
                <button
                  type="button"
                  onClick={() => setPrebuiltActiveLevel('hardcore')}
                  className={`flex-1 py-1 px-2.5 text-[8px] font-black uppercase tracking-widest rounded transition-all text-center whitespace-nowrap cursor-pointer ${
                    prebuiltActiveLevel === 'hardcore' ? 'bg-rose-950/40 text-rose-400 font-extrabold' : 'text-[var(--gray-light)] hover:text-white'
                  }`}
                >
                  🔴 Hardcore
                </button>
              </div>
            )}

            {/* Scrollable contents depending on tab */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-3 min-h-[240px]">
              
              {/* TAB CONTENT: BLANK SESSION BUILDER & QUICK CUSTOM */}
              {addWorkoutMainTab === 'blank' && (
                <div className="space-y-4 pt-1">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[var(--gray-light)] tracking-[2px] mb-2 block">Workout Name</label>
                    <input 
                      value={customWorkoutName}
                      onChange={(e) => setCustomWorkoutName(e.target.value)}
                      placeholder="e.g. Weightless Pull-Up Mastery, Handstand Skill Workout"
                      className="w-full bg-[var(--card2)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm font-semibold text-[var(--text)] outline-none focus:border-[var(--blue)] transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-[var(--gray-light)] tracking-[2px] mb-2 block">Focus Class</label>
                      <select
                        value={customWorkoutFocus}
                        onChange={(e) => setCustomWorkoutFocus(e.target.value)}
                        className="w-full bg-[var(--card2)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm font-semibold text-[var(--text)] outline-none focus:border-[var(--blue)] transition-colors appearance-none"
                      >
                        <option value="Strength">Strength</option>
                        <option value="Recovery">Recovery</option>
                        <option value="Endurance">Endurance</option>
                        <option value="Skills">Skills</option>
                        <option value="Legs">Legs</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold text-[var(--gray-light)] tracking-[2px] mb-2 block">Duration</label>
                      <input 
                        value={customWorkoutDuration}
                        onChange={(e) => setCustomWorkoutDuration(e.target.value)}
                        placeholder="e.g. 25 min"
                        className="w-full bg-[var(--card2)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm font-semibold text-[var(--text)] outline-none focus:border-[var(--blue)] transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleConfirmCustomWorkout}
                    disabled={!customWorkoutName.trim()}
                    className="w-full mt-4 py-3.5 bg-gradient-to-r from-[var(--navy)] to-[var(--blue)] disabled:opacity-50 text-white font-extrabold text-[11px] uppercase tracking-widest rounded-xl shadow-md transition-all active:scale-98 cursor-pointer"
                  >
                    ✨ Add Blank Workout to {userRoutine[addWorkoutDayIdx]?.short}
                  </button>
                </div>
              )}

              {/* TAB CONTENT: MY CUSTOM ROUTINES */}
              {addWorkoutMainTab === 'prebuilt' && addWorkoutSecondaryTab === 'custom-routines' && (
                <div className="space-y-2 pt-1 pb-2">
                  {myCircuits.length === 0 ? (
                    <div className="text-center py-10 bg-[var(--card2)] border border-[var(--border)] rounded-2xl text-xs text-[var(--gray-light)] space-y-1 my-2">
                      <p className="font-bold text-[var(--text)]">No Custom Circuits Found</p>
                      <p className="text-[10px] text-[var(--gray)] px-4">Design dynamic circuits in the "Circuits" tab first to see them available here!</p>
                    </div>
                  ) : (
                    myCircuits.map((p, idx) => (
                      <div key={idx} className="bg-[var(--card)] hover:bg-[rgba(255,255,255,0.02)] border border-[var(--border)] p-3.5 rounded-xl flex items-center justify-between group transition-all duration-150">
                        <div className="pr-4 flex-1 min-w-0 text-left">
                          <span className="inline-block text-[8px] font-bold uppercase tracking-wider bg-purple-950/20 text-purple-400 border border-purple-500/10 rounded px-1.5 py-0.5 mb-1.5 leading-none font-mono">
                            {p.circuitType || 'EMOM'}
                          </span>
                          <h4 className="font-bold text-xs text-[var(--text)] truncate leading-tight">{p.name}</h4>
                          <p className="text-[11px] text-[var(--gray-light)] truncate mt-1 leading-normal">{p.desc}</p>
                          <p className="text-[9px] text-[var(--gray)] mt-0.5 font-mono">{p.exercises?.length || 0} exercises nested</p>
                        </div>
                        <button
                          onClick={() => handleDropInCircuit(addWorkoutDayIdx, p)}
                          className="px-3 py-1.5 font-bold text-[10px] uppercase tracking-wider bg-[var(--blue)] text-white hover:bg-[var(--blue-light)] active:scale-95 transition-all rounded-lg shrink-0 cursor-pointer shadow-sm"
                        >
                          + ADD
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB CONTENT: PRE-BUILT -> SMALL SWEAT */}
              {addWorkoutMainTab === 'prebuilt' && addWorkoutSecondaryTab === 'prebuilt-presets' && prebuiltActiveLevel === 'small' && (
                <div className="space-y-2 pt-1 pb-2 font-sans">
                  {CIRCUITS.smallSweat.plans.map((p, idx) => (
                    <div key={idx} className="bg-[var(--card)] hover:bg-[rgba(255,255,255,0.02)] border border-[var(--border)] p-3.5 rounded-xl flex items-center justify-between group transition-all duration-150">
                      <div className="pr-4 flex-1 min-w-0 text-left">
                        <span className="inline-block text-[8px] font-bold uppercase tracking-wider bg-emerald-950/20 text-emerald-400 border border-emerald-500/10 rounded px-1.5 py-0.5 mb-1.5 leading-none">
                          Beginner
                        </span>
                        <h4 className="font-bold text-xs text-[var(--text)] truncate leading-tight">{p.name}</h4>
                        <p className="text-[11px] text-[var(--gray-light)] truncate mt-1 leading-normal">{p.desc}</p>
                        <p className="text-[9px] text-[var(--gray)] mt-0.5">{p.exercises?.length || 0} exercises listed</p>
                      </div>
                      <button
                        onClick={() => handleDropInCircuit(addWorkoutDayIdx, p)}
                        className="px-3 py-1.5 font-bold text-[10px] uppercase tracking-wider bg-[var(--blue)] text-white hover:bg-[var(--blue-light)] active:scale-95 transition-all rounded-lg shrink-0 cursor-pointer shadow-sm"
                      >
                        + ADD
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB CONTENT: PRE-BUILT -> MEDIUM HEAT */}
              {addWorkoutMainTab === 'prebuilt' && addWorkoutSecondaryTab === 'prebuilt-presets' && prebuiltActiveLevel === 'medium' && (
                <div className="space-y-2 pt-1 pb-2 font-sans">
                  {CIRCUITS.mediumHeat.plans.map((p, idx) => (
                    <div key={idx} className="bg-[var(--card)] hover:bg-[rgba(255,255,255,0.02)] border border-[var(--border)] p-3.5 rounded-xl flex items-center justify-between group transition-all duration-150">
                      <div className="pr-4 flex-1 min-w-0 text-left">
                        <span className="inline-block text-[8px] font-bold uppercase tracking-wider bg-amber-950/20 text-amber-400 border border-amber-500/10 rounded px-1.5 py-0.5 mb-1.5 leading-none">
                          Intermediate
                        </span>
                        <h4 className="font-bold text-xs text-[var(--text)] truncate leading-tight">{p.name}</h4>
                        <p className="text-[11px] text-[var(--gray-light)] truncate mt-1 leading-normal">{p.desc}</p>
                        <p className="text-[9px] text-[var(--gray)] mt-0.5 font-mono">{p.exercises?.length || 0} exercises listed</p>
                      </div>
                      <button
                        onClick={() => handleDropInCircuit(addWorkoutDayIdx, p)}
                        className="px-3 py-1.5 font-bold text-[10px] uppercase tracking-wider bg-[var(--blue)] text-white hover:bg-[var(--blue-light)] active:scale-95 transition-all rounded-lg shrink-0 cursor-pointer shadow-sm font-sans"
                      >
                        + ADD
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB CONTENT: PRE-BUILT -> HARDCORE */}
              {addWorkoutMainTab === 'prebuilt' && addWorkoutSecondaryTab === 'prebuilt-presets' && prebuiltActiveLevel === 'hardcore' && (
                <div className="space-y-2 pt-1 pb-2 font-sans">
                  {CIRCUITS.hardcore.plans.map((p, idx) => (
                    <div key={idx} className="bg-[var(--card)] hover:bg-[rgba(255,255,255,0.02)] border border-[var(--border)] p-3.5 rounded-xl flex items-center justify-between group transition-all duration-150">
                      <div className="pr-4 flex-1 min-w-0 text-left">
                        <span className="inline-block text-[8px] font-bold uppercase tracking-wider bg-rose-950/20 text-rose-400 border border-rose-500/10 rounded px-1.5 py-0.5 mb-1.5 leading-none">
                          Advanced
                        </span>
                        <h4 className="font-bold text-xs text-[var(--text)] truncate leading-tight">{p.name}</h4>
                        <p className="text-[11px] text-[var(--gray-light)] truncate mt-1 leading-normal">{p.desc}</p>
                        <p className="text-[9px] text-[var(--gray)] mt-0.5">{p.exercises?.length || 0} exercises listed</p>
                      </div>
                      <button
                        onClick={() => handleDropInCircuit(addWorkoutDayIdx, p)}
                        className="px-3 py-1.5 font-bold text-[10px] uppercase tracking-wider bg-[var(--blue)] text-white hover:bg-[var(--blue-light)] active:scale-95 transition-all rounded-lg shrink-0 cursor-pointer shadow-sm font-sans"
                      >
                        + ADD
                      </button>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* ── ONBOARDING SURVEY MODAL ── */}
      {isSurveyOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-[3px] z-[500] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[28px] w-full max-w-lg p-6 shadow-2xl animate-fade-in text-left flex flex-col relative my-8">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-[var(--blue-light)] font-bold">ATHLETE ONBOARDING</span>
                <h3 className="font-extrabold text-lg text-[var(--text)] uppercase tracking-tight">ATHLETE METRIC PLANNER</h3>
              </div>
              {hasCompletedSurvey ? (
                <button 
                  onClick={() => setIsSurveyOpen(false)}
                  className="w-8 h-8 rounded-full bg-[var(--card)] hover:bg-[var(--card2)] border border-[var(--border)] flex items-center justify-center text-[var(--text)] hover:text-red-400 font-mono transition-all text-xs cursor-pointer"
                  title="Close survey"
                >
                  ✕
                </button>
              ) : (
                <span className="text-[10px] font-black tracking-widest uppercase bg-red-950/40 border border-red-500/20 text-red-400 px-3 py-1.5 rounded-xl font-mono shadow-inner select-none flex items-center gap-1.5">
                  <span className="relative flex h-1.5 w-1.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                  </span>
                  Required
                </span>
              )}
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-[10px] font-mono font-bold text-[var(--gray-light)] tracking-wide mb-1.5">
                <span>STEP {surveyStep} OF 4</span>
                <span>{Math.round((surveyStep / 4) * 100)}% COMPLETE</span>
              </div>
              <div className="w-full bg-[var(--border)] h-1.5 rounded-full overflow-hidden flex">
                <div 
                  className="bg-gradient-to-r from-[var(--navy)] to-[var(--blue)] h-full transition-all duration-300"
                  style={{ width: `${(surveyStep / 4) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Step Contents */}
            <div className="flex-1 min-h-[300px]">
              
              {/* STEP 1: GOALS & FOCUS SKILLS */}
              {surveyStep === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <h4 className="font-bold text-sm text-[var(--text)] mb-1">What is your primary training priority?</h4>
                    <p className="text-[11px] text-[var(--gray-light)] mb-3">Select your training priorities (multi-choice)</p>
                    
                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { id: "endurance", label: "🏃 Endurance", desc: "Build muscular stamina" },
                        { id: "strength", label: "💪 Strength", desc: "Develop force and power" },
                        { id: "cardio", label: "🔥 Cardio", desc: "Burn calories & optimize condition" },
                        { id: "skills", label: "⚡ Skills", desc: "Unlock static and dynamic moves" },
                        { id: "aesthetic", label: "✨ Aesthetic", desc: "Sculpt a lean athletic physique" }
                      ].map(g => {
                        const isSelected = surveyGoals.includes(g.id);
                        return (
                          <button
                            key={g.id}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setSurveyGoals(surveyGoals.filter(item => item !== g.id));
                              } else {
                                setSurveyGoals([...surveyGoals, g.id]);
                              }
                            }}
                            className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                              isSelected 
                                ? 'bg-[var(--blue)] border-transparent text-white shadow-md font-bold' 
                                : 'bg-[var(--card)] border-[var(--border)] hover:border-[var(--blue)]'
                            }`}
                          >
                            <div className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-[var(--text)]'}`}>{g.label}</div>
                            <div className={`text-[9px] mt-0.5 leading-none ${isSelected ? 'text-blue-100' : 'text-[var(--gray-light)]'}`}>{g.desc}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-4 pt-1">
                    <div>
                      <h4 className="font-bold text-sm text-[var(--text)] mb-1">👍 Strongest Muscle Groups</h4>
                      <p className="text-[11px] text-[var(--gray-light)] mb-2">Select your strongest muscle groups (multi-choice)</p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Chest",
                          "Back",
                          "Shoulders",
                          "Core/ Abs",
                          "Legs",
                          "Biceps",
                          "Triceps"
                        ].map(mg => {
                          const isSelected = surveyStrongestMuscles.includes(mg);
                          return (
                            <button
                              key={mg}
                              type="button"
                              onClick={() => {
                                if (isSelected) {
                                  setSurveyStrongestMuscles(surveyStrongestMuscles.filter(item => item !== mg));
                                } else {
                                  // Mutual exclusion: deselect from weakest
                                  setSurveyWeakestMuscles(prev => prev.filter(item => item !== mg));
                                  setSurveyStrongestMuscles([...surveyStrongestMuscles, mg]);
                                }
                                if (generationError && generationError.includes("strongest")) {
                                  setGenerationError(null);
                                }
                              }}
                              className={`px-3 py-1.5 rounded-full border text-[11px] font-semibold cursor-pointer transition-all ${
                                isSelected 
                                  ? 'bg-[var(--blue)] border-transparent text-white shadow-md font-bold' 
                                  : 'bg-[var(--card2)] border-[var(--border)] text-[var(--gray-light)] hover:text-white hover:border-[var(--gray)]'
                              }`}
                            >
                              {mg}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-[var(--text)] mb-1">👎 Weakest Muscle Groups</h4>
                      <p className="text-[11px] text-[var(--gray-light)] mb-2">Select your weakest muscle groups (multi-choice)</p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Chest",
                          "Back",
                          "Shoulders",
                          "Core/ Abs",
                          "Legs",
                          "Biceps",
                          "Triceps"
                        ].map(mg => {
                          const isSelected = surveyWeakestMuscles.includes(mg);
                          return (
                            <button
                              key={mg}
                              type="button"
                              onClick={() => {
                                if (isSelected) {
                                  setSurveyWeakestMuscles(surveyWeakestMuscles.filter(item => item !== mg));
                                } else {
                                  // Mutual exclusion: deselect from strongest
                                  setSurveyStrongestMuscles(prev => prev.filter(item => item !== mg));
                                  setSurveyWeakestMuscles([...surveyWeakestMuscles, mg]);
                                }
                                if (generationError && generationError.includes("weakest")) {
                                  setGenerationError(null);
                                }
                              }}
                              className={`px-3 py-1.5 rounded-full border text-[11px] font-semibold cursor-pointer transition-all ${
                                isSelected 
                                  ? 'bg-[var(--blue)] border-transparent text-white shadow-md font-bold' 
                                  : 'bg-[var(--card2)] border-[var(--border)] text-[var(--gray-light)] hover:text-white hover:border-[var(--gray)]'
                              }`}
                            >
                              {mg}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: ATHLETIC LEVEL */}
              {surveyStep === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <h4 className="font-bold text-sm text-[var(--text)] mb-1">Choose your current athletic level</h4>
                    <p className="text-[11px] text-[var(--gray-light)] mb-4">Be honest with your current baseline strength</p>
                    
                    <div className="space-y-3">
                      {[
                        { id: "Beginner", label: "🟢 Beginner Tier", desc: "0-2 Pull-ups, 1-10 Push-ups. Need solid fundamentals, basic form and regressions." },
                        { id: "Intermediate", label: "🟡 Intermediate Tier", desc: "3-10 Strict Pull-ups, 10-30 Push-ups. Able to handle standard compounds, exploring skill progressions." },
                        { id: "Advanced", label: "🔴 Advanced Tier", desc: "10+ Strict Pull-ups, 30+ Push-ups, clean dips. Ready for high-volume supersets, static levers and skill unlocks." }
                      ].map(lvl => {
                        const isSelected = surveyLevel === lvl.id;
                        return (
                          <button
                            key={lvl.id}
                            type="button"
                            onClick={() => setSurveyLevel(lvl.id)}
                            className={`w-full p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                              isSelected 
                                ? 'bg-[var(--blue)] border-transparent text-white shadow-md font-bold' 
                                : 'bg-[var(--card)] border-[var(--border)] hover:border-[var(--blue)]'
                            }`}
                          >
                            <div className={`text-xs font-black uppercase tracking-wide ${isSelected ? 'text-white' : 'text-[var(--text)]'}`}>{lvl.label}</div>
                            <div className={`text-[11px] mt-1.5 leading-relaxed ${isSelected ? 'text-blue-100' : 'text-[var(--gray-light)]'}`}>{lvl.desc}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: WORKOUT FREQUENCY & TIMING */}
              {surveyStep === 3 && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <h4 className="font-bold text-sm text-[var(--text)] mb-3">Current Training Days Weekly Average</h4>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                      {["0", "1", "2", "3", "4", "5", "6", "7"].map(d => {
                        const isSelected = surveyDays === d;
                        return (
                          <button
                            key={d}
                            type="button"
                            onClick={() => setSurveyDays(d)}
                            className={`py-3.5 rounded-xl border text-center font-bold text-xs cursor-pointer transition-all ${
                              isSelected 
                                ? 'bg-[var(--blue)] border-transparent text-white shadow-md font-bold' 
                                : 'bg-[var(--card)] border-[var(--border)] text-[var(--text)] hover:border-[var(--blue)]'
                            }`}
                          >
                            {d}
                            <span className="block text-[8px] font-normal uppercase tracking-tighter mt-0.5">Days</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-[var(--text)] mb-3">Preferred Session Duration</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "30-60 min", label: "30 to 60 Min" },
                        { id: "60-90 min", label: "60 to 90 Min" },
                        { id: "90+ min", label: "90+ Min" }
                      ].map(dur => {
                        const isSelected = surveyDuration === dur.id;
                        return (
                          <button
                            key={dur.id}
                            type="button"
                            onClick={() => setSurveyDuration(dur.id)}
                            className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                              isSelected 
                                ? 'bg-[var(--blue)] border-transparent text-white shadow-md font-bold' 
                                : 'bg-[var(--card)] border-[var(--border)] text-[var(--text)] hover:border-[var(--blue)]'
                            }`}
                          >
                            <div className="text-xs font-bold leading-none py-1.5">{dur.label}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: EQUIPMENT & HEALTH LIMITS */}
              {surveyStep === 4 && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <h4 className="font-bold text-sm text-[var(--text)] mb-3">Available Gear / Equipment</h4>
                    <div className="space-y-2">
                      {[
                        { id: "Bodyweight Only", label: "🤸 No Gear / Bodyweight", desc: "Floor-bound workouts only (push-ups, handstands, hollow body, squats)" },
                        { id: "Pull-up Bar", label: "🪜 Pull-Up Bar", desc: "Bar focus (pull-ups, chin-ups, hanging leg raises)" },
                        { id: "Full Gym / Calisthenics Park", label: "⚔️ Full Calisthenics Setup", desc: "Pull-up bar, rings, parallel bars, gymnastics rings" },
                        { id: "Weight Gym", label: "🏋️ Weight Gym", desc: "Access to free weights, dumbbells, barbells, or cable systems alongside bodyweight" }
                      ].map(equip => {
                        const isSelected = surveyEquipment === equip.id;
                        return (
                          <button
                            key={equip.id}
                            type="button"
                            onClick={() => setSurveyEquipment(equip.id)}
                            className={`w-full p-3 rounded-xl border text-left cursor-pointer transition-all ${
                              isSelected 
                                ? 'bg-[var(--blue)] border-transparent text-white shadow-md font-bold' 
                                : 'bg-[var(--card)] border-[var(--border)] hover:border-[var(--blue)]'
                            }`}
                          >
                            <div className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-[var(--text)]'}`}>{equip.label}</div>
                            <div className={`text-[10px] mt-1 ${isSelected ? 'text-blue-100' : 'text-[var(--gray-light)]'}`}>{equip.desc}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-[var(--text)] mb-1">Physical Injuries or Limitations (Optional)</h4>
                    <p className="text-[11px] text-[var(--gray-light)] mb-2">Wrist pain, elbow tendinitis, lower back stiffness, shoulder issues, none</p>
                    <input
                      type="text"
                      placeholder="e.g. Wrist pain when doing handstands, bad right knee"
                      className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-xl p-3 text-xs text-[var(--text)] outline-none focus:border-[var(--blue)] font-sans"
                      value={surveyLimitations}
                      onChange={e => setSurveyLimitations(e.target.value)}
                    />
                  </div>
                </div>
              )}

            </div>

            {/* Error Message */}
            {generationError && (
              <div className="mt-4 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-400 font-medium leading-relaxed">
                ⚠️ {generationError}
              </div>
            )}

            {/* Loader / Generation state */}
            {generatingSchedule && (
              <div className="absolute inset-0 bg-black/95 rounded-[28px] flex flex-col items-center justify-center p-6 z-[600] animate-fade-in text-center">
                <div className="w-12 h-12 border-4 border-t-transparent border-[var(--blue-light)] rounded-full animate-spin mb-5"></div>
                <h4 className="font-black text-sm text-[var(--text)] uppercase tracking-wider mb-2">Analyzing Athlete Metrics...</h4>
                <p className="text-xs text-[var(--gray-light)] max-w-xs animate-pulse leading-relaxed">
                  "AI is formulating your tailored routine blocks, gravity progressions, and specialized safety cue protocols."
                </p>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex gap-2.5 mt-6 pt-4 border-t border-[var(--border)]">
              {surveyStep > 1 && (
                <button
                  type="button"
                  onClick={() => setSurveyStep(prev => prev - 1)}
                  className="px-5 py-3 rounded-xl border border-[var(--border)] text-xs font-bold uppercase tracking-widest text-[var(--text)] hover:bg-[var(--card)] transition-colors cursor-pointer"
                >
                  Prev
                </button>
              )}
              {surveyStep < 4 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (surveyStep === 1) {
                      if (surveyGoals.length === 0) {
                        setGenerationError("Please select at least one training priority.");
                        return;
                      }
                      if (surveyStrongestMuscles.length === 0) {
                        setGenerationError("Please select at least one strongest muscle group.");
                        return;
                      }
                      if (surveyWeakestMuscles.length === 0) {
                        setGenerationError("Please select at least one weakest muscle group.");
                        return;
                      }
                    }
                    setGenerationError(null);
                    setSurveyStep(prev => prev + 1);
                  }}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[var(--navy)] to-[var(--blue)] font-bold text-xs uppercase tracking-widest text-white shadow-md active:scale-95 transition-transform text-center cursor-pointer"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleGenerateSchedule}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[var(--blue)] to-[var(--blue-light)] font-extrabold text-xs uppercase tracking-widest text-white shadow-lg shadow-cyan-950/25 active:scale-95 transition-all text-center cursor-pointer border border-[rgba(255,255,255,0.1)]"
                >
                  🚀 Create Plan
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ── TOAST MESSAGES ── */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[300] bg-[var(--surface)] border border-[var(--blue-glow)] shadow-xl shadow-[var(--blue-glow)] px-4 py-3 rounded-full text-sm font-semibold tracking-wide text-[var(--text)] animate-slide-up flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
