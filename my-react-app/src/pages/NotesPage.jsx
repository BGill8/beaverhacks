
// NoteTemplatePage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import parse from 'html-react-parser'

const NoteTemplatePage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch notes from the API
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get('http://localhost:3000/texts'); // Assuming your API is running on localhost
        setNotes(response.data);
      } catch (err) {
        setError('Failed to load notes');
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Notes</h1>
      {notes.length > 0 ? (
        <ul>
          {notes.map((note) => (
            <li key={note._id}>
              <h3>Text:</h3>
              <p>{note.text}</p>
              <h4>Note:</h4>
            
              {parse(note.note)}

            </li>
          ))}
        </ul>
      ) : (
        <p>No notes available</p>
      )}
    </div>
  );
};

export default NoteTemplatePage;



