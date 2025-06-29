
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { List } from "lucide-react";

// Dummy data for available polls
const availablePolls = [
  { id: "quiz123", name: "General Knowledge Trivia" },
];

export default function PollsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <Link href="/" className="absolute top-4 left-4 text-primary hover:underline">
        &larr; Back to Home
      </Link>
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary">
          Available Polls
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Choose a quiz to present.
        </p>
      </div>

      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <List className="w-6 h-6" />
              <span>Available Quizzes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {availablePolls.length > 0 ? (
              <ul className="space-y-4">
                {availablePolls.map((poll) => (
                  <li key={poll.id} className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                    <span className="font-medium">{poll.name}</span>
                    <Button asChild>
                      <Link href={`/presenter?pollId=${poll.id}`}>Start Presenting</Link>
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-center">
                No active polls at the moment. Please check back later.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
