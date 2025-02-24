"use client";

import { useEffect, useState } from "react"
import { useRepoStore } from "@/stores/repo-store"
import { useConversation } from "@11labs/react"
import { MessageInput } from "./message-input"

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
    <>
      <div className="flex flex-col items-center gap-4 mb-24">
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
      </div>
      <div className="fixed bottom-6 left-0 right-0 z-50">
        <div className="max-w-lg mx-auto px-4">
          <div className="shadow-lg rounded-xl">
            <MessageInput
              isReady={isReady}
              isConnected={conversation.status === "connected"}
              onStart={startConversation}
              onStop={endConversation}
            />
          </div>
        </div>
      </div>
    </>
  );
}
