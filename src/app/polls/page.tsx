"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { List, Presentation, ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PollSummary {
  _id: string;
  poll_name: string;
}

export default function PollsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [polls, setPolls] = useState<PollSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPolls() {
      if (!user || !user.token) {
        setIsLoading(false);
        return;
      }
      
      try {
        const response = await fetch(`http://localhost:8851/user/api/getUserPolls/${user.username}`, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch polls from the server.");
        }
        
        const data: PollSummary[] = await response.json();
        
        setPolls(data);
      } catch (error) {
        console.error("Error fetching polls:", error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Could not fetch your polls.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchPolls();
  }, [user, toast]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <Card>
          <CardContent className="p-10 text-center flex items-center justify-center">
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            <p className="text-muted-foreground">Loading your polls...</p>
          </CardContent>
        </Card>
      );
    }

    if (polls.length === 0) {
      return (
        <Card>
          <CardContent className="p-10 text-center">
            <p className="text-muted-foreground">
              You haven't created any polls yet.
            </p>
            <Button asChild className="mt-4">
              <Link href="/create-quiz">Create Your First Quiz</Link>
            </Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        {polls.map((poll) => (
          <Card key={poll._id} className="transition-all hover:shadow-md">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="hidden sm:block p-3 rounded-lg bg-secondary">
                  <List className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-headline text-xl font-semibold">{poll.poll_name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">ID: {poll._id}</p>
                </div>
              </div>
              <Button asChild>
                <Link href={`/presenter?pollId=${poll._id}`}>
                  <Presentation className="mr-2" />
                  Start Presenting
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-background to-secondary p-4 sm:p-8">
      <div className="absolute top-6 left-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-in fade-in-50 duration-500">
          <div className="inline-block rounded-full bg-primary/10 p-4 mb-4">
            <List className="h-10 w-10 text-primary" />
          </div>
          <h1 className="font-headline text-5xl md:text-6xl font-bold text-primary">
            Available Polls
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Choose a quiz to present to your audience.
          </p>
        </div>

        <div className="w-full animate-in fade-in-50 slide-in-from-bottom-10 duration-500">
          {renderContent()}
        </div>
      </div>
    </main>
  );
}
