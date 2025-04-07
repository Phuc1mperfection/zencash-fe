import { GoogleGenerativeAI } from "@google/generative-ai";
import { marked } from "marked";
const GENAI_API_KEY = process.env.REACT_APP_API_GOOGLE_KEY;

export async function sendMessageToAI(message: string, history: string[]) {
  try {
    if (!GENAI_API_KEY) {
      throw new Error("GENAI_API_KEY is not defined");
    }

    const genAI = new GoogleGenerativeAI(GENAI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.1,  // Tùy chọn để kiểm soát độ ngẫu nhiên trong phản hồi
      },
    });

    const isEnglish = /^[A-Za-z0-9\s,.'-]*$/.test(message); // Kiểm tra nếu câu có chứa các ký tự tiếng Anh
    let prompt;

    if (isEnglish) {
        // remove cái html tag trong message cho prompt
      prompt = `${history.join("\n")}\nUser: ${message}\nAI (Please respond in English):`;
    } else {
      prompt = `${history.join("\n")}\nUser: ${message}\nAI (Vui lòng trả lời bằng tiếng Việt):`;
    }

    const result = await model.generateContent(prompt);

    if (!result.response || typeof result.response.text !== 'function') {
      console.error("API response is invalid:", result);
      throw new Error("Invalid API response: Missing 'response.text'");
    }
    const responseText = marked(await result.response.text()); // Sử dụng marked để chuyển đổi HTML sang Markdown nếu cần thiết
    return responseText;
  } catch (error) {
    console.error("Error in sending message to AI:", error);
    throw error;
  }
}
