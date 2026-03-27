import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const client = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
});

async function chat(prompt) {
  if (!API_KEY) {
    throw new Error('OpenAI API key not configured. Add VITE_OPENAI_API_KEY to your .env file.');
  }
  const res = await client.post('/chat/completions', {
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful study assistant. Format your responses in clear, readable markdown. Be concise but thorough.',
      },
      { role: 'user', content: prompt },
    ],
    max_tokens: 900,
    temperature: 0.7,
  });
  return res.data.choices[0].message.content;
}

export async function generateSummary(topic, subject = '') {
  const context = subject ? ` (from ${subject})` : '';
  return chat(
    `Generate a comprehensive but concise study summary for the topic: "${topic}"${context}. Include key concepts, important points, and any formulas or definitions. Format with headings and bullet points.`
  );
}

export async function generateQuestions(topic, subject = '') {
  const context = subject ? ` (from ${subject})` : '';
  return chat(
    `Generate 5 practice multiple-choice questions for the topic: "${topic}"${context}. For each question, provide 4 options (A–D) and mark the correct answer at the end. Format clearly.`
  );
}

export async function generateFlashcards(topic, subject = '') {
  const context = subject ? ` (from ${subject})` : '';
  return chat(
    `Generate 5 study flashcards for the topic: "${topic}"${context}. Format each as:\n**Q:** [question]\n**A:** [answer]\n\nSeparate each flashcard with a blank line.`
  );
}

export async function fetchMotivationalQuote() {
  try {
    const res = await axios.get('https://api.quotable.io/random?tags=education,motivational,wisdom&maxLength=150');
    return { content: res.data.content, author: res.data.author };
  } catch {
    return {
      content: 'The secret of getting ahead is getting started.',
      author: 'Mark Twain',
    };
  }
}
