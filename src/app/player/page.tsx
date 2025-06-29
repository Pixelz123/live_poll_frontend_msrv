"use client";

import { useState, useEffect, useCallback } from "react";
import { type PollQuestionEntity } from "@/lib/quiz-data";
import { WaitingScreen } from "@/components/player/WaitingScreen";
import { QuestionDisplay } from "@/components/player/QuestionDisplay";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function PlayerPage() {
  const [currentQuestion, setCurrentQuestion] = useState<PollQuestionEntity | null>(null);
  const [playerId] = useState(() => `player_${Math.random().toString(36).substr(2, 9)}`);
  const { toast } = useToast();

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "quizwhiz-question") {
        if (event.newValue) {
          try {
            const question = JSON.parse(event.newValue);
            setCurrentQuestion(question);
          } catch (error) {
            console.error("Failed to parse question from storage", error);
            setCurrentQuestion(null);
          }
        } else {
            setCurrentQuestion(null);
        }
      }
    };
    
    // Check initial state
    const initialQuestion = localStorage.getItem("quizwhiz-question");
    if(initialQuestion) {
        handleStorageChange({key: "quizwhiz-question", newValue: initialQuestion} as StorageEvent);
    }

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleAnswerSubmit = useCallback((isCorrect: boolean) => {
    localStorage.setItem(
      "quizwhiz-answer",
      JSON.stringify({ playerId, isCorrect })
    );
    toast({
        title: isCorrect ? "Correct!" : "Incorrect!",
        description: isCorrect ? "Great job! Points will be added." : "Better luck on the next one.",
        variant: isCorrect ? "default" : "destructive",
        className: isCorrect ? "bg-green-500 border-green-500 text-white" : ""
    });
  }, [playerId, toast]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Link href="/" className="absolute top-4 left-4 text-primary hover:underline">
        &larr; Back to Home
      </Link>
      <header className="text-center mb-8">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Player View</h1>
      </header>
      
      {currentQuestion ? (
        <QuestionDisplay 
            key={currentQuestion.question_id} 
            question={currentQuestion}
            onAnswer={handleAnswerSubmit}
        />
      ) : (
        <WaitingScreen />
      )}
    </div>
  );
}
