"use client";

import { Loader2, WifiOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface WaitingScreenProps {
  isOnline?: boolean;
}

export function WaitingScreen({ isOnline = true }: WaitingScreenProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className={!isOnline ? "border-destructive" : "animate-pulse"}>
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          {isOnline ? (
            <>
              <Loader2 className="w-16 h-16 text-primary animate-spin mb-6" />
              <h2 className="font-headline text-3xl font-bold text-primary">
                Get Ready!
              </h2>
              <p className="text-muted-foreground mt-2 text-lg">
                Waiting for the presenter to start the quiz...
              </p>
            </>
          ) : (
             <>
              <WifiOff className="w-16 h-16 text-destructive mb-6" />
              <h2 className="font-headline text-3xl font-bold text-destructive">
                Connection Lost
              </h2>
              <p className="text-muted-foreground mt-2 text-lg">
                Trying to reconnect to the quiz server...
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
