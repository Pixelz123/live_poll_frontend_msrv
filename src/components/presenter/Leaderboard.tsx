"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Player } from "@/lib/quiz-data";
import { ArrowDown, ArrowUp, Minus, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaderboardProps {
  players: Player[];
}

export function Leaderboard({ players }: LeaderboardProps) {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  const getRankColor = (rank: number) => {
    if (rank === 0) return "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300";
    if (rank === 1) return "bg-slate-100 text-slate-800 dark:bg-slate-800/50 dark:text-slate-300";
    if (rank === 2) return "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-400";
    return "";
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center justify-center gap-3">
            <Trophy className="w-6 h-6 text-primary"/>
            Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Rank</TableHead>
              <TableHead>Player</TableHead>
              <TableHead className="text-right">Score</TableHead>
              <TableHead className="text-right w-[100px]">Change</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPlayers.length > 0 ? sortedPlayers.map((player, index) => (
              <TableRow key={player.id} className={cn('font-medium', getRankColor(index))}>
                <TableCell className="text-center">
                    <span className="font-bold text-lg">{index + 1}</span>
                </TableCell>
                <TableCell>{player.name}</TableCell>
                <TableCell className="text-right font-mono tabular-nums">{player.score}</TableCell>
                <TableCell className="text-right">
                  <span className="flex items-center justify-end font-mono tabular-nums">
                    {player.change > 0 ? (
                      <>
                        <span className="text-green-500">+{player.change}</span>
                        <ArrowUp className="h-4 w-4 text-green-500 ml-1" />
                      </>
                    ) : player.change < 0 ? (
                      <>
                        <span className="text-red-500">{player.change}</span>
                        <ArrowDown className="h-4 w-4 text-red-500 ml-1" />
                      </>
                    ) : (
                      <Minus className="h-4 w-4 text-muted-foreground" />
                    )}
                  </span>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  No players have joined yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
