"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { type IRegistrationWithDetails } from "~/server/db/schema";
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
import { onKickUserAction } from "./actions";

export const registrationColumns: ColumnDef<IRegistrationWithDetails>[] = [
  {
    accessorKey: "userName",
    header: "User Name",
  },
  {
    accessorKey: "eventName",
    header: "Event Name",
  },
  {
    accessorKey: "eventType",
    header: "Event Type",
  },
  {
    accessorKey: "bracketType",
    header: "Bracket Type",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const registration: IRegistrationWithDetails = row.original;

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
            <DropdownMenuItem>
              <form action={() => onKickUserAction(registration)}>
                <button type="submit">Kick User</button>
              </form>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
