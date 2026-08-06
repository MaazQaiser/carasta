"use client";

import React, { useState } from "react";
import { Send, Image as ImageIcon } from "lucide-react";
import type { Conversation, Message } from "@carasta/types";
import { messageService } from "@carasta/mock-data/services";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn, formatRelativeTime, formatPrice } from "@/lib/utils";
import { useAuth } from "@/lib/context/auth-context";

interface Props { conversations: Conversation[] }

export function MessagesClient({ conversations }: Props) {
  const { user } = useAuth();
  const [selected, setSelected] = useState<string | null>(conversations[0]?.id ?? null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [loadedConv, setLoadedConv] = useState<string | null>(null);

  const selectConv = async (id: string) => {
    setSelected(id);
    if (loadedConv !== id) {
      const msgs = await messageService.getMessages(id);
      setMessages(msgs);
      setLoadedConv(id);
    }
  };

  React.useEffect(() => {
    if (conversations[0]?.id) selectConv(conversations[0].id);
  }, []);

  const activeConv = conversations.find((c) => c.id === selected);
  const otherParticipant = activeConv?.participants.find((p) => p.id !== user?.id);

  const sendMessage = () => {
    if (!text.trim() || !selected || !user) return;
    const msg: Message = {
      id: `msg-${Date.now()}`,
      conversationId: selected,
      sender: user,
      type: "text",
      content: text,
      isRead: true,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, msg]);
    setText("");
  };

  return (
    <div className="mx-auto max-w-screen-2xl px-4 lg:px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      <div className="flex h-[calc(100vh-16rem)] rounded-2xl border overflow-hidden">
        {/* Conversation list */}
        <div className="w-80 shrink-0 border-r overflow-y-auto bg-card">
          {conversations.map((conv) => {
            const other = conv.participants.find((p) => p.id !== user?.id);
            return (
              <button
                key={conv.id}
                onClick={() => selectConv(conv.id)}
                className={cn(
                  "flex items-start gap-3 p-4 w-full text-left border-b hover:bg-accent transition-colors",
                  selected === conv.id && "bg-accent"
                )}
              >
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarImage src={other?.avatar?.url} alt={other?.displayName} />
                  <AvatarFallback>{other?.displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm truncate">{other?.displayName}</span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {conv.lastMessage && formatRelativeTime(conv.lastMessage.createdAt)}
                    </span>
                  </div>
                  {conv.linkedVehicle && (
                    <p className="text-xs text-primary truncate">Re: {conv.linkedVehicle.title}</p>
                  )}
                  {conv.lastMessage && (
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{conv.lastMessage.content ?? "(attachment)"}</p>
                  )}
                  {conv.unreadCount > 0 && (
                    <Badge className="mt-1 h-4 px-1.5 text-[10px]">{conv.unreadCount}</Badge>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Conversation thread */}
        <div className="flex-1 flex flex-col bg-background">
          {activeConv && otherParticipant ? (
            <>
              {/* Header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b bg-card">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={otherParticipant.avatar?.url} alt={otherParticipant.displayName} />
                  <AvatarFallback className="text-xs">{otherParticipant.displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm">{otherParticipant.displayName}</p>
                  {activeConv.linkedVehicle && (
                    <p className="text-xs text-muted-foreground">{activeConv.linkedVehicle.title}</p>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {activeConv.linkedVehicle && (
                  <div className="flex justify-center">
                    <div className="flex items-center gap-3 p-3 rounded-xl border bg-card max-w-xs">
                      <div className="h-12 w-16 rounded-lg overflow-hidden bg-muted shrink-0">
                        {activeConv.linkedVehicle.images[0] && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={activeConv.linkedVehicle.images[0].url} alt={activeConv.linkedVehicle.title} className="h-full w-full object-cover" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-medium line-clamp-1">{activeConv.linkedVehicle.title}</p>
                        <p className="text-xs text-muted-foreground">{formatPrice(activeConv.linkedVehicle.startingPrice)}</p>
                      </div>
                    </div>
                  </div>
                )}

                {messages.map((msg) => {
                  const isMe = msg.sender.id === user?.id;
                  return (
                    <div key={msg.id} className={cn("flex items-end gap-2", isMe ? "justify-end" : "justify-start")}>
                      {!isMe && (
                        <Avatar className="h-6 w-6 shrink-0">
                          <AvatarImage src={msg.sender.avatar?.url} alt={msg.sender.displayName} />
                          <AvatarFallback className="text-[10px]">{msg.sender.displayName.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                      )}
                      <div className={cn(
                        "max-w-[70%] px-3 py-2 rounded-2xl text-sm",
                        isMe ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-muted rounded-bl-sm"
                      )}>
                        {msg.content}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input */}
              <div className="flex items-center gap-2 px-4 py-3 border-t bg-card">
                <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8">
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <Input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type a message…"
                  className="h-9"
                  onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
                />
                <Button size="icon" className="shrink-0 h-9 w-9" onClick={sendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Send className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="font-semibold mb-1">Select a conversation</p>
              <p className="text-sm text-muted-foreground">Choose from your messages on the left</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
