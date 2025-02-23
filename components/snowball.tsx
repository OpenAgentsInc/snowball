"use client";

import { Mic, MicOff } from "lucide-react"
import { useEffect, useState } from "react"
import { useRepoStore } from "@/stores/repo-store"
import { useConversation } from "@11labs/react"
import { Button } from "./ui/button"

export function Snowball() {
  const [isReady, setIsReady] = useState(false);
  const [messages, setMessages] = useState<{ source: string, message: string }[]>([]);
  const getRepoState = useRepoStore.getState;

  const conversation = useConversation({
    onConnect: () => console.log("Connected"),
    onDisconnect: () => console.log("Disconnected"),
    onMessage: (message: { source: string, message: string }) => {
      if (message.source === 'ai' || message.source === 'user') {
        setMessages(prev => [...prev, message]);
      }
    },
    onError: (error: Error) => console.error("Error:", error),
  });

  useEffect(() => {
    const initMicrophone = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setIsReady(true);
      } catch (error) {
        console.error("Microphone access denied:", error);
      }
    };

    initMicrophone();
  }, []);

  const startConversation = async () => {
    try {
      await conversation.startSession({
        agentId: "mNBnpV3KW6ihP9j1BbTT",
        clientTools: {
          get_active_repo: async () => {
            const state = getRepoState();
            return "Active repo: " + state.owner + "/" + state.name + " " + state.branch;
          }
        },
      });
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  };

  const endConversation = async () => {
    try {
      await conversation.endSession();
      setMessages([]);
    } catch (error) {
      console.error("Failed to end conversation:", error);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2">
        {conversation.status === "disconnected" ? (
          <Button
            onClick={startConversation}
            disabled={!isReady}
            className="flex items-center gap-2"
          >
            <Mic className="w-4 h-4" />
            Start Conversation
          </Button>
        ) : (
          <Button
            onClick={endConversation}
            variant="destructive"
            className="flex items-center gap-2"
          >
            <MicOff className="w-4 h-4" />
            End Conversation
          </Button>
        )}
      </div>

      <div className="w-full max-w-lg space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-4 rounded-lg ${msg.source === 'ai'
              ? 'bg-secondary'
              : 'bg-primary text-primary-foreground'
              }`}
          >
            {msg.message}
          </div>
        ))}
      </div>

      <div className="text-sm text-muted-foreground">
        {!isReady
          ? "Please allow microphone access"
          : conversation.status === "connected"
            ? conversation.isSpeaking
              ? "Snowball is speaking..."
              : "Listening..."
            : "Ready to start"}
      </div>
    </div>
  );
}
