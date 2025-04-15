import api from './api';

interface IconServiceResponse {
  status: 'success' | 'error';
  data: string[] | null;
  error?: string;
}

// Backend server URL - needed for API endpoints
const SERVER_URL = "http://localhost:8080";

const getIcons = async (): Promise<IconServiceResponse> => {
  try {
    // The backend returns icon filenames or paths
    const response = await api.get('/icons');
    
    if (Array.isArray(response.data)) {
      return {
        status: 'success',
        data: response.data
      };
    } else {
      return {
        status: 'error',
        data: null,
        error: 'Invalid response from server'
      };
    }
  } catch (error) {
    console.error('Error fetching icons:', error);
    return {
      status: 'error',
      data: null,
      error: 'Failed to load icons'
    };
  }
};

// Function to create direct icon URLs through the secure API endpoint
const getIconUrl = (iconName: string): string => {
  if (!iconName) return '';
  
  // If it's already a full URL, return it as is
  if (iconName.startsWith('http')) {
    return iconName;
  }
  
  // Extract just the filename from any path
  const filename = iconName.split('/').pop() || iconName;
  
  // Use the API endpoint to fetch icons (which should be authorized)
  return `${SERVER_URL}/api/icons/${filename}`;
};

const iconService = {
  getIcons,
  getIconUrl
};

export default iconService;