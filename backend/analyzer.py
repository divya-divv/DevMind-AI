import re


# Skills database
SKILLS = [
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
    "machine learning",
    "artificial intelligence",
    "deep learning",
    "data science",
    "git",
    "github",
    "fastapi",
    "django",
    "flask",
    "docker",
    "rest api",
    "mongodb",
    "mysql",
    "postgresql",
    "tensorflow",
    "pytorch",
    "aws",
    "azure",
]


def extract_email(text):
    match = re.search(
        r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}",
        text
    )

    return match.group(0) if match else "Not detected"


def extract_phone(text):
    match = re.search(
        r"(?<!\d)(?:\+91[\s-]?)?[6-9]\d{9}(?!\d)",
        text
    )

    return match.group(0) if match else "Not detected"


def detect_skills(text):
    text_lower = text.lower()

    detected = []

    for skill in SKILLS:
        if skill.lower() in text_lower:
            detected.append(skill)

    return detected


def calculate_ats_score(skill_count):
    if skill_count >= 15:
        return 95
    elif skill_count >= 12:
        return 90
    elif skill_count >= 10:
        return 85
    elif skill_count >= 7:
        return 75
    elif skill_count >= 5:
        return 65
    else:
        return 50


def get_missing_skills(detected_skills):
    detected_lower = [skill.lower() for skill in detected_skills]

    important_skills = [
        "python",
        "sql",
        "git",
        "github",
        "machine learning",
        "artificial intelligence",
        "fastapi",
        "rest api",
        "docker",
    ]

    missing = []

    for skill in important_skills:
        if skill.lower() not in detected_lower:
            missing.append(skill)

    return missing


def get_job_roles(detected_skills):
    skills = [skill.lower() for skill in detected_skills]

    roles = []

    if "python" in skills:
        roles.append("Python Developer")

    if "machine learning" in skills or "artificial intelligence" in skills:
        roles.append("Machine Learning / AI Engineer")

    if "html" in skills and "css" in skills and "javascript" in skills:
        roles.append("Frontend Developer")

    if "react" in skills:
        roles.append("React Developer")

    if "sql" in skills:
        roles.append("SQL / Database Developer")

    if "fastapi" in skills or "django" in skills or "flask" in skills:
        roles.append("Backend Developer")

    if "data science" in skills:
        roles.append("Data Science Intern / Junior Data Scientist")

    if not roles:
        roles.append("Software Developer")

    return roles


def get_learning_recommendations(missing_skills):
    recommendations = []

    for skill in missing_skills:
        if skill == "docker":
            recommendations.append("Learn Docker and containerization")
        elif skill == "rest api":
            recommendations.append("Learn REST API development")
        elif skill == "machine learning":
            recommendations.append("Strengthen Machine Learning fundamentals")
        elif skill == "artificial intelligence":
            recommendations.append("Learn practical Artificial Intelligence concepts")
        else:
            recommendations.append(f"Improve {skill.title()}")

    return recommendations[:6]


def get_career_readiness(skill_count, ats_score):
    if ats_score >= 90 and skill_count >= 12:
        return "Strong"

    elif ats_score >= 75 and skill_count >= 7:
        return "Good"

    elif ats_score >= 60:
        return "Developing"

    else:
        return "Needs Improvement"


def get_suggestions(missing_skills, skill_count):
    suggestions = []

    if skill_count < 8:
        suggestions.append(
            "Add more relevant technical skills to your resume."
        )

    suggestions.append(
        "Add measurable achievements and project results."
    )

    suggestions.append(
        "Keep your resume focused on skills relevant to the target job."
    )

    if "rest api" in missing_skills:
        suggestions.append(
            "Consider adding REST API development experience."
        )

    if "docker" in missing_skills:
        suggestions.append(
            "Consider learning Docker for modern backend development."
        )

    return suggestions[:5]


def analyze_resume(text):

    detected_skills = detect_skills(text)

    skill_count = len(detected_skills)

    ats_score = calculate_ats_score(skill_count)

    missing_skills = get_missing_skills(detected_skills)

    job_roles = get_job_roles(detected_skills)

    learning_recommendations = get_learning_recommendations(
        missing_skills
    )

    career_readiness = get_career_readiness(
        skill_count,
        ats_score
    )

    suggestions = get_suggestions(
        missing_skills,
        skill_count
    )

    return {
        "ats_score": ats_score,

        "email": extract_email(text),

        "phone": extract_phone(text),

        "skill_count": skill_count,

        "detected_skills": detected_skills,

        "missing_skills": missing_skills,

        "career_readiness": career_readiness,

        "recommended_job_roles": job_roles,

        "skills_to_learn": learning_recommendations,

        "resume_suggestions": suggestions,
    }