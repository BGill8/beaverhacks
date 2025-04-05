import { useState } from 'react'
import beavernoteslogo from './assets/beavernotes.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <header>
          <h1>Beaver Notes</h1>
          <p>Welcome to the automated notes generator</p>
        </header>
      </div>
      <div>
        <div>
          <img src={beavernoteslogo} className="logo" alt="Vite logo" />
        </div>
      </div>
      
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          {count % 2 === 0 ? "Start Recording" : "Stop Recording"}
        </button>
        <div className="divider"></div>
        <button onClick={() => setCount((count) => count + 1)}>
          Upload <code>.txt</code> file
        </button>
      </div>
    </>
  )
}

export default App
