```jsx
import { useState } from "react";
import jsPDF from "jspdf";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      setMessage("");
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setMessage("Please select your resume first.");
      return;
    }

    setMessage("Analyzing your resume...");
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "https://devmind-ai-hvvd.onrender.com/analyze",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const data = await response.json();

      setResult(data);
      setMessage("Resume analyzed successfully!");
    } catch (error) {
      console.error(error);

      setMess
```
