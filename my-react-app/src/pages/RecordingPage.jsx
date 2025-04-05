// pages/RecordingPage.jsx
import { useState, useRef } from 'react';

function RecordingPage() {
  const [recording, setRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);
  const [audioUrl, setAudioUrl] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);

  const startRecording = async () => {
    // ... (your startRecording logic)
  };

  const stopRecording = () => {
    // ... (your stopRecording logic)
  };

  const sendAudio = async () => {
    // ... (your sendAudio logic)
  };

  return (
    <div>
      <h2>Recording Page</h2>
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? 'Stop Recording' : 'Start Recording'}
      </button>

      {audioUrl && <audio src={audioUrl} controls />}

      <button onClick={sendAudio} disabled={loading || !audioUrl}>
        {loading ? 'Sending...' : 'Send Audio'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {text && <p>Server Response: {text}</p>}
    </div>
  );
}

export default RecordingPage;