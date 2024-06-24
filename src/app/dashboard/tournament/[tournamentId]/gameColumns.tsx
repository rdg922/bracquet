"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { type IGameWithDetails } from "~/server/db/schema";
import { MoreHorizontal } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export const gameColumns: ColumnDef<IGameWithDetails>[] = [
  {
    accessorKey: "eventName",
    header: "Event Name",
  },
  {
    accessorKey: "startTime",
    header: "Start Time",
    cell: ({ row }) => {
      const game: IGameWithDetails = row.original;
      if (!game.startTime) return "TBD";
      return new Date(game.startTime).toLocaleString();
    },
  },
  {
    accessorKey: "venue",
    header: "Venue",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "player1Name",
    header: "Player 1",
  },
  {
    accessorKey: "player2Name",
    header: "Player 2",
  },
  {
    accessorKey: "winnerOfMatch",
    header: "Winner",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const game: IGameWithDetails = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                alert(
                  "This game result will be edited (not implemented): " +
                    game.gameId,
                )
              }
            >
              Edit Result
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
