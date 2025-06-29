"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserPlus } from "lucide-react";

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
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <Link href="/" className="absolute top-4 left-4 text-primary hover:underline">
        &larr; Back to Home
      </Link>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <UserPlus className="w-12 h-12 text-primary" />
          </div>
          <CardTitle className="font-headline text-4xl">Join a Game</CardTitle>
          <CardDescription>
            Enter the Poll ID provided by the presenter to join the quiz.
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
                    Join Quiz
                </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
