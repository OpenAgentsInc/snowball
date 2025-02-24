"use client";

import { useEffect, useState } from "react"
import { useRepoStore, useCodePaneStore } from "@/stores/repo-store"
import { useConversation } from "@11labs/react"
import { MessageInput } from "./message-input"
import { MessageList } from "@/components/ui/message-list"
import { RepoSelector } from "./repo-selector"
import { Card } from "@/components/ui/card"
import { MarkdownRenderer } from "@/components/ui/markdown-renderer"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  createdAt?: Date
}

export function Snowball() {
  const [isReady, setIsReady] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const getRepoState = useRepoStore.getState;
  const isCodePaneVisible = useCodePaneStore((state) => state.isCodePaneVisible);
  const codeContent = useCodePaneStore((state) => state.codeContent);
  const setCodeContent = useCodePaneStore((state) => state.setCodeContent);
  const toggleCodePane = useCodePaneStore((state) => state.toggleCodePane);

  const conversation = useConversation({
    onConnect: () => console.log("Connected"),
    onDisconnect: () => console.log("Disconnected"),
    onMessage: (message: { source: string, message: string }) => {
      if (message.source === 'ai' || message.source === 'user') {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: message.source === 'ai' ? 'assistant' : 'user',
          content: message.message,
          createdAt: new Date()
        }]);
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
            console.log("get_active_repo")
            const state = getRepoState();
            return "Active repo: " + state.owner + "/" + state.name + " " + state.branch;
          },
          show_code: async (data: { content?: string }) => {
            console.log("show_code", data)
            if (data.content) {
              setCodeContent(data.content);
            }
            toggleCodePane();
            return `Code pane is now ${isCodePaneVisible ? 'hidden' : 'visible'}`;
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
      <div className="flex h-[calc(100vh-8rem)] gap-6 px-6">
        <div className={`flex-1 flex flex-col ${isCodePaneVisible ? 'items-start' : 'items-center'}`}>
          <div className={`${isCodePaneVisible ? 'w-[600px]' : 'w-full max-w-lg'} h-full overflow-y-auto pb-24`}>
            <MessageList
              messages={messages}
              isTyping={conversation.isSpeaking}
              messageOptions={(message) => ({
                className: `${message.role === 'assistant' ? 'bg-secondary' : 'bg-primary text-primary-foreground'}`
              })}
            />
          </div>
        </div>

        {isCodePaneVisible && (
          <Card className="w-[600px] h-full overflow-y-auto">
            <div className="h-full prose prose-sm dark:prose-invert p-6">
              <MarkdownRenderer>
                {codeContent || ''}
              </MarkdownRenderer>
            </div>
          </Card>
        )}
      </div>

      <div className="fixed bottom-6 left-0 right-0 z-50">
        <div className={`mx-auto px-4 ${isCodePaneVisible ? 'w-[600px]' : 'max-w-lg'}`}>
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
      <RepoSelector />
    </>
  );
}
