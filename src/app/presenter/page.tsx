
"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaderboard } from "@/components/presenter/Leaderboard";
import { initialPlayers, type Player } from "@/lib/quiz-data";
import { ArrowRight, Play, CheckCircle, Wifi, WifiOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useWebSocket } from "@/hooks/use-websocket";

function PresenterPageContent() {
  const searchParams = useSearchParams();
  const pollId = searchParams.get("pollId");

  const TOPIC_ADMIN = pollId ? `/topic/admin/${pollId}` : '';
  const APP_START_QUIZ = pollId ? `/app/start_request/${pollId}` : '';
  const APP_PROCEED_QUIZ = pollId ? `/app/proceed/${pollId}` : '';

  const [leaderboard, setLeaderboard] = useState<Player[]>(initialPlayers);
  const [questionCount, setQuestionCount] = useState<number>(0);
  const [isQuizStarted, setIsQuizStarted] = useState<boolean>(false);
  const [isQuizOver, setIsQuizOver] = useState<boolean>(false);
  const { connect, publish, subscribe, isConnected } = useWebSocket();

  // Effect to handle WebSocket connection
  useEffect(() => {
    if (pollId) {
      connect();
    }
  }, [connect, pollId]);

  // Effect to handle subscriptions
  useEffect(() => {
    if (!isConnected || !pollId) return;

    // This one subscription handles all messages for the presenter from the server
    const adminSub = subscribe(TOPIC_ADMIN, (message) => {
      if (!message.body) {
        setIsQuizOver(true);
        return;
      }

      try {
        const data = JSON.parse(message.body);
        
        // Case 1: It's a leaderboard update
        if (data.scoreboard) {
          const leaderboardData: { scoreboard: { user_name: string; score: number }[] } = data;
          
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
        // Case 2: It's a question number update from the server
        else if (data.question_number) {
            setQuestionCount(data.question_number);
            setIsQuizStarted(true);
            setIsQuizOver(false);
        }
        // Case 3: The quiz is over
        else if (data.status === 'finished') {
            setIsQuizOver(true);
        }
      } catch (error) {
        console.error("Failed to parse admin message from WebSocket", error);
      }
    });

    // Cleanup subscriptions on component unmount
    return () => {
        adminSub?.unsubscribe();
    }
  }, [isConnected, subscribe, pollId, TOPIC_ADMIN]);

  const handleProceed = () => {
    if (!pollId) return;
    setLeaderboard(prev => prev.map(p => ({ ...p, change: 0 })));
    if (!isQuizStarted) {
      publish(APP_START_QUIZ, JSON.stringify({}));
    } else {
      publish(APP_PROCEED_QUIZ, JSON.stringify({}));
    }
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

  if (!pollId) {
      return (
          <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
               <Link href="/" className="absolute top-4 left-4 text-primary hover:underline">
                    &larr; Back to Home
                </Link>
              <h2 className="font-headline text-2xl text-destructive">No Poll ID Provided</h2>
              <p className="text-muted-foreground mt-2">Please select a poll from the available polls list.</p>
              <Button asChild className="mt-4">
                  <Link href="/polls">View Available Polls</Link>
              </Button>
          </div>
      )
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
          <p className="text-muted-foreground text-sm">Quiz ID: {pollId}</p>
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
          </div>
          <div className="md:col-span-2">
            <Leaderboard players={leaderboard} />
          </div>
        </main>
      </div>
    </div>
  );
}

function LoadingFallback() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center">
            <Loader2 className="w-16 h-16 text-primary animate-spin" />
            <p className="text-muted-foreground mt-4">Loading Dashboard...</p>
        </div>
    )
}

export default function PresenterPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <PresenterPageContent />
        </Suspense>
    )
}
