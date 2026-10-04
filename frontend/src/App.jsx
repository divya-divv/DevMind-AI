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
        "http://127.0.0.1:8000/analyze",
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

      setMessage(
        "Could not connect to the backend. Make sure FastAPI is running."
      );
    }
  };

  const downloadReport = () => {
    if (!result) return;

    const pdf = new jsPDF();

    let y = 20;

    pdf.setFontSize(22);
    pdf.text("DevMind AI", 20, y);

    y += 12;

    pdf.setFontSize(14);
    pdf.text("Resume Analysis Report", 20, y);

    y += 15;

    pdf.setFontSize(11);

    pdf.text(
      `ATS Score: ${result.ats_score ?? 0}%`,
      20,
      y
    );

    y += 8;

    pdf.text(
      `Email: ${result.email || "Not detected"}`,
      20,
      y
    );

    y += 8;

    pdf.text(
      `Phone: ${result.phone || "Not detected"}`,
      20,
      y
    );

    y += 8;

    pdf.text(
      `Total Skills: ${result.skill_count ?? 0}`,
      20,
      y
    );

    y += 12;

    pdf.setFontSize(14);
    pdf.text("Detected Skills", 20, y);

    y += 8;

    pdf.setFontSize(10);

    const detectedSkills =
      result.detected_skills || [];

    detectedSkills.forEach((skill) => {
      pdf.text(`• ${skill}`, 25, y);
      y += 6;

      if (y > 270) {
        pdf.addPage();
        y = 20;
      }
    });

    y += 6;

    pdf.setFontSize(14);
    pdf.text("Missing Skills", 20, y);

    y += 8;

    pdf.setFontSize(10);

    const missingSkills =
      result.missing_skills || [];

    missingSkills.forEach((skill) => {
      pdf.text(`• ${skill}`, 25, y);
      y += 6;

      if (y > 270) {
        pdf.addPage();
        y = 20;
      }
    });

    y += 6;

    pdf.setFontSize(14);
    pdf.text("Career Readiness", 20, y);

    y += 8;

    pdf.setFontSize(10);

    pdf.text(
      result.career_readiness || "Good",
      25,
      y
    );

    y += 12;

    pdf.setFontSize(14);
    pdf.text("Recommended Job Roles", 20, y);

    y += 8;

    pdf.setFontSize(10);

    const roles =
      result.recommended_job_roles || [];

    roles.forEach((role) => {
      pdf.text(`• ${role}`, 25, y);
      y += 6;

      if (y > 270) {
        pdf.addPage();
        y = 20;
      }
    });

    y += 6;

    pdf.setFontSize(14);
    pdf.text("Skills To Learn", 20, y);

    y += 8;

    pdf.setFontSize(10);

    const skillsToLearn =
      result.skills_to_learn || [];

    skillsToLearn.forEach((skill) => {
      pdf.text(`• ${skill}`, 25, y);
      y += 6;

      if (y > 270) {
        pdf.addPage();
        y = 20;
      }
    });

    y += 6;

    pdf.setFontSize(14);
    pdf.text("Resume Suggestions", 20, y);

    y += 8;

    pdf.setFontSize(10);

    const suggestions =
      result.resume_suggestions || [];

    suggestions.forEach((suggestion) => {
      const lines = pdf.splitTextToSize(
        `• ${suggestion}`,
        165
      );

      lines.forEach((line) => {
        pdf.text(line, 25, y);
        y += 6;

        if (y > 270) {
          pdf.addPage();
          y = 20;
        }
      });

      y += 2;
    });

    pdf.save("DevMind_AI_Resume_Report.pdf");
  };

  return (
    <div className="app">

      {/* NAVBAR */}

      <nav className="navbar">

        <div className="logo">
          DevMind AI
        </div>

        <div className="nav-links">

          <a href="#home">
            Home
          </a>

          <a href="#analyzer">
            Analyzer
          </a>

          <a href="#features">
            Features
          </a>

          <a href="#about">
            About
          </a>

        </div>

      </nav>


      {/* HERO */}

      <section
        className="hero"
        id="home"
      >

        <p className="tagline">
          AI-POWERED CAREER ASSISTANT
        </p>

        <h1>
          Make Your Resume
          <br />
          <span>
            Smarter With AI
          </span>
        </h1>

        <p className="hero-text">
          Upload your resume and let DevMind AI analyze
          your skills, contact information and career readiness.
        </p>

        <a
          href="#analyzer"
          className="hero-button"
        >
          Analyze My Resume →
        </a>

      </section>


      {/* ANALYZER */}

      <section
        className="analyzer-section"
        id="analyzer"
      >

        <div className="analyzer-card">

          <p className="section-label">
            RESUME ANALYZER
          </p>

          <h2>
            Analyze Your Resume
          </h2>

          <p>
            Upload your PDF resume and get instant
            AI-powered insights.
          </p>

          <div className="upload-box">

            <div className="upload-icon">
              📄
            </div>

            <label className="choose-button">

              Choose Resume

              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                hidden
              />

            </label>

            {file && (

              <p className="selected-file">

                Selected:{" "}

                <strong>
                  {file.name}
                </strong>

              </p>

            )}

            <button
              className="analyze-button"
              onClick={handleAnalyze}
            >
              Analyze Resume →
            </button>

            {message && (

              <p className="status-message">
                {message}
              </p>

            )}

          </div>

        </div>

      </section>


      {/* RESULTS */}

      {result && (

        <section className="results-section">

          <p className="section-label">
            AI ANALYSIS
          </p>

          <h2>
            Resume Analysis Result
          </h2>


          {/* RESULT CARDS */}

          <div className="result-grid">

            <div className="result-card ats-card">

              <h3>
                ATS Score
              </h3>

              <div className="ats-score">
                {result.ats_score ?? 0}%
              </div>

              <p>
                Resume skill match score
              </p>

            </div>


            <div className="result-card">

              <h3>
                📧 Email
              </h3>

              <p className="result-value">
                {result.email || "Not detected"}
              </p>

            </div>


            <div className="result-card">

              <h3>
                📱 Phone
              </h3>

              <p className="result-value">
                {result.phone || "Not detected"}
              </p>

            </div>


            <div className="result-card">

              <h3>
                🧠 Total Skills
              </h3>

              <p className="big-number">
                {result.skill_count ?? 0}
              </p>

            </div>

          </div>


          {/* SKILLS */}

          <div className="skills-area">

            <div className="skills-card">

              <h3>
                💻 Detected Skills
              </h3>

              <div className="skill-list">

                {result.detected_skills?.map(
                  (skill, index) => (

                    <span
                      className="skill-tag"
                      key={index}
                    >
                      {skill}
                    </span>

                  )
                )}

              </div>

            </div>


            <div className="skills-card">

              <h3>
                📚 Missing Skills
              </h3>

              <div className="skill-list">

                {result.missing_skills?.map(
                  (skill, index) => (

                    <span
                      className="missing-tag"
                      key={index}
                    >
                      {skill}
                    </span>

                  )
                )}

              </div>

            </div>

          </div>


          {/* CAREER READINESS */}

          <div className="career-card">

            <p className="section-label">
              CAREER READINESS
            </p>

            <h2>
              {result.career_readiness || "Good"}
            </h2>

            <p>
              Your resume shows a solid technical foundation.
              Keep improving your skills and adding measurable
              project achievements.
            </p>

          </div>


          {/* JOB ROLES */}

          <div className="insight-card">

            <h3>
              🚀 Recommended Job Roles
            </h3>

            <div className="role-list">

              {result.recommended_job_roles?.map(
                (role, index) => (

                  <span
                    className="role-tag"
                    key={index}
                  >
                    {role}
                  </span>

                )
              )}

            </div>

          </div>


          {/* SKILLS TO LEARN */}

          <div className="insight-card">

            <h3>
              🎯 Skills To Learn Next
            </h3>

            <ul>

              {result.skills_to_learn?.map(
                (skill, index) => (

                  <li key={index}>
                    {skill}
                  </li>

                )
              )}

            </ul>

          </div>


          {/* SUGGESTIONS */}

          <div className="insight-card">

            <h3>
              📝 Resume Improvement Suggestions
            </h3>

            <ul>

              {result.resume_suggestions?.map(
                (suggestion, index) => (

                  <li key={index}>
                    {suggestion}
                  </li>

                )
              )}

            </ul>

          </div>


          {/* DOWNLOAD REPORT */}

          <div className="download-area">

            <button
              className="download-button"
              onClick={downloadReport}
            >
              📥 Download Analysis Report
            </button>

          </div>

        </section>

      )}


      {/* FEATURES */}

      <section
        className="features-section"
        id="features"
      >

        <p className="section-label">
          FEATURES
        </p>

        <h2>
          What DevMind AI Can Do
        </h2>

        <div className="feature-grid">

          <div className="feature-card">

            <div>
              🔍
            </div>

            <h3>
              Resume Analysis
            </h3>

            <p>
              Extract important information from your
              resume automatically.
            </p>

          </div>


          <div className="feature-card">

            <div>
              🧠
            </div>

            <h3>
              Skill Detection
            </h3>

            <p>
              Identify technical and professional
              skills from your resume.
            </p>

          </div>


          <div className="feature-card">

            <div>
              🚀
            </div>

            <h3>
              Career Insights
            </h3>

            <p>
              Get useful insights to improve your
              career profile.
            </p>

          </div>

        </div>

      </section>


      {/* ABOUT */}

      <section
        className="about-section"
        id="about"
      >

        <p className="section-label">
          ABOUT
        </p>

        <h2>
          About DevMind AI
        </h2>

        <p>
          DevMind AI is an intelligent resume analysis
          platform designed to help students understand
          their technical skills, identify skill gaps and
          improve their career readiness.
        </p>

      </section>


      {/* FOOTER */}

      <footer>
        © 2026 DevMind AI • Intelligent Resume Analysis
      </footer>

    </div>
  );
}

export default App;