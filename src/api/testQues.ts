import { getQuestion } from './question';
import { Question } from '@/types/question';

export async function getTestData() {
  try {
    const question: Question = await getQuestion("example");
    if (!question) {
      throw new Error('Invalid question data');
    }

    return { question };
  } catch (error) {
    console.error('Error fetching example data:', error);
    throw error;
  }
}
