import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { List, Presentation, ArrowLeft } from "lucide-react";

// Dummy data for available polls
const availablePolls = [
  { id: "quiz123", name: "General Knowledge Trivia", questions: 15, difficulty: "Medium" },
  { id: "sciFiFun", name: "Science Fiction Facts", questions: 20, difficulty: "Hard" },
  { id: "historyBuff", name: "World History Challenge", questions: 10, difficulty: "Easy" },
];

export default function PollsPage() {
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
          {availablePolls.length > 0 ? (
            <div className="space-y-4">
              {availablePolls.map((poll) => (
                <Card key={poll.id} className="transition-all hover:shadow-md">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:block p-3 rounded-lg bg-secondary">
                                <List className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-headline text-xl font-semibold">{poll.name}</h3>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                    <span>{poll.questions} Questions</span>
                                    <span>&bull;</span>
                                    <span>Difficulty: {poll.difficulty}</span>
                                </div>
                            </div>
                        </div>
                        <Button asChild>
                            <Link href={`/presenter?pollId=${poll.id}`}>
                                <Presentation className="mr-2" />
                                Start Presenting
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
              ))}
            </div>
          ) : (
             <Card>
                <CardContent className="p-10 text-center">
                    <p className="text-muted-foreground">
                        No active polls at the moment. Please check back later.
                    </p>
                </CardContent>
             </Card>
          )}
        </div>
      </div>
    </main>
  );
}
