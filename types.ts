
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
