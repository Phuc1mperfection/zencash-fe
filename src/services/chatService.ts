import { GoogleGenerativeAI } from "@google/generative-ai";
import { marked } from "marked";
import transactionService from "./transactionService";
import { formatCurrency } from "@/utils/currencyFormatter";

const GENAI_API_KEY = process.env.REACT_APP_API_GOOGLE_KEY;

// Function to handle specific financial queries
async function handleFinancialQuery(query: string) {
  const normalizedQuery = query.toLowerCase().trim();
  
  // Handle "show me my top expenses" query
  if (normalizedQuery.includes("top expenses") || normalizedQuery.includes("highest expenses")) {
    try {
      const topExpenses = await transactionService.getTopExpenses(10);
      
      if (!topExpenses || topExpenses.length === 0) {
        return "You don't have any expenses recorded yet. Start adding transactions to track your expenses.";
      }
      
      let responseHTML = "<strong>Your Top Expenses:</strong><br><table style='width:100%; border-collapse: collapse;'>";
      responseHTML += "<tr><th style='text-align:left; padding:8px;'>Description</th><th style='text-align:right; padding:8px;'>Amount</th></tr>";
      
      topExpenses.forEach((expense) => {
        responseHTML += `<tr><td style='text-align:left; padding:8px;'>${expense.note}</td><td style='text-align:right; padding:8px;'>${formatCurrency(expense.amount)}</td></tr>`;
      });
      
      responseHTML += "</table>";
      return responseHTML;
    } catch (error) {
      console.error("Error fetching top expenses:", error);
      return "Sorry, I couldn't retrieve your top expenses at the moment. Please try again later.";
    }
  }
  
  // Return null if this isn't a recognized financial query
  return null;
}

export async function sendMessageToAI(message: string, history: string[]) {
  try {
    // First check if this is a specific financial query we can handle
    const specialResponse = await handleFinancialQuery(message);
    if (specialResponse) {
      return specialResponse;
    }
    
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

    // Tạo response
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // Sử dụng Markdown để xử lý text
    const html = marked.parse(text);
    return html;
  } catch (error) {
    console.error("Error in sendMessageToAI:", error);
    return "Sorry, I couldn't process your request. Please try again later.";
  }
}
