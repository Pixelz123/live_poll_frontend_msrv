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
import { ArrowDown, ArrowUp, Minus } from "lucide-react";

interface LeaderboardProps {
  players: Player[];
}

export function Leaderboard({ players }: LeaderboardProps) {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-center">Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Rank</TableHead>
              <TableHead>Player</TableHead>
              <TableHead className="text-right">Score</TableHead>
              <TableHead className="text-right w-[80px]">Change</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPlayers.map((player, index) => (
              <TableRow key={player.id} className={index < 3 ? 'font-bold' : ''}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{player.name}</TableCell>
                <TableCell className="text-right">{player.score}</TableCell>
                <TableCell className="text-right">
                  <span className="flex items-center justify-end">
                    {player.change > 0 ? (
                      <>
                        <span className="text-green-500">{player.change}</span>
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
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
