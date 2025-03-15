import axios from "axios";
import { Visualisation } from "@/types/visualisation";

export async function getTranscript(type: string, question: string, answer: string[], visualisation: Visualisation) {
  try {
    const response = await axios.post(`http://localhost:8000/transcription`, {
      type,
      question,
      answer,
      visualisation
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching transcript:', error);
    throw error;
  }
}
