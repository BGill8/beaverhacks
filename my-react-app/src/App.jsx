import React, { useState, useRef } from 'react';

function App() {
    const [recording, setRecording] = useState(false);
    const [audioChunks, setAudioChunks] = useState([]);
    const mediaRecorder = useRef(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream);

            mediaRecorder.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    setAudioChunks((prevChunks) => [...prevChunks, event.data]);
                }
            };

            mediaRecorder.current.onstop = async () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                const base64Audio = await blobToBase64(audioBlob);

                try {
                    const response = await fetch('/transcribe', { // your backend endpoint
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ audioData: base64Audio }),
                    });

                    const result = await response.json();
                    console.log(result); // Handle the response from your backend
                    setAudioChunks([]); // clear the audio chunks after sending.
                } catch (error) {
                    console.error('Error sending audio to backend:', error);
                }
            };

            mediaRecorder.current.start();
            setRecording(true);
        } catch (error) {
            console.error('Error accessing microphone:', error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder.current) {
            mediaRecorder.current.stop();
            setRecording(false);
        }
    };

    const blobToBase64 = (blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]); // Extract base64 part
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    return (
        <div>
            <button onClick={recording ? stopRecording : startRecording}>
                {recording ? 'Stop Recording' : 'Start Recording'}
            </button>
        </div>
    );
}

export default App;