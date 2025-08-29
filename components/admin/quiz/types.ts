export type Quiz = {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  duration?: string;
  description: string;
  questions: any[];
  createdAt: Date;
  completions: number;
}
