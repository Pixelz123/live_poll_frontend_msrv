"use client";

import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function WaitingScreen() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="animate-pulse">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <Loader2 className="w-16 h-16 text-primary animate-spin mb-6" />
          <h2 className="font-headline text-3xl font-bold text-primary">
            Get Ready!
          </h2>
          <p className="text-muted-foreground mt-2 text-lg">
            Waiting for the presenter to start the quiz...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
