import React, { useState } from "react";

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      alert(`File "${selectedFile.name}" uploaded successfully!`);
      // Add your upload logic here (e.g., send the file to a server)
    } else {
      alert("Please select a file first.");
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Upload Page</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} style={{ marginLeft: "10px" }}>
        Upload
      </button>
      {selectedFile && (
        <p style={{ marginTop: "20px" }}>
          Selected File: <strong>{selectedFile.name}</strong>
        </p>
      )}
    </div>
  );
};

export default UploadPage;