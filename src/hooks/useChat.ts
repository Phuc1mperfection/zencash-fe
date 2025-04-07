import { useState } from "react";
import { sendMessageToAI } from "@/services/chatService";  // Đảm bảo đúng đường dẫn

export function useChat() {
  const [messages, setMessages] = useState<{ sender: string; content: string; timestamp: number }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (userMessage: string) => {
    const timestamp = new Date().getTime();
    
    // Thêm tin nhắn của người dùng vào lịch sử
    setMessages((prev) => [
      ...prev,
      { sender: "user", content: userMessage, timestamp },
    ]);
    setIsLoading(true);

    try {
      const aiResponse = await sendMessageToAI(userMessage);  // Gọi API Google Generative AI
      // Thêm tin nhắn của bot vào lịch sử
      setMessages((prev) => [
        ...prev,
        { sender: "bot", content: aiResponse, timestamp: new Date().getTime() },
      ]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", content: "Error: Unable to fetch response.", timestamp: new Date().getTime() },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, sendMessage, isLoading };
}
