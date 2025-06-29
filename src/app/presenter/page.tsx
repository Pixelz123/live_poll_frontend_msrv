"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaderboard } from "@/components/presenter/Leaderboard";
import { initialPlayers, type Player, type PollQuestionEntity } from "@/lib/quiz-data";
import { ArrowRight, Play, CheckCircle, Wifi, WifiOff } from "lucide-react";
import Link from "next/link";
import { useWebSocket } from "@/hooks/use-websocket";

const pollId = "quiz123"; // Dummy poll ID
const TOPIC_ANSWER = `/topic/admin/${pollId}`;
const TOPIC_QUESTION_BROADCAST = `/topic/quiz/question/${pollId}`;
const APP_SEND_QUESTION = `/app/quiz/question/${pollId}`;

export default function PresenterPage() {
  const [leaderboard, setLeaderboard] = useState<Player[]>(initialPlayers);
  const [currentQuestion, setCurrentQuestion] = useState<PollQuestionEntity | null>(null);
  const [questionCount, setQuestionCount] = useState<number>(0);
  const [isQuizStarted, setIsQuizStarted] = useState<boolean>(false);
  const [isQuizOver, setIsQuizOver] = useState<boolean>(false);
  const { connect, publish, subscribe, isConnected } = useWebSocket();

  // Effect to handle WebSocket connection
  useEffect(() => {
    connect();
  }, [connect]);

  // Effect to handle subscriptions
  useEffect(() => {
    if (!isConnected) return;

    const answerSub = subscribe(TOPIC_ANSWER, (message) => {
      if (message.body) {
        try {
          const leaderboardData: { scoreboard: { user_name: string; score: number }[] } = JSON.parse(message.body);
          
          if (leaderboardData.scoreboard) {
            setLeaderboard(prevLeaderboard => {
              const oldScores = new Map<string, number>();
              prevLeaderboard.forEach(p => {
                oldScores.set(p.name, p.score);
              });

              const newLeaderboard: Player[] = leaderboardData.scoreboard.map(userScore => {
                const oldScore = oldScores.get(userScore.user_name) || 0;
                return {
                  id: userScore.user_name,
                  name: userScore.user_name,
                  score: userScore.score,
                  change: userScore.score - oldScore,
                };
              });
              
              return newLeaderboard;
            });
          }
        } catch (error) {
          console.error("Failed to parse leaderboard update from WebSocket", error);
        }
      }
    });

    const questionSub = subscribe(TOPIC_QUESTION_BROADCAST, (message) => {
      console.log("Presenter received question broadcast:", message.body);
       if (message.body) {
        try {
          const question = JSON.parse(message.body);
          if (question) {
            setCurrentQuestion(question);
            setQuestionCount(prev => prev + 1);
            setIsQuizStarted(true);
            setIsQuizOver(false);
          } else {
            setCurrentQuestion(null);
            setIsQuizOver(true);
          }
        } catch (error) {
          console.error("Failed to parse question from WebSocket", error);
          setCurrentQuestion(null);
          setIsQuizOver(true);
        }
      } else {
        // Null body can also signify end of quiz
        setCurrentQuestion(null);
        setIsQuizOver(true);
      }
    });

    // Cleanup subscriptions on component unmount
    return () => {
        answerSub?.unsubscribe();
        questionSub?.unsubscribe();
    }
  }, [isConnected, subscribe]);

  const handleProceed = () => {
    setLeaderboard(prev => prev.map(p => ({ ...p, change: 0 })));
    publish(APP_SEND_QUESTION, JSON.stringify({}));
  };
  
  const getStatusMessage = () => {
    if (isQuizOver) {
        return "The quiz has finished. Thanks for playing!";
    }
    if (!isQuizStarted) {
      return "The quiz has not started yet.";
    }
    return `Displaying Question ${questionCount}`;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <Link href="/" className="absolute top-4 left-4 text-primary hover:underline">
        &larr; Back to Home
      </Link>
       <div className="absolute top-4 right-4 flex items-center gap-2">
        {isConnected ? (
          <span className="text-green-600 flex items-center gap-1">
            <Wifi className="w-4 h-4" /> Connected
          </span>
        ) : (
          <span className="text-red-600 flex items-center gap-1">
            <WifiOff className="w-4 h-4" /> Disconnected
          </span>
        )}
      </div>
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
                     <Button onClick={handleProceed} disabled={isQuizOver || !isConnected} size="lg" className="w-full font-bold">
                        {!isQuizStarted && <><Play className="mr-2" /> Start Quiz</>}
                        {isQuizStarted && !isQuizOver && <><ArrowRight className="mr-2" /> Proceed</>}
                        {isQuizOver && <><CheckCircle className="mr-2" /> Quiz Finished</>}
                    </Button>
                </CardContent>
             </Card>
             {currentQuestion && !isQuizOver && (
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-xl text-center">Current Question</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-lg font-semibold">{currentQuestion.question_content}</p>
                        <p className="text-sm text-muted-foreground mt-2">Correct Answer: {currentQuestion.options[currentQuestion.correct_option]}</p>
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
