"use client";

import { useState, useEffect } from "react";
import { type PollQuestionEntity } from "@/lib/quiz-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, X, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestionDisplayProps {
  question: PollQuestionEntity;
  onAnswer: (selectedOption: number | null) => void;
  isOnline: boolean;
}

export function QuestionDisplay({ question, onAnswer, isOnline }: QuestionDisplayProps) {
  const [timeLeft, setTimeLeft] = useState(question.timeInSeconds);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);

  useEffect(() => {
    setTimeLeft(question.timeInSeconds);
    setSelectedOption(null);
    setAnswerSubmitted(false);

    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [question]);

  useEffect(() => {
    if (timeLeft === 0 && !answerSubmitted) {
      handleSubmit();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, answerSubmitted]);

  const handleSubmit = () => {
    if (answerSubmitted) return;
    setAnswerSubmitted(true);
    onAnswer(selectedOption);
  };

  const progressValue = (timeLeft / question.timeInSeconds) * 100;
  
  const getButtonIcon = (index: number) => {
    if (!answerSubmitted) return null;
    if (index === question.correct_option) return <Check className="w-5 h-5 mr-2" />;
    if (index === selectedOption) return <X className="w-5 h-5 mr-2" />;
    return null;
  }

  return (
    <Card className="w-full max-w-3xl shadow-2xl animate-in fade-in-50 zoom-in-95 duration-500">
      <CardHeader>
        <div className="w-full mb-4">
            <div className="flex justify-center items-center gap-2 mb-2 text-muted-foreground">
                <Timer className="w-5 h-5" />
                <p className="text-lg font-bold text-primary font-mono tabular-nums">{timeLeft}s</p>
            </div>
            <Progress value={progressValue} className="h-3" />
        </div>
        <CardTitle className="font-headline text-3xl text-center leading-tight">
          {question.question_content}
        </CardTitle>
        <CardDescription className="text-center mt-2">Question {question.question_number}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {question.options.map((option, index) => (
            <Button
              key={index}
              onClick={() => setSelectedOption(index)}
              disabled={answerSubmitted || !isOnline}
              className={cn("text-lg h-auto py-4 whitespace-normal justify-start transition-all duration-300", 
                selectedOption === index && !answerSubmitted ? "bg-accent text-accent-foreground" : "",
                answerSubmitted && index === question.correct_option ? "bg-primary text-primary-foreground hover:bg-primary/90" : "",
                answerSubmitted && index !== question.correct_option && selectedOption === index ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : "",
                answerSubmitted && index !== question.correct_option ? "opacity-60" : ""
              )}
              variant="outline"
            >
              {getButtonIcon(index)}
              <span>{option}</span>
            </Button>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Button onClick={handleSubmit} disabled={answerSubmitted || selectedOption === null || !isOnline} size="lg" className="font-bold w-full sm:w-1/2 h-14 text-lg">
            {answerSubmitted ? "Waiting..." : "Submit Answer"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
