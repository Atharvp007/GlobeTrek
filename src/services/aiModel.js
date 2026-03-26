import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});


export async function generateTripWithAI(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let textResponse = response.text;

    

    
    textResponse = textResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    //console.log("ai res",textResponse);

   
    const firstBrace = textResponse.indexOf("{");
    const lastBrace = textResponse.lastIndexOf("}");

    if (firstBrace !== -1 && lastBrace !== -1) {
      textResponse = textResponse.substring(firstBrace, lastBrace + 1);
    }

    
    const jsonResponse = JSON.parse(textResponse);

    return jsonResponse;

  } catch (error) {
    console.error("Error generating trip:", error);
    throw error;
  }
}