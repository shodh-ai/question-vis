import axios from 'axios';

export async function getVisulaisation(type: string, context: string, question: string, answer: string[]) {
  try {
    const response = await axios.post(`http://localhost:8000/visualisations`, {
      type,
      context,
      question,
      answer
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching visulaisation:', error);
    throw error;
  }
}
