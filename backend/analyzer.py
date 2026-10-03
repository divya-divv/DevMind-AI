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


def calculate_resume_score(text, skills, email, phone):
    text_lower = text.lower()

    score = 0

    # 1. Technical Skills - 25 points
    skill_score = min(len(skills) * 2, 25)
    score += skill_score

    # 2. Projects - 20 points
    project_keywords = [
        "project",
        "projects",
        "developed",
        "implemented",
        "built",
    ]

    project_found = any(word in text_lower for word in project_keywords)

    if project_found:
        score += 20

    # 3. Education - 15 points
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

    education_found = any(word in text_lower for word in education_keywords)

    if education_found:
        score += 15

    # 4. Experience / Internship - 15 points
    experience_keywords = [
        "experience",
        "internship",
        "intern",
        "training",
        "work experience",
    ]

    experience_found = any(
        word in text_lower for word in experience_keywords
    )

    if experience_found:
        score += 15

    # 5. Important Resume Keywords - 10 points
    keyword_groups = [
        ["skills", "technical skills"],
        ["certification", "certifications"],
        ["achievement", "achievements"],
        ["linkedin", "github"],
    ]

    keyword_points = 0

    for group in keyword_groups:
        if any(word in text_lower for word in group):
            keyword_points += 2.5

    score += keyword_points

    # 6. Contact Information - 5 points
    if email:
        score += 2.5

    if phone:
        score += 2.5

    # 7. Resume Completeness - 10 points
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

    completeness_score = min(sections_found * 2, 10)

    score += completeness_score

    return min(round(score), 100)


def analyze_resume(text):

    text_lower = text.lower()

    # Detect email
    email_match = re.search(
        r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}",
        text
    )

    email = email_match.group(0) if email_match else None

    # Detect phone number
    phone_match = re.search(
        r"\b[6-9]\d{9}\b",
        text
    )

    phone = phone_match.group(0) if phone_match else None

    # Detect skills
    detected_skills = []

    for skill in TECHNICAL_SKILLS:

        if skill in text_lower:
            detected_skills.append(skill)

    # Calculate score
    resume_score = calculate_resume_score(
        text,
        detected_skills,
        email,
        phone
    )

    # Suggestions
    suggestions = []

    if len(detected_skills) < 8:
        suggestions.append(
            "Add relevant technical skills that you can demonstrate."
        )
    else:
        suggestions.append(
            "Keep your technical skills focused on technologies you can demonstrate."
        )

    if "project" not in text_lower:
        suggestions.append(
            "Add projects with clear descriptions and technologies used."
        )
    else:
        suggestions.append(
            "Add measurable results to your projects, such as accuracy, performance, users, or time saved."
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
        "suggestions": suggestions,
    }