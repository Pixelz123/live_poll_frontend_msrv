import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ListChecks, UserPlus, Presentation } from "lucide-react";

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
        <Button asChild size="lg" className="font-bold text-lg py-8 px-10">
          <Link href="/player" className="flex flex-col items-center justify-center gap-2">
            <UserPlus className="w-8 h-8" />
            <span>Join Game</span>
          </Link>
        </Button>
      </div>
    </main>
  );
}
