"use client";

import {
  Authenticated, Unauthenticated, useMutation, useQuery
} from "convex/react"
import { Snowball } from "@/components/snowball"

export default function Home() {
  return (
    <div className="w-full p-4 flex justify-center">
      <div className="w-full max-w-2xl flex flex-col items-center justify-center">
        <Authenticated>
          <Snowball />
        </Authenticated>
        <Unauthenticated>
          <p className="mt-8 text-white/70">Click one of the buttons in the top right corner to sign in.</p>
        </Unauthenticated>
      </div>
    </div>
  );
}
