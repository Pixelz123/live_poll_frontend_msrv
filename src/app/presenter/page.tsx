"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaderboard } from "@/components/presenter/Leaderboard";
import { initialPlayers, quizQuestions, type Player } from "@/lib/quiz-data";
import { ArrowRight, Play, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function PresenterPage() {
  const [leaderboard, setLeaderboard] = useState<Player[]>(initialPlayers);
  const [questionIndex, setQuestionIndex] = useState<number>(-1);
  const { toast } = useToast();

  const isQuizOver = questionIndex >= quizQuestions.length -1;

  // Effect to broadcast the current question via localStorage
  useEffect(() => {
    if (questionIndex >= 0 && questionIndex < quizQuestions.length) {
      const currentQuestion = quizQuestions[questionIndex];
      localStorage.setItem("quizwhiz-question", JSON.stringify(currentQuestion));
    } else {
      localStorage.removeItem("quizwhiz-question");
    }
  }, [questionIndex]);

  // Effect to listen for player answers from localStorage
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "quizwhiz-answer" && event.newValue) {
        try {
          const { playerId, isCorrect } = JSON.parse(event.newValue);
          const currentQuestion = quizQuestions[questionIndex];

          if (isCorrect) {
            setLeaderboard(prev => {
                const points = currentQuestion.points;
                toast({
                    title: `Correct answer from a player!`,
                    description: `+${points} points awarded.`,
                });
                return prev.map(p => p.id === playerId ? { ...p, score: p.score + points, change: points } : {...p, change: 0});
            });
          }
        } catch (error) {
          console.error("Failed to parse answer from storage", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [questionIndex, toast]);

  const handleProceed = () => {
    if (!isQuizOver) {
      setLeaderboard(prev => prev.map(p => ({ ...p, change: 0 })));
      setQuestionIndex(prev => prev + 1);
    }
  };
  
  const getStatusMessage = () => {
    if (questionIndex === -1) {
      return "The quiz has not started yet.";
    }
    if (isQuizOver) {
        return "The quiz has finished. Thanks for playing!";
    }
    return `Displaying Question ${questionIndex + 1} of ${quizQuestions.length}`;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <Link href="/" className="absolute top-4 left-4 text-primary hover:underline">
        &larr; Back to Home
      </Link>
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Presenter Dashboard</h1>
          <p className="text-muted-foreground mt-2 text-lg">{getStatusMessage()}</p>
        </header>
        
        <main className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 flex flex-col gap-8">
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl text-center">Controls</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                     <Button onClick={handleProceed} disabled={isQuizOver} size="lg" className="w-full font-bold">
                        {questionIndex === -1 && <><Play className="mr-2" /> Start Quiz</>}
                        {questionIndex > -1 && !isQuizOver && <><ArrowRight className="mr-2" /> Next Question</>}
                        {isQuizOver && <><CheckCircle className="mr-2" /> Quiz Finished</>}
                    </Button>
                </CardContent>
             </Card>
             {questionIndex >= 0 && !isQuizOver && (
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-xl text-center">Current Question</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-lg font-semibold">{quizQuestions[questionIndex].question_content}</p>
                        <p className="text-sm text-muted-foreground mt-2">Correct Answer: {quizQuestions[questionIndex].options[quizQuestions[questionIndex].correct_option]}</p>
                    </CardContent>
                </Card>
             )}
          </div>
          <div className="md:col-span-2">
            <Leaderboard players={leaderboard} />
          </div>
        </main>
      </div>
    </div>
  );
}
