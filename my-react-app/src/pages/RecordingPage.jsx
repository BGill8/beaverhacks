import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useSpeechToText from "../hooks/RecordingPage";
import { useGenerateSummary } from "../hooks/useGenerateSummary";
import parse from "html-react-parser";
import "./RecordingPage.css";

const VoiceInput = () => {
  const [speech, setSpeech] = useState("");
  const { summary, backendError, loadingSummary, generateBackendSummary } = useGenerateSummary();
  const navigate = useNavigate();

  const { isListening, transcript, startListening, stopListening } = useSpeechToText({ continuous: true });

  const startStopListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleConvertToNotes = async () => {
    if (speech.trim() === "") {
      alert("Please enter some text to summarize.");
      return;
    }
    await generateBackendSummary(speech); // Call the summarization function
  };

  return (
    <div>
      <h1>Voice Recording</h1>
      <button className="backButton" onClick={() => navigate(-1)}>
        Back
      </button>
      <button onClick={startStopListening}>
        {isListening ? "Stop Listening" : "Speak"}
      </button>
      <button onClick={handleConvertToNotes}>Convert to Notes</button>
      <textarea
        id="speech"
        style={{ marginTop: "20px", width: "100%", height: "150px" }}
        value={isListening ? speech + transcript : speech}
        onChange={(e) => setSpeech(e.target.value)}
      />
      {loadingSummary && <p>Summarizing...</p>}
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

export default VoiceInput;