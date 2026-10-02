import re


def analyze_resume(text):
    text_lower = text.lower()

    skills = [
        "python",
        "java",
        "c++",
        "sql",
        "html",
        "css",
        "javascript",
        "machine learning",
        "deep learning",
        "git",
        "github",
        "fastapi",
        "django"
    ]

    found_skills = []

    for skill in skills:
        if skill in text_lower:
            found_skills.append(skill)

    email_match = re.search(
        r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}",
        text
    )

    phone_match = re.search(
        r"\b\d{10}\b",
        text
    )

    return {
        "skills": found_skills,
        "email": email_match.group(0) if email_match else None,
        "phone": phone_match.group(0) if phone_match else None,
        "skill_count": len(found_skills)
    }