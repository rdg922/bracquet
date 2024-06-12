import React from "react";
import {
  SignedOut,
  SignedIn,
  SignInButton,
  SignOutButton,
} from "@clerk/nextjs";
import { Button } from "./ui/button";

export default function TopNav() {
  return (
    <nav className="flex items-center justify-between bg-background text-xl font-semibold">
      <h1>Bracquet</h1>
      <div>
        <SignedOut>
          <SignInButton>
            <Button>Sign In</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <SignOutButton>
            <Button>Sign Out</Button>
          </SignOutButton>
        </SignedIn>
      </div>
    </nav>
  );
}
