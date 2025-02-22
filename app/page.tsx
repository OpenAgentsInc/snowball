"use client";

import {
    Authenticated, Unauthenticated, useMutation, useQuery
} from "convex/react"
import { Snowball } from "@/components/snowball"

export default function Home() {
  return (
    <div className="flex-1 p-4 flex justify-center">
      <div className="w-full max-w-2xl">
        <Authenticated>
          <Snowball />
        </Authenticated>
        <Unauthenticated>
          <p>Click one of the buttons in the top right corner to sign in.</p>
        </Unauthenticated>
      </div>
    </div>
  );
}