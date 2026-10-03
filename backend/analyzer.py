import re

TECHNICAL_SKILLS = [
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
    "git",
    "github",
    "fastapi",
    "django",
    "flask",
    "tensorflow",
    "pandas",
    "numpy",
]

RECOMMENDED_SKILLS = [
    "docker",
    "rest api",
    "aws",
    "postgresql",
    "mongodb",
    "typescript",
    "linux",
    "data structures",
    "algorithms",
    "cloud computing",
]


def calculate_resume_score(text, skills, email, phone):
    text_lower = text.lower()

    score = 0

    score += min(len(skills) * 2, 25)

    project_keywords = [
        "project",
        "projects",
        "developed",
        "implemented",
        "built",
    ]

    if any(word in text_lower for word in project_keywords):
        score += 20

    education_keywords = [
        "education",
        "bachelor",
        "degree",
        "engineering",
        "b.tech",
        "b.e",
        "college",
        "university",
    ]

    if any(word in text_lower for word in education_keywords):
        score += 15

    experience_keywords = [
        "experience",
        "internship",
        "intern",
        "training",
        "work experience",
    ]

    if any(word in text_lower for word in experience_keywords):
        score += 15

    keyword_groups = [
        ["skills", "technical skills"],
        ["certification", "certifications"],
        ["achievement", "achievements"],
        ["linkedin", "github"],
    ]

    for group in keyword_groups:
        if any(word in text_lower for word in group):
            score += 2.5

    if email:
        score += 2.5

    if phone:
        score += 2.5

    sections = [
        "summary",
        "skills",
        "education",
        "project",
        "experience",
    ]

    sections_found = sum(
        1 for section in sections if section in text_lower
    )

    score += min(sections_found * 2, 10)

    return min(round(score), 100)


def analyze_resume(text):
    text_lower = text.lower()

    email_match = re.search(
        r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}",
        text
    )

    email = email_match.group(0) if email_match else None

    phone_match = re.search(
        r"\b[6-9]\d{9}\b",
        text
    )

    phone = phone_match.group(0) if phone_match else None

    detected_skills = []

    for skill in TECHNICAL_SKILLS:
        if skill in text_lower:
            detected_skills.append(skill)

    missing_skills = []

    for skill in RECOMMENDED_SKILLS:
        if skill not in text_lower:
            missing_skills.append(skill)

    resume_score = calculate_resume_score(
        text,
        detected_skills,
        email,
        phone
    )

    suggestions = []

    if len(detected_skills) < 8:
        suggestions.append(
            "Add relevant technical skills that you can demonstrate."
        )
    else:
        suggestions.append(
            "Keep your technical skills focused on technologies you can demonstrate."
        )

    if "project" in text_lower:
        suggestions.append(
            "Add measurable results to your projects, such as accuracy, performance, users, or time saved."
        )
    else:
        suggestions.append(
            "Add projects with clear descriptions and technologies used."
        )

    if "experience" not in text_lower and "internship" not in text_lower:
        suggestions.append(
            "Add internship, training, or practical experience if available."
        )

    suggestions.append(
        "Mention the technologies used in each project clearly."
    )

    suggestions.append(
        "Customize important keywords according to the internship or job description."
    )

    return {
        "score": resume_score,
        "email": email,
        "phone": phone,
        "skills": detected_skills,
        "skill_count": len(detected_skills),
        "missing_skills": missing_skills,
        "suggestions": suggestions,
    }