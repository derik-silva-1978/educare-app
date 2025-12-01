
export type TutorialLevel = 'beginner' | 'intermediate' | 'advanced';

export type TutorialCategory = 
  | 'getting-started' 
  | 'assessments' 
  | 'reports' 
  | 'pei' 
  | 'students' 
  | 'teams' 
  | 'settings'
  | 'ai';

export interface VideoTutorial {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail?: string;
  duration: string;
  level: TutorialLevel;
  category: TutorialCategory;
  topics?: string[];
  relatedManualSection: string;
  transcript?: string;
  dateAdded: string;
}
