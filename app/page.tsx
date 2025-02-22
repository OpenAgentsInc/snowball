"use client";

import {
    Authenticated, Unauthenticated, useMutation, useQuery
} from "convex/react"
import { Snowball } from "@/components/snowball"

export default function Home() {
  return (
    <main className="flex-1 p-4">
      <div className="mx-auto max-w-2xl">
        <Authenticated>
          <Snowball />
        </Authenticated>
        <Unauthenticated>
          <p>Click one of the buttons in the top right corner to sign in.</p>
        </Unauthenticated>
      </div>
    </main>
  );
}
