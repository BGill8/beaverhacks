import { useState, useRef } from 'react';
import './App.css';

function App() {
  const [recording, setRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);
  const [audioUrl, setAudioUrl] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus', // or 'audio/mpeg'
      });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks((prevChunks) => [...prevChunks, event.data]);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm;codecs=opus' }); // or 'audio/mpeg'
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
        setAudioChunks([]);
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event.error);
        setError('Recording error. Please try again.');
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Error accessing microphone. Please allow microphone access.');
    }
  };

  const stopRecording = () => {
    if (recording && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      setRecording(false);
    }
  };

  const sendAudio = async () => {
    if (!audioUrl) {
      setError('Please record audio first.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/voice', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: audioUrl }), // Send audio URL as text, or convert to base64
      });

      if (!response.ok) {
        throw new Error('Failed to send audio.');
      }

      const data = await response.json();
      setText(JSON.stringify(data));
    } catch (err) {
      console.error('Error sending audio:', err);
      setError('Failed to send audio. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
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

export default App
