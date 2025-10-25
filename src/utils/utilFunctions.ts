import config from '../../config/development.json';

export const fetchProblems = async () => {
    const userId = '1'; // Replace with actual user ID logic
  try {
    const response = await fetch(`${config.api_url}/users/${1}/problems`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch problems:', error);
    throw error;
  }
};