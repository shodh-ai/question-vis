import { getQuestion } from './question';
import { getVisulaisation } from './visulaisation';
import { Question } from '@/types/question';
import { Visualisation } from '@/types/visualisation';
import { getTranscript } from './transcript';

export async function getExampleData() {
  try {
    const question: Question = await getQuestion("example");
    if (!question) {
      throw new Error('Invalid question data');
    }

    const visulaisation: Visualisation = await getVisulaisation("example", "", question.question, question.answer);
    if (!visulaisation) {
      throw new Error('Invalid visulaisation data');
    }
    const transcript: string[] = await getTranscript("example", question?.question, question?.answer, visulaisation);
    if (!transcript) {
      throw new Error('Invalid transcript data');
    }

    console.log("==================================")
    console.log(transcript)
    console.log("==================================")

    return { question, visulaisation, transcript };
  } catch (error) {
    console.error('Error fetching example data:', error);
    throw error;
  }
}
