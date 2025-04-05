import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyDDG0l2xxQBXnKMU9MdW8UhaKxSGyDw-iw" });

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
  });
  console.log(response.text);
}

export default main;
