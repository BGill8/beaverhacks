import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NotesPage.css';

const notesDisplay = () => {

const [textInput, setTextInput] = useState('');
const navigate = useNavigate();

return (
    <div>
      <h1>Notes Page</h1>
      <button className='backButton' onClick={() => navigate(-1)}>Back</button>
    </div>
  );
};

export default notesDisplay;