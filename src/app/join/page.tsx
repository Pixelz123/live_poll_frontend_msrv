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
          <form onSubmit={handleJoinGame} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="pollId" className="font-bold">Poll ID</Label>
              <Input
                id="pollId"
                type="text"
                placeholder="e.g., quiz123"
                value={pollId}
                onChange={(e) => setPollId(e.target.value)}
                required
                className="text-center text-lg h-12"
              />
            </div>
            <Button type="submit" className="w-full font-bold" size="lg" disabled={!pollId.trim()}>
              Join Quiz
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
