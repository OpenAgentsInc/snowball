"use client";

import { Mic, MicOff } from "lucide-react"
import { useEffect, useState } from "react"
import { useConversation } from "@11labs/react"
import { Button } from "./ui/button"

export function Snowball() {
  const [isReady, setIsReady] = useState(false);
  const [lastMessage, setLastMessage] = useState("");
  const conversation = useConversation({
    onConnect: () => console.log("Connected"),
    onDisconnect: () => console.log("Disconnected"),
    onMessage: (message) => {
      if (message.source === 'ai') {
        setLastMessage(message.message);
      }
    },
    onError: (error) => console.error("Error:", error),
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
      });
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  };

  const endConversation = async () => {
    try {
      await conversation.endSession();
      setLastMessage("");
    } catch (error) {
      console.error("Failed to end conversation:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full fixed gap-4">
      <div className="flex flex-col items-center justify-center gap-2">
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

      {lastMessage && (
        <div className="max-w-lg p-4 rounded-lg bg-secondary">
          {lastMessage}
        </div>
      )}

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
