"use client";

import { QuestionDisplay } from "@/components/player/QuestionDisplay";
import { sampleQuestion } from "@/lib/quiz-data";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Home, Eye } from "lucide-react";


export default function QuestionPreviewPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex flex-col items-center justify-center p-4">
       <div className="absolute top-4 left-4">
         <Button asChild variant="outline" size="sm">
            <Link href="/">
                <Home className="mr-2 h-4 w-4" /> Home
            </Link>
        </Button>
      </div>
      <header className="text-center mb-8">
        <div className="inline-block rounded-full bg-primary/10 p-4 mb-4">
          <Eye className="h-8 w-8 text-primary" />
        </div>
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">
          Question Preview
        </h1>
        <p className="text-muted-foreground mt-2 max-w-md">This is a preview of how a question will appear to players on their devices.</p>
      </header>
      
      <div className="w-full max-w-3xl">
        <QuestionDisplay 
            key={sampleQuestion.question_id} 
            question={sampleQuestion}
            onAnswer={(selectedOption) => { console.log(`Answer submitted in preview mode. Selected option: ${selectedOption}`); }}
            isOnline={true}
        />
      </div>
    </div>
  );
}
