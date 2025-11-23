
export interface Topic {
  id: string;
  title: string;
}

export interface Module {
  id: string;
  title: string;
  topics: Topic[];
}

export interface GeneratedContent {
  explanation: string;
  diagram: string;
}

export interface TopicHistoryItem {
  topicId: string;
  topicTitle: string;
  moduleId: string;
  moduleTitle: string;
}

export interface ProgressData {
  completedTopics: string[];
  currentStreak: number;
  totalTimeSpent: number;
  lastVisited: string | null;
}

export type SoundType = 'click' | 'success' | 'hover' | 'notification' | 'complete';

export interface AnimationConfig {
  initial?: object;
  animate?: object;
  exit?: object;
  transition?: object;
}
