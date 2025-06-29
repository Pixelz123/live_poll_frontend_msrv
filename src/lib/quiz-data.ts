export interface PollQuestionEntity {
  question_id: string;
  question_number: number;
  question_content: string;
  options: string[];
  timeInSeconds: number;
  correct_option: number;
  points: number;
}

export const sampleQuestion: PollQuestionEntity = {
  question_id: "q1",
  question_number: 1,
  question_content: "This is a sample question. What is 2 + 2?",
  options: ["3", "4", "5", "6"],
  timeInSeconds: 20,
  correct_option: 1,
  points: 100,
};

export interface Player {
    id: string;
    name: string;
    score: number;
    change: number;
}

export const initialPlayers: Player[] = [];
