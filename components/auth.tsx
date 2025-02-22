"use client"

import {
    Authenticated, Unauthenticated, useMutation, useQuery
} from "convex/react"
import { Button } from "@/components/ui/button"
import {
    SignInButton, SignUpButton, UserButton, UserProfile
} from "@clerk/nextjs"

export function SignInAndSignUpButtons() {
  return (
    <div className="flex gap-4">
      <Authenticated>
        <UserButton afterSignOutUrl="#" />
      </Authenticated>
      <Unauthenticated>
        <SignInButton mode="modal">
          <Button variant="ghost">Sign in</Button>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button>Sign up</Button>
        </SignUpButton>
      </Unauthenticated>
    </div>
  );
}
