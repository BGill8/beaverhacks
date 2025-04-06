import { useEffect, useRef, useState } from 'react';

const useSpeechToText = (options) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      console.error('Web Speech API is not supported.');
      return;
    }

    recognitionRef.current = new window.webkitSpeechRecognition();
    const recognition = recognitionRef.current;
    recognition.interimResults = options.interimResults ?? true;
    recognition.lang = options.lang || 'en-US';
    recognition.continuous = options.continuous ?? false;

    if ('webkitSpeechGrammarList' in window) {
      const grammar = '#JSGF V1.0; grammar punctuation; public <punc> = . | , | ? | ! | ; | : ;';
      const speechRecognitionList = new window.webkitSpeechGrammarList();
      speechRecognitionList.addFromString(grammar, 1);
      recognition.grammars = speechRecognitionList;
    }

    recognition.onresult = (event) => {
      let text = '';
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      setTranscript(text);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    return () => {
      recognition.stop();
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const getSpeechString = async () => {
    const string = transcript.trim();
    console.log('Sending string:', string);

    try {
      const response = await fetch(`/text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: string }),
      });

      if (response.status === 201) {
        alert('Successfully added the exercise');
      } else {
        alert('Failed to add exercise, status code = ' + response.status);
      }
    } catch (error) {
      console.error('Error sending speech string:', error);
      alert('An error occurred while sending the request.');
    }
  };

  return {
    isListening,
    transcript,
    startListening,
    getSpeechString,
    stopListening,
  };
};

export default useSpeechToText;
