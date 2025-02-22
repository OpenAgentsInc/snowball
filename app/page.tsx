"use client";

import {
    Authenticated, Unauthenticated, useMutation, useQuery
} from "convex/react"
import { Snowball } from "@/components/snowball"

export default function Home() {
  return (
    <>
      <main className="container max-w-2xl flex flex-col gap-8">
        <Authenticated>
          <Snowball />
        </Authenticated>
        <Unauthenticated>
          <p>Click one of the buttons in the top right corner to sign in.</p>
        </Unauthenticated>
      </main>
    </>
  );
}
