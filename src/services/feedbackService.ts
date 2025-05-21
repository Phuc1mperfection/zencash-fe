import api from './api';

interface FeedbackRequest {
  userEmail: string;
  message: string;
}

export const feedbackService = {
  sendFeedback: async (data: FeedbackRequest) => {
    try {
      const response = await api.post('/feedback', data);
      return response.data;
    } catch (error) {
      console.error('Error sending feedback:', error);
      throw error;
    }
  }
};

export default feedbackService;
