"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ListChecks, Presentation, UserPlus } from "lucide-react";

export default function Home() {
  const [pollId, setPollId] = useState("");
  const router = useRouter();

  const handleJoinGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (pollId.trim()) {
      router.push(`/player?pollId=${pollId.trim()}`);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-12 p-8 bg-background">
      <div className="text-center">
        <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary">
          QuizWhiz
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          The ultimate multiplayer quiz experience.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        <Button asChild size="lg" className="font-bold text-lg py-8 px-10">
          <Link href="/polls" className="flex flex-col items-center justify-center gap-2">
            <ListChecks className="w-8 h-8" />
            <span>Available Polls</span>
          </Link>
        </Button>
        <Button asChild size="lg" className="font-bold text-lg py-8 px-10">
          <Link href="/presenter" className="flex flex-col items-center justify-center gap-2">
            <Presentation className="w-8 h-8" />
            <span>Start Presenting</span>
          </Link>
        </Button>
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                <UserPlus className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="font-headline text-3xl">Join a Game</CardTitle>
            <CardDescription>
                Enter the Poll ID to join a quiz.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleJoinGame} className="w-full">
                <Label htmlFor="pollId" className="sr-only">Poll ID</Label>
                <div className="flex items-center space-x-2">
                    <Input
                        id="pollId"
                        type="text"
                        placeholder="Enter your Poll ID"
                        value={pollId}
                        onChange={(e) => setPollId(e.target.value)}
                        required
                        className="flex-grow text-lg h-14"
                    />
                    <Button type="submit" size="lg" className="h-14 font-bold" disabled={!pollId.trim()}>
                        Join
                    </Button>
                </div>
            </form>
        </CardContent>
      </Card>

    </main>
  );
}
