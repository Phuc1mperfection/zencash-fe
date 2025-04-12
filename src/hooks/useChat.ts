import { useState } from "react";
import { sendMessageToAI } from "@/services/chatService";  // Đảm bảo đúng đường dẫn

export function useChat() {
    const [messages, setMessages] = useState<{ sender: string; content: string; timestamp: number }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
  
    // Removed unused 'history' variable
  
    const sendMessage = async (userMessage: string) => {
        const timestamp = new Date().getTime();
        
        // Thêm tin nhắn của người dùng vào lịch sử
        setMessages((prev) => [
          ...prev,
          { sender: "user", content: userMessage, timestamp },
        ]);
        setIsLoading(true);
      
        const history = messages.map(msg => `${msg.sender}: ${msg.content}`).join("\n");
        console.log("Conversation History:", history); // Logging lịch sử cuộc trò chuyện
        
        try {
          const aiResponse = await sendMessageToAI(userMessage, history.split("\n"));
          console.log("AI Response:", aiResponse); // Logging phản hồi từ AI
          
          // Thêm tin nhắn của bot vào lịch sử
          setMessages((prev) => [
            ...prev,
            { sender: "bot", content: aiResponse, timestamp: new Date().getTime() },
          ]);
        } catch (error) {
          setMessages((prev) => [
            ...prev,
            { sender: "bot", content: "Error: Unable to fetch response.", timestamp: new Date().getTime() },
          ]);
          console.error("Error sending message:", error);
        } finally {
          setIsLoading(false);
        }
      };
      
  
    return { messages, sendMessage, isLoading };
  }
  