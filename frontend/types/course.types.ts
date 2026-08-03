export interface Note {
  id: string;
  title: string;
  content: string; // Markdown text content for rendering
  pdfUrl?: string; // Link to download PDF version
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  passing_percentage?: number;
  questions: QuizQuestion[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  instructions: string;
}

export interface Resource {
  id: string;
  title: string;
  type: "pdf" | "zip" | "code" | "link" | "slides";
  url: string;
}

export interface Lecture {
  id: string;
  slug: string;
  title: string;
  description: string;
  notes?: Note;
  quiz?: Quiz;
  task?: Task;
  videoUrl?: string; // Optional YouTube / learning video link
  resources?: Resource[]; // Future-ready files/links
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail: string; // Path or URL to thumbnail image
  lectures: Lecture[];
}
