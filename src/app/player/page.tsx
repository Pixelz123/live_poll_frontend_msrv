"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { type PollQuestionEntity } from "@/lib/quiz-data";
import { WaitingScreen } from "@/components/player/WaitingScreen";
import { QuestionDisplay } from "@/components/player/QuestionDisplay";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useWebSocket } from "@/hooks/use-websocket";
import { Wifi, WifiOff, Loader2, Home, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function PlayerPageContent() {
  const searchParams = useSearchParams();
  const pollId = searchParams.get("pollId");

  const TOPIC_POLL = pollId ? `/topic/${pollId}` : '';
  const APP_SEND_ANSWER = pollId ? `/app/poll/${pollId}` : '';

  const [currentQuestion, setCurrentQuestion] = useState<PollQuestionEntity | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const { toast } = useToast();
  const { connect, publish, subscribe, isConnected } = useWebSocket();

  useEffect(() => {
    // Generate player ID only on the client to avoid hydration mismatch
    setPlayerId(`player_${Math.random().toString(36).substr(2, 9)}`);
  }, []);

  useEffect(() => {
    if (pollId) {
      connect();
    }
  }, [connect, pollId]);

  useEffect(() => {
    if (!isConnected || !pollId) return;

    const subscription = subscribe(TOPIC_POLL, (message) => {
      if (message.body) {
        try {
          const question = JSON.parse(message.body);
          setCurrentQuestion(question);
        } catch (error) {
          console.error("Failed to parse question from WebSocket", error);
          setCurrentQuestion(null);
        }
      } else {
        setCurrentQuestion(null);
      }
    });
    
    return () => {
        subscription?.unsubscribe();
    }
  }, [isConnected, subscribe, pollId, TOPIC_POLL]);

  const handleAnswerSubmit = useCallback((selectedOption: number | null) => {
    if (!isConnected || !currentQuestion || !playerId || !pollId) {
        toast({
            title: "Connection Error",
            description: "Cannot submit answer. Not connected, no active question, or player ID not set.",
            variant: "destructive",
        });
        return;
    }
    
    const isCorrect = selectedOption === currentQuestion.correct_option;
    const points = isCorrect ? currentQuestion.points : 0;

    const userResponse = {
        user_id: playerId,
        poll_id: pollId,
        index: currentQuestion.question_number,
        response: selectedOption ?? -1,
        points: points
    };

    publish(APP_SEND_ANSWER, JSON.stringify(userResponse));
    
    toast({
        title: "Answer Submitted!",
        description: "Waiting for the next question.",
    });
  }, [playerId, isConnected, publish, toast, currentQuestion, pollId, APP_SEND_ANSWER]);

  if (!pollId) {
      return (
          <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
              <Card className="w-full max-w-lg">
                <CardHeader>
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                        <AlertTriangle className="w-8 h-8" />
                    </div>
                    <CardTitle className="font-headline text-3xl">No Poll ID Provided</CardTitle>
                    <CardDescription>Please go back to the home page and enter a Poll ID to join a game.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild className="w-full" size="lg">
                        <Link href="/"><Home className="mr-2"/> Go to Home</Link>
                    </Button>
                </CardContent>
              </Card>
          </div>
      )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex flex-col items-center justify-center p-4">
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
      <header className="text-center mb-8">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Player View</h1>
        <p className="text-muted-foreground text-sm font-mono mt-1">Quiz ID: {pollId}</p>
      </header>
      
      {currentQuestion ? (
        <QuestionDisplay 
            key={currentQuestion.question_id} 
            question={currentQuestion}
            onAnswer={handleAnswerSubmit}
            isOnline={isConnected}
        />
      ) : (
        <WaitingScreen isOnline={isConnected} />
      )}
    </div>
  );
}

function LoadingFallback() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center">
            <Loader2 className="w-16 h-16 text-primary animate-spin" />
            <p className="text-muted-foreground mt-4 font-headline text-xl">Loading Quiz...</p>
        </div>
    )
}

export default function PlayerPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <PlayerPageContent />
        </Suspense>
    )
}
