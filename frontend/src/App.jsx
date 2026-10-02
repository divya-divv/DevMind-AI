import { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
      setMessage("Resume selected: " + selectedFile.name);
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setMessage("Please upload your resume first.");
      return;
    }

    setLoading(true);
    setMessage("Analyzing your resume...");
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/analyze",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Server error: " + response.status);
      }

      const data = await response.json();

      console.log("Backend response:", data);

      setResult(data);
      setMessage("Resume analyzed successfully!");
    } catch (error) {
      console.error(error);

      setMessage(
        "Could not connect to the backend. Make sure FastAPI is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">

      {/* NAVBAR */}
      <header className="navbar">
        <div className="logo">DevMind AI</div>

        <nav>
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </nav>
      </header>

      <main>

        {/* HERO */}
        <section className="hero" id="home">

          <div className="hero-content">

            <p className="tagline">
              AI-POWERED CAREER ASSISTANT
            </p>

            <h1>
              Make Your Resume
              <span>Smarter with AI</span>
            </h1>

            <p className="description">
              Upload your resume and let DevMind AI analyze
              your skills, experience, and career profile.
            </p>

            {/* UPLOAD CARD */}
            <div className="upload-card">

              <div className="upload-icon">📄</div>

              <h2>Upload Your Resume</h2>

              <p>PDF files supported</p>

              <label className="upload-button">
                Choose Resume

                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
              </label>

              {file && (
                <p className="file-name">
                  Selected: <strong>{file.name}</strong>
                </p>
              )}

              <button
                className="analyze-button"
                onClick={handleAnalyze}
                disabled={loading}
              >
                {loading
                  ? "Analyzing..."
                  : "Analyze Resume →"}
              </button>

              {message && (
                <p className="message">
                  {message}
                </p>
              )}

              {/* RESULTS */}
              {result && (
                <div className="result-card">

                  <h2>Resume Analysis Result</h2>

                  {/* ATS SCORE */}
                  <div className="ats-score">

                    <h3>ATS Score</h3>

                    <div className="score-number">
                      {result.ats_score}%
                    </div>

                    <p>
                      Resume skill match score
                    </p>

                  </div>

                  {/* EMAIL */}
                  <div className="result-item">
                    <strong>Email</strong>

                    <span>
                      {result.email || "Not detected"}
                    </span>
                  </div>

                  {/* PHONE */}
                  <div className="result-item">
                    <strong>Phone</strong>

                    <span>
                      {result.phone || "Not detected"}
                    </span>
                  </div>

                  {/* TOTAL SKILLS */}
                  <div className="result-item">
                    <strong>Total Skills</strong>

                    <span>
                      {result.skill_count || 0}
                    </span>
                  </div>

                  {/* DETECTED SKILLS */}
                  <div className="skills-section">

                    <h3>Detected Skills</h3>

                    <div className="skills-list">

                      {result.skills &&
                        result.skills.map((skill, index) => (
                          <span
                            className="skill-tag"
                            key={index}
                          >
                            {skill}
                          </span>
                        ))}

                    </div>

                  </div>

                  {/* MISSING SKILLS */}
                  <div className="missing-skills-section">

                    <h3>Missing Skills</h3>

                    <p className="missing-description">
                      These skills can be considered for
                      strengthening your technical profile.
                    </p>

                    <div className="missing-skills-list">

                      {result.missing_skills &&
                      result.missing_skills.length > 0 ? (

                        result.missing_skills.map(
                          (skill, index) => (
                            <span
                              className="missing-skill-tag"
                              key={index}
                            >
                              {skill}
                            </span>
                          )
                        )

                      ) : (

                        <p className="no-missing-skills">
                          🎉 No missing skills detected!
                        </p>

                      )}

                    </div>

                  </div>

                  {/* SUGGESTIONS */}
                  <div className="suggestions-section">

                    <h3>
                      Resume Improvement Suggestions
                    </h3>

                    <p className="suggestions-description">
                      Suggestions based on the information
                      detected in your resume.
                    </p>

                    <div className="suggestions-list">

                      {result.suggestions &&
                        result.suggestions.map(
                          (suggestion, index) => (

                            <div
                              className="suggestion-item"
                              key={index}
                            >

                              <span className="suggestion-number">
                                {index + 1}
                              </span>

                              <p>
                                {suggestion}
                              </p>

                            </div>

                          )
                        )}

                    </div>

                  </div>

                  {/* JOB ROLES */}
                  <div className="job-roles-section">

                    <h3>
                      Recommended Job Roles
                    </h3>

                    <p className="job-roles-description">
                      Based on the skills detected in your resume.
                    </p>

                    <div className="job-roles-list">

                      {result.recommended_roles &&
                        result.recommended_roles.map(
                          (role, index) => (

                            <div
                              className="job-role-card"
                              key={index}
                            >

                              <div className="job-role-icon">
                                💼
                              </div>

                              <div>
                                <h4>{role}</h4>

                                <p>
                                  Suggested based on your
                                  current skill profile.
                                </p>
                              </div>

                            </div>

                          )
                        )}

                    </div>

                  </div>

                  {/* CAREER ROADMAP */}
                  <div className="career-roadmap-section">

                    <h3>
                      Career Roadmap
                    </h3>

                    <p className="roadmap-description">
                      A step-by-step development path based
                      on your current profile.
                    </p>

                    <div className="roadmap-list">

                      {result.career_roadmap &&
                        result.career_roadmap.map(
                          (item) => (

                            <div
                              className="roadmap-item"
                              key={item.step}
                            >

                              <div className="roadmap-number">
                                {item.step}
                              </div>

                              <div className="roadmap-content">

                                <h4>
                                  {item.title}
                                </h4>

                                <p>
                                  {item.description}
                                </p>

                              </div>

                            </div>

                          )
                        )}

                    </div>

                  </div>

                </div>
              )}

            </div>

          </div>

        </section>

        {/* FEATURES */}
        <section
          className="features"
          id="features"
        >

          <h2>What DevMind AI Can Do</h2>

          <div className="feature-grid">

            <div className="feature-card">

              <div className="feature-icon">
                🔍
              </div>

              <h3>Resume Analysis</h3>

              <p>
                Extract important information from your
                resume automatically.
              </p>

            </div>

            <div className="feature-card">

              <div className="feature-icon">
                🧠
              </div>

              <h3>Skill Detection</h3>

              <p>
                Identify technical and professional skills
                from your resume.
              </p>

            </div>

            <div className="feature-card">

              <div className="feature-icon">
                🚀
              </div>

              <h3>Career Insights</h3>

              <p>
                Get useful insights to improve your
                career profile.
              </p>

            </div>

          </div>

        </section>

      </main>

      {/* FOOTER */}
      <footer id="about">

        <p>
          © 2026 DevMind AI • Intelligent Resume Analysis
        </p>

      </footer>

    </div>
  );
}

export default App;