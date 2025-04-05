import { useState } from 'react';
import beavernoteslogo from './assets/beavernotes.svg';
import './App.css';
import { Link, BrowserRouter, Routes, Route } from 'react-router-dom';
import RecordingPage from './pages/RecordingPage';

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
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
                <Link to="/recording">
                  <button>Start Recording</button>
                </Link>
                <div className="divider"></div>
                <button onClick={() => setCount((count) => count + 1)}>
                  Upload <code>.txt</code> file
                </button>
              </div>
            </>
          }
        />
        <Route path="/recording" element={<RecordingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

