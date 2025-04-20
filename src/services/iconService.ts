import api from './api';

interface IconServiceResponse {
  status: 'success' | 'error';
  data: string[] | null;
  error?: string;
}

// Backend server URL - needed for API endpoints
const SERVER_URL = "http://localhost:8080";

// Font Awesome CDN URL - add to the index.html or dynamically load as needed
const FONT_AWESOME_CDN = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";

// Function to load Font Awesome if not already loaded
const loadFontAwesomeCDN = () => {
  if (document.querySelector('link[href*="font-awesome"]')) {
    return Promise.resolve(); // Already loaded
  }

  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = FONT_AWESOME_CDN;
    link.onload = () => resolve(undefined);
    link.onerror = () => reject(new Error('Failed to load Font Awesome CSS'));
    document.head.appendChild(link);
  });
};

// Function to get icons from API or predefined set
const getIcons = async (): Promise<IconServiceResponse> => {
  try {
    // Ensure Font Awesome is loaded
    await loadFontAwesomeCDN();
    
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

// Function to create direct icon URLs through the secure API endpoint or handle Font Awesome classes
const getIconUrl = (iconName: string): string => {
  if (!iconName) return '';
  
  // If it's already a full URL, return it as is
  if (iconName.startsWith('http')) {
    return iconName;
  }
  
  // If it's a Font Awesome class (e.g., "fas fa-user"), return it as is
  if (iconName.startsWith('fa') && iconName.includes('fa-')) {
    return iconName;
  }
  
  // Extract just the filename from any path
  const filename = iconName.split('/').pop() || iconName;
  
  // Use the API endpoint to fetch icons (which should be authorized)
  return `${SERVER_URL}/api/icons/${filename}`;
};

// Function to search Font Awesome icons
const searchFontAwesomeIcons = async (searchTerm: string): Promise<string[]> => {
  // In a real implementation, you would fetch the list from a backend API
  // For simplicity, we're returning a hardcoded list of matching icons
  const fontAwesomeIcons = [
    "fas fa-user", "fas fa-home", "fas fa-cog",
    "far fa-user", "far fa-calendar", "far fa-file",
    "fab fa-facebook", "fab fa-twitter", "fab fa-github"
    // Add more icons as needed
  ];
  
  if (!searchTerm) return fontAwesomeIcons;
  
  return fontAwesomeIcons.filter(icon => 
    icon.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

// Function to render an icon (either as an <i> element or as an <img>)
const renderIcon = (iconName: string, className?: string): HTMLElement => {
  const element = document.createElement('div');
  
  if (!iconName) {
    return element; // Empty div if no icon
  }
  
  // Log for debugging
  
  if (iconName.startsWith('http')) {
    // Create an img element for URL-based icons
    const img = document.createElement('img');
    img.src = iconName;
    img.alt = "Icon";
    img.className = className || "";
    element.appendChild(img);
  } else if (iconName.startsWith('fa') && iconName.includes('fa-')) {
    // Create an i element for Font Awesome icons
    const i = document.createElement('i');
    i.className = `${iconName} ${className || ""}`;
    element.style.display = 'flex';
    element.style.alignItems = 'center';
    element.style.justifyContent = 'center';
    i.style.fontSize = '18px'; 
    i.style.color = 'var(--primary)';
    element.appendChild(i);
  } else {
    try {
      // Treat as a traditional icon from the server
      const img = document.createElement('img');
      img.src = getIconUrl(iconName);
      img.alt = "Icon";
      img.className = className || "";
      img.onerror = () => {
        console.error("Failed to load icon:", iconName);
        // Fallback to a generic icon if loading fails
        const fallback = document.createElement('i');
        fallback.className = "fas fa-cube " + (className || "");
        element.innerHTML = '';
        element.appendChild(fallback);
      };
      element.appendChild(img);
    } catch (error) {
      console.error("Error rendering icon:", error);
      // Fallback for any errors
      const fallback = document.createElement('i');
      fallback.className = "fas fa-cube " + (className || "");
      element.appendChild(fallback);
    }
  }
  
  return element;
};

const iconService = {
  getIcons,
  getIconUrl,
  searchFontAwesomeIcons,
  loadFontAwesomeCDN,
  renderIcon
};

export default iconService;