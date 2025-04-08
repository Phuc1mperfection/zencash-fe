import axios from "axios";
import authService from "./authService";
const API_URL = "http://localhost:8080/api";

export const convertCurrency = async (targetCurrency: string) => {
  const accessToken = authService.getAccessToken();

  const response = await axios.patch(
    `${API_URL}/currency/convert`,
    { targetCurrency },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  // Cập nhật lại user info trong localStorage
  if (response.data) {
    const currentUser = authService.getCurrentUser();
    authService.setUserInfo({
      ...currentUser!,
      currency: targetCurrency,
    });
  }

  return response.data;
};
