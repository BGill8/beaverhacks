import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import beavernoteslogo from './assets/beavernotes.svg';
import './App.css';
import RecordingPage from './pages/RecordingPage';

function HomePage({ setCount, count }) {
  return (
    <>
      <div>
        <header>
          <h1>Beaver Notes</h1>
          <p>Welcome to the automated notes generator</p>
        </header>
      </div>
      <div>
        <img src={beavernoteslogo} className="logo" alt="Beaver Notes Logo" />
      </div>

      <div className="card">
        <Link to="/recording">
          <button className="record-button">Start Recording</button>
        </Link>
        <div className="divider"></div>
      </div>
    </>
  );
}

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage count={count} setCount={setCount} />} />
        <Route path="/recording" element={<RecordingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
