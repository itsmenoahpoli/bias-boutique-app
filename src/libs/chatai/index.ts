import { OPENAI_CONFIG } from "@/config/opanai.config";
import { contextData } from "./context";

const { BASE_URL, API_KEY } = OPENAI_CONFIG;

type ChatContextItem = {
  question: string;
  answer: string;
};

type GetResponseOptions = {
  userMessage: string;
  contextData: ChatContextItem[];
  openAiApiKey?: string;
};

export async function getChatResponse({
  userMessage,
}: GetResponseOptions): Promise<string> {
  const normalizedMessage = userMessage.trim().toLowerCase();

  const exactMatch = contextData.find(
    (item) => item.question.trim().toLowerCase() === normalizedMessage
  );

  if (exactMatch) return exactMatch.answer;

  const partialMatch = contextData.find((item) =>
    normalizedMessage.includes(item.question.toLowerCase())
  );

  if (partialMatch) return partialMatch.answer;

  if (API_KEY) {
    return await fetchGptResponse(userMessage, contextData);
  }

  return "Sorry, I couldn't find an answer to your question. Try rephrasing or ask something else.";
}

async function fetchGptResponse(
  userMessage: string,
  contextData: ChatContextItem[]
): Promise<string> {
  const contextAsText = contextData
    .map((item) => `Q: ${item.question}\nA: ${item.answer}`)
    .join("\n\n");

  const prompt = `You are a helpful support assistant. Only answer using the following data:\n\n${contextAsText}\n\nUser: ${userMessage}\nAssistant:`;

  const response = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that only uses the given context.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
    }),
  });

  const json = await response.json();

  return (
    json?.choices?.[0]?.message?.content?.trim() ||
    "Apologies as I don't have the information to answer this query."
  );
}
