"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserPlus, ArrowLeft } from "lucide-react";

export default function JoinGamePage() {
  const [pollId, setPollId] = useState("");
  const router = useRouter();

  const handleJoinGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (pollId.trim()) {
      router.push(`/player?pollId=${pollId.trim()}`);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-b from-background to-secondary">
      <div className="absolute top-6 left-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
      <Card className="w-full max-w-md shadow-2xl animate-in fade-in-50 zoom-in-95 duration-500">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UserPlus className="w-8 h-8" />
          </div>
          <CardTitle className="font-headline text-4xl">Join a Game</CardTitle>
          <CardDescription>
            Enter the Poll ID provided by the presenter to join the quiz.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleJoinGame} className="w-full space-y-4">
            <div>
                <Label htmlFor="pollId" className="sr-only">Poll ID</Label>
                <Input
                    id="pollId"
                    type="text"
                    placeholder="Enter your Poll ID"
                    value={pollId}
                    onChange={(e) => setPollId(e.target.value)}
                    required
                    className="flex-grow text-lg h-14 text-center tracking-widest font-mono"
                />
            </div>
            <Button type="submit" size="lg" className="h-14 w-full font-bold text-lg" disabled={!pollId.trim()}>
                Join Quiz
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
