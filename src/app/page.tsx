"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ListChecks, Presentation, UserPlus, Zap, FilePlus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const [pollId, setPollId] = useState("");
  const router = useRouter();
  const { user } = useAuth();

  const handleJoinGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (pollId.trim()) {
      router.push(`/player?pollId=${pollId.trim()}`);
    }
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-background via-secondary/50 to-background p-4">
      <div className="absolute top-4 right-4">
        <Button variant="ghost" size="sm">v1.0.0</Button>
      </div>
      <div className="text-center mb-16 animate-in fade-in-50 slide-in-from-top-10 duration-500">
        <div className="inline-block rounded-full bg-primary/10 p-4 mb-4">
          <Zap className="h-10 w-10 text-primary" />
        </div>
        <h1 className="font-headline text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
          QuizWhiz
        </h1>
        <p className="text-muted-foreground mt-2 text-lg md:text-xl">
          The ultimate multiplayer quiz experience.
        </p>
      </div>

      <div className="grid w-full max-w-4xl grid-cols-1 gap-8 md:grid-cols-2 animate-in fade-in-50 slide-in-from-bottom-10 duration-500">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Presentation className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="font-headline text-2xl">Presenter</CardTitle>
                <CardDescription>Create & host quizzes</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button asChild size="lg" className="w-full">
              <Link href="/create-quiz">
                <FilePlus className="mr-2" /> Create New Quiz
              </Link>
            </Button>
            {user && (
              <Button asChild size="lg" variant="secondary" className="w-full">
                <Link href="/polls">
                  <ListChecks className="mr-2" /> View Available Polls
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-4">
               <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <UserPlus className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="font-headline text-2xl">Player</CardTitle>
                <CardDescription>Join a game and play</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleJoinGame} className="w-full space-y-3">
                <Label htmlFor="pollId" className="sr-only">Poll ID</Label>
                <Input
                    id="pollId"
                    type="text"
                    placeholder="Enter your Poll ID..."
                    value={pollId}
                    onChange={(e) => setPollId(e.target.value)}
                    required
                    className="flex-grow text-lg h-14 text-center font-mono tracking-widest"
                />
                <Button type="submit" size="lg" className="w-full h-14 font-bold" disabled={!pollId.trim()}>
                    Join Quiz
                </Button>
            </form>
          </CardContent>
        </Card>
      </div>

    </main>
  );
}
