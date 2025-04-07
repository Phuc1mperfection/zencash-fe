
import { GoogleGenerativeAI } from "@google/generative-ai";

const GENAI_API_KEY = process.env.REACT_APP_API_GOOGLE_KEY;

export async function sendMessageToAI(message: string) {
  try {
    if (!GENAI_API_KEY) {
      throw new Error("GENAI_API_KEY is not defined");
    }
    const genAI = new GoogleGenerativeAI(GENAI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.1,  // Tùy chọn để kiểm soát độ ngẫu nhiên trong phản hồi
      },
    });

    const prompt = `${message}. Trả về kết quả là định dạng text/plain`;
    const result = await model.generateContent(prompt);

    // Kiểm tra response trước khi xử lý
    if (!result.response || typeof result.response.text !== 'function') {
      console.error("API response is invalid:", result);
      throw new Error("Invalid API response: Missing 'response.text'");
    }

    // Gọi phương thức text() để lấy nội dung
    const responseText = await result.response.text();

    return responseText;
  } catch (error) {
    console.error("Error in sending message to AI:", error);
    throw error;  // Để lỗi có thể được catch trong component gọi đến
  }
}
