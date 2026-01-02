export interface SummaryResult {
  title: string;
  author: string;
  summary: string;
  keyTakeaways: string[];
  readingTimeSaved: string;
  timestamp: number;
}

export enum SummaryLength {
  BRIEF = 'Brief',
  MEDIUM = 'Medium',
  DETAILED = 'Detailed'
}

export enum InputMode {
  PASTE = 'paste',
  DETAILS = 'details'
}

export interface BookDetails {
  title: string;
  author: string;
  genre: string;
  concepts: string;
}

export interface GenerateRequest {
  mode: InputMode;
  text?: string;
  details?: BookDetails;
  length: SummaryLength;
}