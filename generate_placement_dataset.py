"""
Synthetic campus-placement dataset generator (SYNTHETIC - NOT REAL STUDENT DATA).

Purpose: test the pipeline/UI end to end, including project-type features.
Replace with real placement-cell data before drawing any real-world conclusions.

Usage:
    python generate_placement_dataset.py                # 20,000 rows
    python generate_placement_dataset.py --rows 50000 --seed 7
"""
import argparse
import numpy as np
import pandas as pd

BRANCHES = ["CSE", "IT", "ECE", "EEE", "Mechanical", "Civil", "AI&DS"]
BRANCH_P = [0.28, 0.14, 0.16, 0.08, 0.12, 0.07, 0.15]
BRANCH_TECH_BIAS = {"CSE": 0.9, "IT": 0.9, "AI&DS": 1.0, "ECE": 0.5,
                    "EEE": 0.35, "Mechanical": 0.15, "Civil": 0.1}

PROJECT_DOMAINS = ["Web Development", "Machine Learning/AI", "Mobile App",
                   "Data Analytics", "IoT/Embedded", "Cybersecurity",
                   "Cloud/DevOps", "Blockchain", "Game Development",
                   "Core Engineering", "Other"]
DOMAIN_P_TECH = [0.28, 0.20, 0.10, 0.10, 0.07, 0.04, 0.06, 0.03, 0.04, 0.02, 0.06]
DOMAIN_P_CORE = [0.05, 0.05, 0.05, 0.05, 0.20, 0.02, 0.01, 0.01, 0.01, 0.50, 0.05]
# how much each domain is valued by recruiters in the label model (small effect)
DOMAIN_VALUE = {"Web Development": 0.15, "Machine Learning/AI": 0.25,
                "Mobile App": 0.10, "Data Analytics": 0.20, "IoT/Embedded": 0.10,
                "Cybersecurity": 0.15, "Cloud/DevOps": 0.25, "Blockchain": 0.0,
                "Game Development": 0.0, "Core Engineering": 0.05, "Other": 0.0}
STACKS = {
    "Web Development": ["React+Node", "MERN", "Django", "Spring Boot", "PHP/Laravel", "Next.js"],
    "Machine Learning/AI": ["scikit-learn", "TensorFlow/PyTorch", "NLP/LLM", "Computer Vision"],
    "Mobile App": ["Flutter", "React Native", "Android(Kotlin)", "iOS(Swift)"],
    "Data Analytics": ["Python/Pandas", "Power BI/Tableau", "SQL", "Spark"],
    "IoT/Embedded": ["Arduino", "Raspberry Pi", "ESP32", "Embedded C"],
    "Cybersecurity": ["Pen-testing", "Cryptography", "Network Security"],
    "Cloud/DevOps": ["AWS", "Docker/K8s", "CI/CD", "Azure/GCP"],
    "Blockchain": ["Solidity/Ethereum", "Hyperledger"],
    "Game Development": ["Unity", "Unreal"],
    "Core Engineering": ["CAD/Design", "MATLAB/Simulink", "PLC/Automation", "Structural Analysis"],
    "Other": ["Other"],
}


def clip(a, lo, hi):
    return np.clip(a, lo, hi)


def generate(n, seed):
    rng = np.random.default_rng(seed)

    branch = rng.choice(BRANCHES, size=n, p=BRANCH_P)
    tech_bias = np.array([BRANCH_TECH_BIAS[b] for b in branch])
    college_tier = rng.choice([1, 2, 3], size=n, p=[0.15, 0.40, 0.45])

    # latent academic/ability factor (drives many correlated features)
    ability = rng.normal(0, 1, n)
    tier_boost = np.where(college_tier == 1, 0.35, np.where(college_tier == 2, 0.1, -0.1))
    ability = ability + tier_boost

    cgpa = clip(np.round(7.0 + 0.85 * ability + rng.normal(0, 0.55, n), 2), 4.5, 10.0)
    backlogs = np.where(rng.random(n) < clip(0.35 - 0.12 * ability, 0.02, 0.8),
                        rng.poisson(1.6, n) + 1, 0)
    backlogs = clip(backlogs, 0, 8).astype(int)
    attendance = clip(np.round(80 + 6 * ability + rng.normal(0, 7, n), 1), 50, 100)
    tenth = clip(np.round(79 + 7 * ability + rng.normal(0, 7, n), 1), 45, 99.5)
    twelfth = clip(np.round(76 + 7 * ability + rng.normal(0, 8, n), 1), 45, 99.5)

    # effort factor (independent of grades: grinders vs. non-grinders)
    effort = rng.normal(0, 1, n) + 0.3 * ability

    internships = clip(np.round(np.maximum(0, 0.8 + 0.45 * effort + 0.25 * tech_bias
                                           + rng.normal(0, 0.8, n))), 0, 4).astype(int)
    num_projects = clip(np.round(np.maximum(0, 2.2 + 0.9 * effort + rng.normal(0, 1.1, n))), 0, 10).astype(int)

    # project domains (primary project)
    is_tech = rng.random(n) < (0.35 + 0.6 * tech_bias)
    domain = np.empty(n, dtype=object)
    for i in range(n):
        p = DOMAIN_P_TECH if is_tech[i] else DOMAIN_P_CORE
        domain[i] = PROJECT_DOMAINS[rng.choice(len(PROJECT_DOMAINS), p=p)]
    domain = np.where(num_projects == 0, "NoProject", domain)
    stack = np.array([("NoProject" if d == "NoProject" else rng.choice(STACKS[d])) for d in domain], dtype=object)

    project_complexity = np.where(
        num_projects == 0, 0,
        clip(np.round(2.4 + 0.55 * effort + 0.3 * ability + rng.normal(0, 0.8, n)), 1, 5)).astype(int)
    deployed_projects = np.where(
        num_projects == 0, 0,
        np.minimum(num_projects, rng.binomial(np.maximum(num_projects, 1),
                                              clip(0.2 + 0.1 * effort, 0.02, 0.7)))).astype(int)
    github_projects = np.where(
        num_projects == 0, 0,
        np.minimum(num_projects + rng.integers(0, 3, n),
                   rng.binomial(np.maximum(num_projects, 1) + 2, clip(0.45 + 0.1 * effort, 0.05, 0.9)))).astype(int)
    team_projects = np.where(num_projects == 0, 0,
                             rng.binomial(np.maximum(num_projects, 1), 0.55)).astype(int)
    open_source_contrib = (rng.random(n) < clip(0.05 + 0.07 * effort + 0.05 * tech_bias, 0.005, 0.5)).astype(int)
    research_paper = (rng.random(n) < clip(0.03 + 0.03 * ability, 0.002, 0.2)).astype(int)

    hackathons = clip(np.round(np.maximum(0, 0.7 + 0.5 * effort + rng.normal(0, 0.9, n))), 0, 8).astype(int)
    certifications = clip(np.round(np.maximum(0, 1.3 + 0.6 * effort + rng.normal(0, 1.1, n))), 0, 10).astype(int)

    # coding / skills (1-10); tech branches higher
    def skill(base, w_eff=1.0, w_branch=2.0):
        return clip(np.round(base + w_eff * effort + w_branch * tech_bias - 1.2
                             + rng.normal(0, 1.3, n)), 1, 10).astype(int)

    python_skill = skill(4.5)
    java_skill = skill(4.0)
    cpp_skill = skill(4.0)
    sql_skill = skill(4.0, 0.8, 1.5)
    web_dev_skill = skill(3.5)
    ml_skill = skill(3.0, 0.9, 1.8)
    # skills boosted by matching project domain
    ml_skill = clip(ml_skill + np.where(domain == "Machine Learning/AI", 2, 0), 1, 10)
    web_dev_skill = clip(web_dev_skill + np.where(domain == "Web Development", 2, 0), 1, 10)

    coding_contest_rating = clip(np.round(np.maximum(
        0, 900 + 260 * effort + 120 * tech_bias * 3 + rng.normal(0, 220, n)) / 10) * 10, 0, 3000).astype(int)
    contest_active = (rng.random(n) < clip(0.15 + 0.2 * tech_bias + 0.1 * effort, 0.02, 0.9))
    coding_contest_rating = np.where(contest_active, coding_contest_rating, 0).astype(int)
    dsa_problems_solved = clip(np.round(np.maximum(
        0, 120 + 110 * effort + 150 * tech_bias + rng.normal(0, 90, n))), 0, 1500).astype(int)

    # soft skills / aptitude (0-100 and 1-10)
    aptitude_score = clip(np.round(60 + 11 * ability + 4 * effort + rng.normal(0, 9, n)), 10, 100).astype(int)
    logical_reasoning = clip(np.round(5.5 + 1.1 * ability + 0.5 * effort + rng.normal(0, 1.3, n)), 1, 10).astype(int)
    communication = clip(np.round(5.8 + 0.6 * ability + 0.7 * effort + rng.normal(0, 1.4, n)), 1, 10).astype(int)
    teamwork = clip(np.round(6.0 + 0.4 * effort + rng.normal(0, 1.4, n)), 1, 10).astype(int)
    leadership = clip(np.round(5.2 + 0.5 * effort + rng.normal(0, 1.6, n)), 1, 10).astype(int)
    problem_solving = clip(np.round(5.4 + 0.8 * ability + 0.6 * effort + rng.normal(0, 1.3, n)), 1, 10).astype(int)
    mock_interview_score = clip(np.round(55 + 6 * communication + 4 * problem_solving - 40
                                         + rng.normal(0, 9, n)), 0, 100).astype(int)
    resume_score = clip(np.round(50 + 4 * internships + 2.5 * num_projects + 1.5 * certifications
                                 + 3 * communication - 12 + rng.normal(0, 8, n)), 0, 100).astype(int)

    # ---------------- label: noisy logistic on latent "hireability" -----------------
    domain_val = np.array([DOMAIN_VALUE.get(d, 0.0) for d in domain])
    z = (
        0.55 * (cgpa - 7.0)
        - 0.55 * backlogs
        + 0.012 * (attendance - 80)
        + 0.55 * internships
        + 0.10 * np.minimum(num_projects, 6)
        + 0.22 * project_complexity
        + 0.18 * deployed_projects
        + 0.06 * github_projects
        + 0.25 * open_source_contrib
        + 0.12 * np.minimum(hackathons, 5)
        + 0.07 * np.minimum(certifications, 6)
        + 0.0009 * coding_contest_rating
        + 0.0012 * dsa_problems_solved
        + 0.022 * (aptitude_score - 60)
        + 0.10 * (communication - 6)
        + 0.06 * (problem_solving - 5.5)
        + 0.016 * (mock_interview_score - 55)
        + 0.06 * (np.maximum.reduce([python_skill, java_skill, cpp_skill]) - 5)
        + 0.04 * (ml_skill + web_dev_skill - 8) * tech_bias
        + domain_val
        + 0.30 * (2 - college_tier) * 0.5
        + 0.45 * (tech_bias - 0.5)           # tech branches have more openings
        + rng.normal(0, 1.15, n)             # irreducible noise (luck, market, interview day)
    )
    # shift intercept so overall placement rate is ~62%
    target_rate = 0.62
    lo, hi = -20.0, 20.0
    for _ in range(60):
        mid = (lo + hi) / 2
        rate = (1 / (1 + np.exp(-(z + mid)))).mean()
        lo, hi = (mid, hi) if rate < target_rate else (lo, mid)
    p_place = 1 / (1 + np.exp(-(z + (lo + hi) / 2)))
    placed = (rng.random(n) < p_place).astype(int)

    # package / company tier only for placed students
    tier_score = (p_place + 0.15 * (college_tier == 1) + rng.normal(0, 0.15, n))
    company_tier = np.where(placed == 0, "NotPlaced",
                            np.where(tier_score > 0.95, "Product/Top",
                                     np.where(tier_score > 0.70, "Mid-tier", "Mass Recruiter")))
    base_pkg = np.where(company_tier == "Product/Top", 18, np.where(company_tier == "Mid-tier", 8, 4))
    package_lpa = np.where(placed == 1,
                           np.round(np.maximum(2.5, base_pkg * np.exp(rng.normal(0, 0.28, n))), 1), 0.0)

    df = pd.DataFrame({
        "student_id": [f"SYN{str(i + 1).zfill(6)}" for i in range(n)],
        "branch": branch,
        "college_tier": college_tier,
        "cgpa": cgpa,
        "backlogs": backlogs,
        "attendance": attendance,
        "tenth_percentage": tenth,
        "twelfth_percentage": twelfth,
        "internships": internships,
        "projects": num_projects,
        "primary_project_domain": domain,
        "primary_project_stack": stack,
        "project_complexity": project_complexity,
        "deployed_projects": deployed_projects,
        "github_projects": github_projects,
        "team_projects": team_projects,
        "open_source_contrib": open_source_contrib,
        "research_paper": research_paper,
        "hackathons": hackathons,
        "certifications": certifications,
        "python_skill": python_skill,
        "java_skill": java_skill,
        "cpp_skill": cpp_skill,
        "sql_skill": sql_skill,
        "web_dev_skill": web_dev_skill,
        "ml_skill": ml_skill,
        "coding_contest_rating": coding_contest_rating,
        "dsa_problems_solved": dsa_problems_solved,
        "aptitude_score": aptitude_score,
        "logical_reasoning": logical_reasoning,
        "communication_skill": communication,
        "teamwork": teamwork,
        "leadership": leadership,
        "problem_solving": problem_solving,
        "mock_interview_score": mock_interview_score,
        "resume_score": resume_score,
        "placed": placed,
        "company_tier": company_tier,
        "package_lpa": package_lpa,
    })
    # sprinkle a little realistic missingness in self-reported fields
    for col, frac in [("attendance", 0.02), ("mock_interview_score", 0.08),
                      ("coding_contest_rating", 0.0), ("resume_score", 0.05)]:
        if frac > 0:
            idx = rng.random(n) < frac
            df[col] = df[col].astype("float").mask(idx)
    return df


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--rows", type=int, default=20000)
    ap.add_argument("--seed", type=int, default=20261028)
    ap.add_argument("--out", default="synthetic_placement_dataset.csv")
    a = ap.parse_args()
    df = generate(a.rows, a.seed)
    df.to_csv(a.out, index=False)
    print(f"wrote {a.out}: {df.shape[0]} rows x {df.shape[1]} cols, placement rate {df.placed.mean():.3f}")
