import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleGenAI } from "@google/genai";
import "./UploadPage.css";
import parse from "html-react-parser";


const ai = new GoogleGenAI({ apiKey: "AIzaSyChEaWV5Ulfb_kwIfHHUr4wH5Q4neOxXB4" });

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [summary, setSummary] = useState("");
  const [backendError, setBackendError] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);

  const navigate = useNavigate();

  const generateBackendSummary = async (text) => {
    try {
      setLoadingSummary(true);
      setBackendError("");

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: "summarize in detailed notes (utilizing <li> and bullets to organize) as if it were an HTML file (BUT DO NOT INCLUDE DOCTYPE, HTML headers, only simple p, h1-6, and li elements. Do not include ```html at the front or ``` at the end) " + text,
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target.result;
        setFileContent(content);
        setSelectedFile(file);
        await generateBackendSummary(content); // Call the summarization function
      };
      reader.onerror = () => {
        alert("Error reading file!");
      };
      reader.readAsText(file);
    } else {
      alert("Please upload a valid .txt file.");
      setSelectedFile(null);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Upload and Summarize</h1>
      <button className='backButton' onClick={() => navigate(-1)}>Back</button>
      <input type="file" onChange={handleFileChange} />
      {loadingSummary && <p>Summarizing...</p>}
      {selectedFile && (
        <p style={{ marginTop: "20px" }}>
          Selected File: <strong>{selectedFile.name}</strong>
        </p>
      )}
      {summary && (
        <div style={{ marginTop: "20px", textAlign: "left" }}>
          <h2>Summary:</h2>
          <div style={{ lineHeight: "1.6", paddingLeft: "10px", fontSize: "16px" }}>
            {parse(summary)}
          </div>
        </div>
      )}

      {backendError && (
        <div style={{ marginTop: "20px", color: "red" }}>
          <h2>Error:</h2>
          <p>{backendError}</p>
        </div>
      )}
    </div>
  );
};

export default UploadPage;