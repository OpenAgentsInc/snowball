"use client";

import { useConversation } from "@11labs/react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";

export function Snowball() {
  const [isReady, setIsReady] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const conversation = useConversation({
    onConnect: () => console.log("Connected"),
    onDisconnect: () => console.log("Disconnected"),
    onMessage: (message) => console.log("Message:", message),
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
    } catch (error) {
      console.error("Failed to end conversation:", error);
    }
  };

  const toggleMute = async () => {
    try {
      await conversation.setVolume({ volume: isMuted ? 1 : 0 });
      setIsMuted(!isMuted);
    } catch (error) {
      console.error("Failed to toggle mute:", error);
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

        <Button
          onClick={toggleMute}
          variant="outline"
          className="flex items-center gap-2"
          disabled={conversation.status === "disconnected"}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
          {isMuted ? "Unmute" : "Mute"}
        </Button>
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