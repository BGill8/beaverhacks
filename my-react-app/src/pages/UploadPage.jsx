import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGenerateSummary } from "../hooks/useGenerateSummary";
import parse from "html-react-parser";
import "./UploadPage.css";

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const { summary, backendError, loadingSummary, generateBackendSummary } = useGenerateSummary();
  const navigate = useNavigate();

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
      <button className="backButton" onClick={() => navigate(-1)}>
        Back
      </button>
      <div style={{ marginTop: "20px" }}>
        <input
          type="file"
          id="fileInput"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <label
          htmlFor="fileInput"
          style={{
            display: "inline-block",
            padding: "10px 20px",
            backgroundColor: "#007BFF",
            color: "white",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            textAlign: "center",
          }}
        >
          Choose File
        </label>
      </div>
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