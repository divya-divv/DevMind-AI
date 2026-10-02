from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pypdf import PdfReader
import io
import re

app = FastAPI(title="DevMind AI Backend")


# =========================
# CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# HOME
# =========================

@app.get("/")
def home():
    return {
        "message": "DevMind AI Backend is running!"
    }


# =========================
# ANALYZE RESUME
# =========================

@app.post("/analyze")
async def analyze_resume(file: UploadFile = File(...)):

    # Read uploaded PDF
    contents = await file.read()

    try:
        pdf_file = io.BytesIO(contents)
        reader = PdfReader(pdf_file)

        extracted_text = ""

        for page in reader.pages:
            page_text = page.extract_text()

            if page_text:
                extracted_text += page_text + "\n"

    except Exception as error:
        return {
            "error": "Could not read the PDF",
            "details": str(error)
        }

    text_lower = extracted_text.lower()


    # =========================
    # SKILL DATABASE
    # =========================

    skill_database = [
        "python",
        "java",
        "c",
        "c++",
        "sql",
        "html",
        "css",
        "javascript",
        "react",
        "node.js",
        "fastapi",
        "django",
        "flask",
        "machine learning",
        "deep learning",
        "artificial intelligence",
        "data science",
        "pandas",
        "numpy",
        "tensorflow",
        "pytorch",
        "git",
        "github",
        "docker",
        "mongodb",
        "mysql",
        "postgresql",
        "oracle",
        "linux",
        "excel",
    ]


    # =========================
    # DETECT SKILLS
    # =========================

    detected_skills = []

    for skill in skill_database:

        if skill in ["c", "c++"]:

            # Special handling for C and C++
            pattern = r"(?<![a-z0-9])" + re.escape(skill) + r"(?![a-z0-9])"

            if re.search(pattern, text_lower):
                detected_skills.append(skill)

        elif skill == "node.js":

            if (
                "node.js" in text_lower
                or "nodejs" in text_lower
                or "node js" in text_lower
            ):
                detected_skills.append(skill)

        else:

            pattern = r"(?<![a-z0-9])" + re.escape(skill) + r"(?![a-z0-9])"

            if re.search(pattern, text_lower):
                detected_skills.append(skill)


    # =========================
    # MISSING SKILLS
    # =========================

    missing_skills = []

    for skill in skill_database:

        if skill not in detected_skills:
            missing_skills.append(skill)


    # =========================
    # ATS SCORE
    # =========================

    total_skills = len(skill_database)
    detected_count = len(detected_skills)

    ats_score = int(
        (detected_count / total_skills) * 100
    )

    if ats_score > 100:
        ats_score = 100


    # =========================
    # RESUME SUGGESTIONS
    # =========================

    suggestions = []

    if detected_count < 5:

        suggestions.append(
            "Add more relevant technical skills to your resume."
        )

    if detected_count >= 5:

        suggestions.append(
            "Your resume contains several technical skills. "
            "Keep the skills section organized and relevant."
        )

    if len(missing_skills) > 0:

        suggestions.append(
            "Consider learning relevant missing skills "
            "to strengthen your technical profile."
        )

    if "github" not in detected_skills:

        suggestions.append(
            "Add your GitHub profile and relevant projects "
            "to showcase your work."
        )

    if "git" not in detected_skills:

        suggestions.append(
            "Mention Git or version control experience if you have used it."
        )

    if len(extracted_text) < 1000:

        suggestions.append(
            "Your resume appears to contain limited content. "
            "Consider adding projects, education, certifications, "
            "and achievements."
        )

    if len(extracted_text) >= 1000:

        suggestions.append(
            "Your resume has a good amount of content. "
            "Review it for clear formatting and concise descriptions."
        )


    # =========================
    # JOB ROLE RECOMMENDATION
    # =========================

    recommended_roles = []

    if (
        "python" in detected_skills
        and "sql" in detected_skills
        and (
            "pandas" in detected_skills
            or "numpy" in detected_skills
        )
    ):
        recommended_roles.append("Data Analyst")


    if (
        "python" in detected_skills
        and (
            "machine learning" in detected_skills
            or "tensorflow" in detected_skills
            or "pytorch" in detected_skills
        )
    ):
        recommended_roles.append("Machine Learning Engineer")


    if (
        "java" in detected_skills
        and "sql" in detected_skills
    ):
        recommended_roles.append("Java Developer")


    if (
        "react" in detected_skills
        and "javascript" in detected_skills
        and "html" in detected_skills
    ):
        recommended_roles.append("Frontend Developer")


    if (
        "python" in detected_skills
        and (
            "fastapi" in detected_skills
            or "django" in detected_skills
            or "flask" in detected_skills
        )
    ):
        recommended_roles.append("Backend Developer")


    if (
        "python" in detected_skills
        and "sql" in detected_skills
    ):
        recommended_roles.append("Python Developer")


    if (
        "mongodb" in detected_skills
        and "node.js" in detected_skills
    ):
        recommended_roles.append("Full Stack Developer")


    if (
        "docker" in detected_skills
        and "linux" in detected_skills
        and "git" in detected_skills
    ):
        recommended_roles.append("DevOps Engineer")


    if len(recommended_roles) == 0:

        recommended_roles.append(
            "Software Developer"
        )


    # =========================
    # CAREER ROADMAP
    # =========================

    career_roadmap = []

    if "python" in detected_skills:

        career_roadmap = [
            {
                "step": 1,
                "title": "Strengthen Python",
                "description": "Practice Python fundamentals, functions, OOP, modules, and problem solving."
            },
            {
                "step": 2,
                "title": "Learn Advanced Tools",
                "description": "Learn libraries such as Pandas, NumPy and other tools relevant to your target role."
            },
            {
                "step": 3,
                "title": "Build Projects",
                "description": "Create practical projects that demonstrate your Python skills."
            },
            {
                "step": 4,
                "title": "Improve GitHub Profile",
                "description": "Upload projects with clean README files and meaningful documentation."
            },
            {
                "step": 5,
                "title": "Prepare for Internships",
                "description": "Practice coding, technical questions, aptitude and interview communication."
            }
        ]

    elif "java" in detected_skills:

        career_roadmap = [
            {
                "step": 1,
                "title": "Strengthen Java",
                "description": "Practice Java fundamentals, OOP, collections, exceptions and multithreading."
            },
            {
                "step": 2,
                "title": "Learn SQL",
                "description": "Practice database concepts, SQL queries and database connectivity."
            },
            {
                "step": 3,
                "title": "Build Java Projects",
                "description": "Create practical applications using Java and database technologies."
            },
            {
                "step": 4,
                "title": "Improve GitHub Profile",
                "description": "Publish projects with clear documentation and source code."
            },
            {
                "step": 5,
                "title": "Prepare for Interviews",
                "description": "Practice Java coding problems, CS fundamentals and interview questions."
            }
        ]

    else:

        career_roadmap = [
            {
                "step": 1,
                "title": "Build Programming Fundamentals",
                "description": "Choose a programming language and strengthen problem-solving skills."
            },
            {
                "step": 2,
                "title": "Learn Core Technologies",
                "description": "Develop skills related to web development, databases and software development."
            },
            {
                "step": 3,
                "title": "Build Projects",
                "description": "Create practical projects to demonstrate your technical abilities."
            },
            {
                "step": 4,
                "title": "Build Your Portfolio",
                "description": "Maintain a professional GitHub profile and showcase your projects."
            },
            {
                "step": 5,
                "title": "Prepare for Opportunities",
                "description": "Practice coding, aptitude, communication and technical interviews."
            }
        ]


    # =========================
    # RETURN RESULT
    # =========================

    return {
        "filename": file.filename,
        "email": "dj833569@gmail.com",
        "phone": "6360555405",
        "skills": detected_skills,
        "skill_count": detected_count,
        "missing_skills": missing_skills,
        "missing_skill_count": len(missing_skills),
        "ats_score": ats_score,
        "suggestions": suggestions,
        "recommended_roles": recommended_roles,
        "career_roadmap": career_roadmap,
        "text_length": len(extracted_text),
    }