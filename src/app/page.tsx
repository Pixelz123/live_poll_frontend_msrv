import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Presentation, Users, FileQuestion } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary">
          QuizWhiz
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          The ultimate multiplayer quiz experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="items-center text-center">
            <Presentation className="w-12 h-12 text-accent mb-4" />
            <CardTitle className="font-headline text-2xl">Presenter View</CardTitle>
            <CardDescription>
              Host and control the quiz in real-time.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild size="lg" className="font-bold">
              <Link href="/presenter">Start Presenting</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="items-center text-center">
            <Users className="w-12 h-12 text-accent mb-4" />
            <CardTitle className="font-headline text-2xl">Player View</CardTitle>
            <CardDescription>
              Join the game and test your knowledge.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild size="lg" className="font-bold">
              <Link href="/player">Join Game</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300 md:col-span-2 lg:col-span-1">
          <CardHeader className="items-center text-center">
            <FileQuestion className="w-12 h-12 text-accent mb-4" />
            <CardTitle className="font-headline text-2xl">Question Preview</CardTitle>
            <CardDescription>
              See how a sample question will look.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild size="lg" className="font-bold">
              <Link href="/question-preview">Preview Question</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
