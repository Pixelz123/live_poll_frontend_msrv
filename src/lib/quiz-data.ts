export interface PollQuestionEntity {
  question_id: string;
  question_content: string;
  options: string[];
  timeInSeconds: number;
  correct_option: number;
  points: number;
}

export const quizQuestions: PollQuestionEntity[] = [
  {
    question_id: "q1",
    question_content: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    timeInSeconds: 20,
    correct_option: 2,
    points: 100,
  },
  {
    question_id: "q2",
    question_content: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    timeInSeconds: 20,
    correct_option: 1,
    points: 100,
  },
  {
    question_id: "q3",
    question_content: "What is the largest ocean on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    timeInSeconds: 25,
    correct_option: 3,
    points: 120,
  },
  {
    question_id: "q4",
    question_content: "Who wrote 'To Kill a Mockingbird'?",
    options: ["Harper Lee", "J.K. Rowling", "Ernest Hemingway", "Mark Twain"],
    timeInSeconds: 30,
    correct_option: 0,
    points: 150,
  },
  {
    question_id: "q5",
    question_content: "What is the chemical symbol for gold?",
    options: ["Ag", "Au", "Pb", "Fe"],
    timeInSeconds: 15,
    correct_option: 1,
    points: 100,
  },
];

export interface Player {
    id: string;
    name: string;
    score: number;
    change: number;
}

export const initialPlayers: Player[] = [];
