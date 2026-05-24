export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  timestamp: number;
}

export interface WorkoutLog {
  id: string;
  name: string;
  dur: number;
  exercises?: number;
  notes?: string;
  date: string;
  icon: string;
  timestamp?: number;
  userId?: string;
}

export interface ReplyItem {
  id: string;
  author: string;
  initials: string;
  avatarColor: string;
  text: string;
  likes: number;
  liked: boolean;
}

export interface CommentItem {
  id: string;
  author: string;
  initials: string;
  avatarColor: string;
  text: string;
  likes: number;
  liked: boolean;
  replies: ReplyItem[];
}

export interface Post {
  id: string;
  author: string;
  authorId?: string;
  initials: string;
  avatarColor: string;
  text: string;
  time: string;
  timestamp?: number;
  likes: number;
  liked: boolean;
  likedBy?: string[];
  comments: CommentItem[];
  pinned?: boolean;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'file';
  mediaName?: string;
}

export interface UserProfile {
  name: string;
  goal: string;
  level: string;
  memberSince: string;
  hasCompletedSurvey?: boolean;
  coachAdvice?: string;
}
