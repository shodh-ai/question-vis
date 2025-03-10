import axios from 'axios';

export async function getQuestion(type: string) {
  try {
    const response = await axios.post(`http://localhost:8000/questions`, {
      type
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching question:', error);
    throw error;
  }
}
