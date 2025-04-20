import React from 'react';

/**
 * Renders an icon based on its type (Font Awesome class or image URL)
 * @param iconValue The icon value (can be a Font Awesome class or URL)
 * @returns JSX element representing the icon
 */
export const renderIcon = (iconValue: string | undefined): React.ReactNode => {
  if (!iconValue) return null;
  
  if (iconValue.startsWith("http")) {
    // It's a direct URL to an image
    return React.createElement('img', {
      src: iconValue,
      alt: "Icon",
      className: "h-5 w-5 object-contain"
    });
  } else if (iconValue.startsWith("fa") && iconValue.includes("fa-")) {
    // It's a Font Awesome icon class
    return React.createElement('i', {
      className: `${iconValue} h-5 w-5`,
      style: { fontSize: "18px", width: "18px" }
    });
  }
  
  // Default return if no condition matches
  return null;
};