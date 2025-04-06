import { useState } from "react";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyChEaWV5Ulfb_kwIfHHUr4wH5Q4neOxXB4" });

export const useGenerateSummary = () => {
  const [summary, setSummary] = useState("");
  const [backendError, setBackendError] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);

  const generateBackendSummary = async (text) => {
    try {
      setLoadingSummary(true);
      setBackendError("");

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents:
          "summarize in detailed notes (utilizing <li> and bullets to organize) as if it were an HTML file (BUT DO NOT INCLUDE DOCTYPE, HTML headers, only simple p, h1-6, and li elements. Do not include ```html at the front or ``` at the end) " +
          text,
      });

      if (response.text) {
        setSummary(response.text);
      } else {
        setBackendError("Could not retrieve summary from Google Gemini API.");
      }
    } catch (error) {
      console.error("Error calling Google Gemini API:", error);
      setBackendError(`Error calling Google Gemini API: ${error.message}`);
    } finally {
      setLoadingSummary(false);
    }
  };

  return { summary, backendError, loadingSummary, generateBackendSummary };
};