import { useState } from "react";
import { Bot, X, MessageSquare, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useChat } from "@/hooks/useChat";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

const suggestedQuestions = [
  "How can I reduce my spending?",
  "What is my budget status?",
  "Show me my top expenses",
  "How do I create a budget?",
];

export function ChatAssistant() {
  const { messages, sendMessage, isLoading } = useChat();
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
    sendMessage(question);
    setInput("");
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <Card
          className={cn(
            "w-80 md:w-96 shadow-xl transition-all duration-300 ease-in-out",
            isMinimized ? "h-16" : "h-[500px]"
          )}
        >
          <CardHeader className="p-3 flex flex-row items-center justify-between border-b">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <Bot size={18} className="text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-sm">Financial Assistant</h3>
                <Badge variant="outline" className="text-xs">
                  AI Powered
                </Badge>
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={toggleMinimize}
              >
                {isMinimized ? (
                  <Maximize2 size={14} />
                ) : (
                  <Minimize2 size={14} />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={toggleChat}
              >
                <X size={14} />
              </Button>
            </div>
          </CardHeader>

          {!isMinimized && (
            <>
             <CardContent className="p-0 flex flex-col h-[calc(100%-120px)]">
  <div className="flex-1 overflow-y-auto p-4 space-y-4">
    {messages.map((message, index) => {
      const timestamp = new Date(message.timestamp);
      const formattedTime = !isNaN(timestamp.getTime())
        ? timestamp.toLocaleTimeString([], {
            weekday: "short",
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "";

      return (
        <div
          key={index}
          className={cn(
            "flex flex-col max-w-[85%] rounded-lg p-3 text-sm",
            message.sender === "user"
              ? "bg-primary text-primary-foreground ml-auto"
              : "bg-muted self-start"
          )}
        >
          {/* Sử dụng dangerouslySetInnerHTML để hiển thị HTML */}
          <div dangerouslySetInnerHTML={{ __html: message.content }} />
          
          <span className="text-xs opacity-70 mt-1 self-end">
            {formattedTime}
          </span>
        </div>
      );
    })}
  </div>

  {messages.length === 1 && (
    <div className="p-4 border-t">
      <h4 className="text-sm font-medium mb-2">Suggested questions:</h4>
      <div className="flex flex-wrap gap-2">
        {suggestedQuestions.map((question) => (
          <Button
            key={question}
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => handleSuggestedQuestion(question)}
          >
            {question}
          </Button>
        ))}
      </div>
    </div>
  )}
</CardContent>


              <div className="p-2 border-t ">
                <div className="flex items-center justify-center space-x-2 ">
                  <Input
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                  />
                  <Button
                    size="icon"
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                  >
                    <Send size={16} />
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      ) : (
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg"
          onClick={toggleChat}
        >
          <MessageSquare size={24} />
        </Button>
      )}
    </div>
  );
}
