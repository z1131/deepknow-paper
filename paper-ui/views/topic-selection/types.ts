export interface SurveyData {
    hasTopic: boolean;
    topicFile?: File | null;
    topicFileContent?: string; // Text content of the file if readable
    topicDescription?: string; // Manual text input from the user
    innovationDefined: boolean;
    needsMajorRevision: boolean;
    isComplete: boolean;
}

export interface Message {
    id: string;
    role: 'user' | 'model';
    text: string;
    timestamp: number;
}

export interface TopicStatus {
    phase: 'Brainstorming' | 'Refining' | 'Finalizing';
    readiness: number; // 0 to 100
    keyFocus: string;
}

export interface ThesisContent {
    id: string;
    title: string;
    innovations: string[];
}

export interface ThesisPlan {
    title: string;
    contents: ThesisContent[];
}
