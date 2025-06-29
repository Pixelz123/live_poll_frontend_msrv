"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { type PollQuestionEntity } from "@/lib/quiz-data";
import { WaitingScreen } from "@/components/player/WaitingScreen";
import { QuestionDisplay } from "@/components/player/QuestionDisplay";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useWebSocket } from "@/hooks/use-websocket";
import { Wifi, WifiOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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
               <Link href="/" className="absolute top-4 left-4 text-primary hover:underline">
                    &larr; Back to Home
                </Link>
              <h2 className="font-headline text-2xl text-destructive">No Poll ID Provided</h2>
              <p className="text-muted-foreground mt-2">Please go back to the home page and enter a Poll ID to join a game.</p>
              <Button asChild className="mt-4">
                  <Link href="/">Go to Home</Link>
              </Button>
          </div>
      )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
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
      <header className="text-center mb-8">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Player View</h1>
        <p className="text-muted-foreground text-sm">Quiz ID: {pollId}</p>
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
            <p className="text-muted-foreground mt-4">Loading quiz...</p>
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
