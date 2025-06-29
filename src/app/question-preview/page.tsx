"use client";

import { QuestionDisplay } from "@/components/player/QuestionDisplay";
import { quizQuestions } from "@/lib/quiz-data";
import Link from "next/link";

export default function QuestionPreviewPage() {
  const sampleQuestion = quizQuestions[0];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Link href="/" className="absolute top-4 left-4 text-primary hover:underline">
        &larr; Back to Home
      </Link>
      <header className="text-center mb-8">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">
          Question Preview
        </h1>
        <p className="text-muted-foreground mt-2">This is how a question will appear to players.</p>
      </header>
      
      <QuestionDisplay 
        key={sampleQuestion.question_id} 
        question={sampleQuestion}
        onAnswer={() => { console.log("Answer submitted in preview mode."); }}
        isOnline={true}
      />
    </div>
  );
}
