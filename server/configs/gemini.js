import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API, // make sure this matches your env
});

async function main(prompt) {
  // ✅ Debug logs
  console.log("API KEY:", process.env.GEMINI_API); // check your key
  console.log("Prompt:", prompt);                 // check the content being sent

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
  });

  return response.candidates[0].content.parts[0].text;
}

export default main;
