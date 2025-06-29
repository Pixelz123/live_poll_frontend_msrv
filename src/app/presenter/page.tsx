"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaderboard } from "@/components/presenter/Leaderboard";
import { initialPlayers, type Player } from "@/lib/quiz-data";
import { ArrowRight, Play, CheckCircle, Wifi, WifiOff, Loader2, Home, BarChart3, Settings, AlertTriangle } from "lucide-react";
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
    if (!isConnected) {
        return "Connecting to server...";
    }
    if (isQuizOver) {
        return "The quiz has finished. Thanks for playing!";
    }
    if (!isQuizStarted) {
      return "The quiz is ready to begin.";
    }
    return `Displaying Question ${questionCount}`;
  }

  if (!pollId) {
      return (
          <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
              <Card className="w-full max-w-lg">
                <CardHeader>
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                        <AlertTriangle className="w-8 h-8" />
                    </div>
                    <CardTitle className="font-headline text-3xl">No Poll ID Provided</CardTitle>
                    <CardDescription>Please select a poll from the available polls list to start presenting.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild className="w-full" size="lg">
                        <Link href="/polls">View Available Polls</Link>
                    </Button>
                </CardContent>
              </Card>
          </div>
      )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="absolute top-4 left-4">
         <Button asChild variant="outline" size="sm">
            <Link href="/">
                <Home className="mr-2 h-4 w-4" /> Home
            </Link>
        </Button>
      </div>
       <div className="absolute top-4 right-4">
        <div className="flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-sm text-muted-foreground">
            {isConnected ? (
            <span className="flex items-center gap-2 text-green-500">
                <Wifi className="w-4 h-4" /> Connected
            </span>
            ) : (
            <span className="flex items-center gap-2 text-destructive">
                <WifiOff className="w-4 h-4" /> Disconnected
            </span>
            )}
        </div>
      </div>
      <div className="w-full max-w-6xl mx-auto">
        <header className="text-center mb-8 animate-in fade-in-50 duration-500">
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Presenter Dashboard</h1>
          <p className="text-muted-foreground text-sm font-mono mt-1">Quiz ID: {pollId}</p>
        </header>
        
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in-50 slide-in-from-bottom-10 duration-500">
          <div className="lg:col-span-1 flex flex-col gap-8">
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 font-headline text-2xl">
                        <Settings className="w-6 h-6 text-primary" />
                        Controls
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="p-4 bg-muted rounded-lg text-center">
                        <p className="font-medium">Status</p>
                        <p className="text-muted-foreground text-sm">{getStatusMessage()}</p>
                     </div>
                     <Button onClick={handleProceed} disabled={isQuizOver || !isConnected} size="lg" className="w-full font-bold text-lg h-14">
                        {!isQuizStarted && <><Play className="mr-2" /> Start Quiz</>}
                        {isQuizStarted && !isQuizOver && <><ArrowRight className="mr-2" /> Proceed</>}
                        {isQuizOver && <><CheckCircle className="mr-2" /> Quiz Finished</>}
                    </Button>
                </CardContent>
             </Card>
             <Card>
                <CardHeader>
                     <CardTitle className="flex items-center gap-3 font-headline text-2xl">
                        <BarChart3 className="w-6 h-6 text-primary" />
                        Live Results
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-center">Live results will appear here after each question.</p>
                </CardContent>
             </Card>
          </div>
          <div className="lg:col-span-2">
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
            <p className="text-muted-foreground mt-4 font-headline text-xl">Loading Dashboard...</p>
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
