import { useState } from "react";
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
      setMessage(`Selected: ${selectedFile.name}`);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setMessage("Please choose a resume first.");
      return;
    }

    setMessage("Analyzing your resume...");
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "https://devmind-ai-backend-w716.onrender.com/analyze",
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
      setMessage("Resume analyzed successfully! ✅");
    } catch (error) {
      console.error(error);
      setMessage("Could not connect to the backend. Please try again.");
    }
  };

  return (
    <div className="app">

      <nav>
        <div className="logo">DevMind AI</div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </div>
      </nav>

      <section id="home" className="hero">

        <p className="tagline">AI-POWERED CAREER ASSISTANT</p>

        <h1>
          Make Your Resume
          <br />
          Smarter With AI
        </h1>

        <p className="description">
          Upload your resume and let DevMind AI analyze your
          skills, contact information and career readiness.
        </p>

        <div className="analyzer-card">

          <h2>Analyze Your Resume</h2>

          <p>Upload your PDF resume and get instant insights.</p>

          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
          />

          {file && (
            <p>
              Selected: <strong>{file.name}</strong>
            </p>
          )}

          <button onClick={handleAnalyze}>
            Analyze Resume →
          </button>

          {message && (
            <p className="message">{message}</p>
          )}

        </div>
      </section>

      {result && (
        <section className="results">

          <h2>Resume Analysis Result</h2>

          <div className="score-card">
            <h3>ATS Score</h3>

            <div className="score">
              {result.score ?? 0}%
            </div>

            <p>Resume skill match score</p>
          </div>

          <div className="contact-info">

            <p>
              <strong>Email</strong>
              <br />
              {result.email || "Not detected"}
            </p>

            <p>
              <strong>Phone</strong>
              <br />
              {result.phone || "Not detected"}
            </p>

            <p>
              <strong>Total Skills</strong>
              <br />
              {result.skill_count ?? 0}
            </p>

          </div>

          <h3>Detected Skills</h3>

          <div className="skills">

            {result.skills && result.skills.length > 0 ? (
              result.skills.map((skill, index) => (
                <span key={index}>{skill}</span>
              ))
            ) : (
              <p>No skills detected.</p>
            )}

          </div>

          {/* MISSING SKILLS */}

          <h3>Missing Skills</h3>

          <p>
            These skills can be considered for strengthening
            your technical profile.
          </p>

          <div className="skills">

            {result.missing_skills &&
            result.missing_skills.length > 0 ? (

              result.missing_skills.map((skill, index) => (
                <span key={index}>{skill}</span>
              ))

            ) : (

              <p>🎉 No missing skills detected!</p>

            )}

          </div>

          <h3>Resume Improvement Suggestions</h3>

          <p>
            Suggestions based on the information detected
            in your resume.
          </p>

          <ol>

            {result.suggestions &&
              result.suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}

          </ol>

          <h3>Recommended Job Roles</h3>

          <p>
            Based on the skills detected in your resume.
          </p>

          <ul>
            <li>Software Developer</li>
            <li>Python Developer</li>
            <li>AI / Machine Learning Intern</li>
          </ul>

          <h3>Career Roadmap</h3>

          <p>
            A step-by-step development path based on your
            current profile.
          </p>

          <ol>
            <li>Strengthen Python and programming fundamentals.</li>
            <li>Build real-world projects.</li>
            <li>Improve GitHub and portfolio projects.</li>
            <li>Practice technical interview questions.</li>
            <li>Apply for internships and entry-level roles.</li>
          </ol>

        </section>
      )}

      <section id="features" className="features">

        <h2>What DevMind AI Can Do</h2>

        <div className="feature-grid">

          <div>
            <h3>🔍 Resume Analysis</h3>
            <p>
              Extract important information from your resume
              automatically.
            </p>
          </div>

          <div>
            <h3>🧠 Skill Detection</h3>
            <p>
              Identify technical and professional skills from
              your resume.
            </p>
          </div>

          <div>
            <h3>🚀 Career Insights</h3>
            <p>
              Get useful insights to improve your career profile.
            </p>
          </div>

        </div>
      </section>

      <section id="about" className="about">

        <h2>About DevMind AI</h2>

        <p>
          DevMind AI is a resume analysis project designed
          to help students understand their resume skills
          and improve their career readiness.
        </p>

      </section>

      <footer>
        © 2026 DevMind AI • Intelligent Resume Analysis
      </footer>

    </div>
  );
}

export default App;