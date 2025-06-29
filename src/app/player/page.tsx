"use client";

import { useState, useEffect, useCallback } from "react";
import { type PollQuestionEntity } from "@/lib/quiz-data";
import { WaitingScreen } from "@/components/player/WaitingScreen";
import { QuestionDisplay } from "@/components/player/QuestionDisplay";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useWebSocket } from "@/hooks/use-websocket";
import { Wifi, WifiOff } from "lucide-react";

const pollId = "quiz123"; // Dummy poll ID
const TOPIC_POLL = `/topic/${pollId}`;
const APP_SEND_ANSWER = `/app/poll/${pollId}`;

export default function PlayerPage() {
  const [currentQuestion, setCurrentQuestion] = useState<PollQuestionEntity | null>(null);
  const [playerId] = useState(() => `player_${Math.random().toString(36).substr(2, 9)}`);
  const { toast } = useToast();
  const { connect, publish, subscribe, isConnected } = useWebSocket();

  // Effect to handle WebSocket connection
  useEffect(() => {
    connect();
  }, [connect]);

  // Effect to handle subscriptions for question updates
  useEffect(() => {
    if (!isConnected) return;

    const subscription = subscribe(TOPIC_POLL, (message) => {
      if (message.body) {
        try {
          const question = JSON.parse(message.body);
          setCurrentQuestion(question);
        } catch (error) {
          console.error("Failed to parse question from WebSocket", error);
          // If parsing fails, revert to waiting screen
          setCurrentQuestion(null);
        }
      } else {
        // An empty message body signals to return to the waiting screen (e.g., between questions or quiz end)
        setCurrentQuestion(null);
      }
    });
    
    // Cleanup subscription on component unmount
    return () => {
        subscription?.unsubscribe();
    }
  }, [isConnected, subscribe]);

  const handleAnswerSubmit = useCallback((selectedOption: number | null) => {
    if (!isConnected || !currentQuestion) {
        toast({
            title: "Connection Error",
            description: "Cannot submit answer. Not connected or no active question.",
            variant: "destructive",
        });
        return;
    }

    // The server should be responsible for validating the answer and calculating points.
    const userResponse = {
        user_id: playerId,
        poll_id: pollId,
        index: currentQuestion.question_number,
        response: selectedOption ?? -1, // Send -1 if no option was selected
    };

    publish(APP_SEND_ANSWER, JSON.stringify(userResponse));
    
    toast({
        title: "Answer Submitted!",
        description: "Waiting for the next question.",
    });
  }, [playerId, isConnected, publish, toast, currentQuestion]);

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
