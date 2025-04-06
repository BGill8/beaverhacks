import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [summary, setSummary] = useState("");
  const [backendError, setBackendError] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);

  const navigate = useNavigate(); // Initialize navigate for the back button

  // Function to call the backend API for summarization
  const generateBackendSummary = async (text) => {
    try {
      setLoadingSummary(true);
      setBackendError(""); // Clear previous errors

      const response = await fetch("http://localhost:5173/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); // Handle empty JSON
        console.error("Backend API Error:", errorData);
        setBackendError(
          `Failed to summarize: ${errorData.error || response.statusText}`
        );
        return;
      }

      const data = await response.json();
      if (data.summary) {
        setSummary(data.summary);
      } else {
        setBackendError("Could not retrieve summary from backend.");
      }
    } catch (error) {
      console.error("Error calling backend API:", error);
      setBackendError(`Error calling backend API: ${error.message}`);
    } finally {
      setLoadingSummary(false);
    }
  };

  // Handle file selection and reading
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target.result;
        setFileContent(content);
        setSelectedFile(file);
        // Send content to backend for summarization
        await generateBackendSummary(content);
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
      {/* Back button */}
      <button onClick={() => navigate(-1)} style={{ marginBottom: "20px" }}>
        Back
      </button>
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
          <p>{summary}</p>
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