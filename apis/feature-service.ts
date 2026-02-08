// Example service for fetching data
// In a real app, you would use axios or fetch with proper error handling and types

export const getFeatures = async () => {
  // Simulate API call
  return [
    {
      title: 'Modern Stack',
      description: 'Next.js 15, React 19, and Tailwind CSS 4 for the bleeding edge of web development.'
    },
    {
      title: 'Clean Architecture',
      description: 'Standardized folder structure designed for mid-to-large scale applications.'
    },
    {
      title: 'Rich Aesthetics',
      description: 'Custom design tokens and utilities for a premium, high-end visual feel.'
    }
  ];
};
