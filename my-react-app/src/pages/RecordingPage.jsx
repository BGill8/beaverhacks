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
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      setAudioChunks([]);
      setRecording(true);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks((prevChunks) => [...prevChunks, event.data]);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/mp3;codecs=opus' }); // Or another suitable audio MIME type
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setRecording(false);
        // Stop all tracks in the media stream
        mediaStreamRef.current?.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      console.log('Recording started');
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Error accessing microphone. Please ensure microphone access is granted.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      console.log('Recording stopped');
    }
  };

  const sendAudio = async () => {
    setLoading(true);
    setError(null);

    if (!audioUrl) {
      setError('No audio to send.');
      setLoading(false);
      return;
    }

    try {
      const audioBlob = await fetch(audioUrl).then(r => r.blob());
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm'); // Adjust filename and type if needed

      const response = await fetch('/api/voice', { // Your backend API endpoint for handling audio
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send audio to server.');
      }

      const data = await response.json();
      setText(data.message || 'Audio sent successfully.'); // Adjust based on your backend response
    } catch (err) {
      console.error('Error sending audio:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
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