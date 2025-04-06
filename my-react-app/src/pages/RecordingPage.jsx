import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import useSpeechToText from '../hooks/RecordingPage';
import './RecordingPage.css'; // Import your CSS file
import { GoogleGenAI } from "@google/genai";

const VoiceInput = () => {
  const [textInput, setTextInput] = useState('');
  const navigate = useNavigate(); // Initialize navigate
  var speechToText = ''

  const { isListening, transcript, startListening, getSpeechString, stopListening } = useSpeechToText({ continuous: true });
  const [isPaused, setIsPaused] = useState(false)

  const startStopListening = () => {
    isListening ? stopVoiceInput() : startListening();
  };

  const changePauseResume = () => {
    setIsPaused(!isPaused)
    if (!isPaused && isListening) {
      stopListening()
      setTextInput((prevVal) =>
        prevVal + (transcript.length ? (prevVal.length ? ' ' : '') + transcript : ''));
    } else if (isPaused && !isListening) {
      startListening()
    }
  }

  const stopVoiceInput = () => {
    speechToText = getSpeechString();
    console.log(speechToText)
    stopListening();
    document.getElementById('speech').value = ''
  };

  return (
    <div>
      {/* Back button to navigate to the previous page */}
      <h1>Voice Recording</h1>
      <button className='backButton' onClick={() => navigate(-1)}>Back</button>
      <button onClick={() => startStopListening()}>
        {isListening ? 'Stop Listening' : 'Speak'}
      </button>
      <button onClick={() => changePauseResume()}>
        {isListening ? 'Pause' : 'Resume'}
      </button>
      <button>Convert to Notes</button>
      <textarea
        id="speech"
        style={{
          marginTop: '20px',
          width: '100%',
          height: '150px',
        }}
        disabled={isListening}
        value={
          isListening
            ? textInput + (transcript.length ? (textInput.length ? ' ' : '') + transcript : '')
            : textInput
        }
        onChange={(e) => {
          setTextInput(e.target.value);
        }}
      />
    </div>
  );
};

export default VoiceInput;