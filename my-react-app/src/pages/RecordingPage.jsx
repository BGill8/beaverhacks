import React, { useState } from 'react'
import useSpeechToText from '../hooks/RecordingPage'

const VoiceInput = () => {
    const [textInput, setTextInput] = useState('')

    const {isListening, transcript, startListening, stopListening} = useSpeechToText({continuous: true})
    
    const startStopListening = () => {
      isListening ? stopVoiceInput() : startListening()
    }

    const stopVoiceInput = () => {
      setTextInput(prevVal => prevVal + (transcript.length ? (prevVal.length ? ' ' : '') + transcript : ''))
      stopListening()
    }
    return (
      <div>
        <button onClick = {()=> {startStopListening()}}>
          {isListening ? 'Stop Listening' : 'Speak'}
        </button>
        <textarea style={{
          marginTop: '20px',
          width: '100%',
          height: '150px'
        }}
        disabled={isListening}
        value = {isListening ? textInput + (transcript.length ? (textInput.length ? ' ' : '') + transcript: '') : textInput}
        onChange ={(e) => { setTextInput(e.target.value) }}
        />
      </div>
    )
}

export default VoiceInput