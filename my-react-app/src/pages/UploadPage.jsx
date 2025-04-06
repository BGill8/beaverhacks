import React, { useState } from "react";

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileContent(e.target.result); // Store file content
      };
      reader.onerror = () => {
        alert("Error reading file!");
      };
      reader.readAsText(file);
      setSelectedFile(file);
    } else {
      alert("Please upload a valid .txt file.");
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      alert(`File "${selectedFile.name}" uploaded successfully!`);
      console.log("File content:", fileContent); // Log file content
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
      {fileContent && (
        <pre style={{ marginTop: "20px", textAlign: "left" }}>
          {fileContent}
        </pre>
      )}
    </div>
  );
};

export default UploadPage;