"use client";

import { useState, useEffect } from "react";
import { type PollQuestionEntity } from "@/lib/quiz-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestionDisplayProps {
  question: PollQuestionEntity;
  onAnswer: (isCorrect: boolean) => void;
}

export function QuestionDisplay({ question, onAnswer }: QuestionDisplayProps) {
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
  }, [timeLeft, answerSubmitted]);

  const handleSubmit = () => {
    if (answerSubmitted) return;
    setAnswerSubmitted(true);
    const isCorrect = selectedOption === question.correct_option;
    onAnswer(isCorrect);
  };

  const progressValue = (timeLeft / question.timeInSeconds) * 100;
  
  const getButtonVariant = (index: number) => {
    if (!answerSubmitted) {
      return selectedOption === index ? "default" : "outline";
    }
    if (index === question.correct_option) return "success";
    if (index === selectedOption) return "destructive";
    return "outline";
  }

  const getButtonIcon = (index: number) => {
    if (!answerSubmitted) return null;
    if (index === question.correct_option) return <Check className="w-5 h-5 mr-2" />;
    if (index === selectedOption) return <X className="w-5 h-5 mr-2" />;
    return null;
  }

  return (
    <Card className="w-full max-w-3xl animate-in fade-in-50 slide-in-from-bottom-10 duration-500">
      <CardHeader>
        <div className="w-full mb-4">
            <Progress value={progressValue} className="h-3" />
            <p className="text-center mt-2 text-lg font-bold text-primary">{timeLeft}s</p>
        </div>
        <CardTitle className="font-headline text-3xl text-center leading-tight">
          {question.question_content}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {question.options.map((option, index) => (
            <Button
              key={index}
              onClick={() => setSelectedOption(index)}
              disabled={answerSubmitted}
              className={cn("text-lg h-auto py-4 whitespace-normal justify-start transition-all duration-300", 
                selectedOption === index && !answerSubmitted ? "bg-accent/80 text-accent-foreground" : "",
                answerSubmitted && index === question.correct_option ? "bg-green-500 hover:bg-green-600 text-white" : "",
                answerSubmitted && index !== question.correct_option && selectedOption === index ? "bg-red-500 hover:bg-red-600 text-white" : "",
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
          <Button onClick={handleSubmit} disabled={answerSubmitted || selectedOption === null} size="lg" className="font-bold w-1/2">
            {answerSubmitted ? "Waiting for Next Question..." : "Submit Answer"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
