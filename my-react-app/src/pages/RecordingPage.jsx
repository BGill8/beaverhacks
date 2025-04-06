import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSpeechToText from '../hooks/RecordingPage';
import './RecordingPage.css';

const VoiceInput = () => {
  const [textInput, setTextInput] = useState('');
  const navigate = useNavigate();

  const {
    isListening,
    transcript,
    startListening,
    getSpeechString,
    stopListening,
  } = useSpeechToText({ continuous: true });

  const startStopListening = () => {
    isListening ? stopVoiceInput() : startListening();
  };

  const stopVoiceInput = async () => {
    getSpeechString(); // send transcript to backend
    setTextInput("");
    stopListening();
  };

  return (
    <div>
      <h1>Voice Recording</h1>
      <button className='backButton' onClick={() => navigate(-1)}>Back</button>
      <button onClick={startStopListening}>
        {isListening ? 'Stop Listening' : 'Speak'}
      </button>
      <textarea
        id="speech"
        style={{ marginTop: '20px', width: '100%', height: '150px' }}
        disabled={isListening}
        value={
          isListening
            ? textInput + (transcript.length ? (textInput.length ? ' ' : '') + transcript : '')
            : textInput
        }
        onChange={(e) => setTextInput(e.target.value)}
      />
    </div>
  );
};

export default VoiceInput;
