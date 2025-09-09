
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
