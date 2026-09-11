# Question Provenance & Source Classification Register

## 1. Provenance Taxonomy & Metadata Standards

To maintain total academic integrity and prevent misleading claims, every question and challenge in the Capgemini Prep Platform contains strict provenance metadata. Under no circumstances is a synthetic or practice problem labeled as an "Actual Capgemini Question" without publicly verified candidate debrief documentation.

Each item in the question database adheres to this classification schema:

```json
{
  "sourceType": "candidate-reported" | "publicly-reported" | "official" | "practice" | "illustrative" | "AI-generated" | "adapted",
  "sourceReliability": "high" | "medium" | "low",
  "reportedYear": 2026,
  "assessmentVersion": "2026-2027",
  "isReportedPattern": true,
  "isActualQuestion": false,
  "source": "Capgemini Exceller Campus Drive Q4 2025"
}
```

---

## 2. Definitions of Source Types

| Source Type | Description | Strict Usage Rule |
| :--- | :--- | :--- |
| `official` | Material directly published in official Capgemini sample assessment kits, brochures, or partner portal instructions (e.g. CoCubes platform instructions). | Reserved exclusively for verbatim official guidelines and authorized sample teasers. |
| `candidate-reported` | Questions directly debriefed by candidates immediately following on-campus or virtual assessment drives. | Applied when multiple independent student reports corroborate the problem statement, inputs, and constraints. |
| `publicly-reported` | Questions documented on established recruitment forums (PrepInsta, FACE Prep, Unstop, GeekforGeeks placement archives). | Cross-referenced against known syllabus rubrics. |
| `practice` | High-yield conceptual questions curated by curriculum experts specifically targeting known Capgemini testing patterns. | Clearly designated as practice/reinforcement material. |
| `illustrative` | Pedagogical examples designed to illustrate edge cases, dry-run tracing mechanics, or common traps. | Used in study notes, dry-run walkthroughs, and prompt engineering examples. |
| `AI-generated` | Procedurally synthesized variations (e.g. algorithmic grid puzzles, permutation variations) validated through automated solvers. | Must pass 100% automated correctness and uniqueness checks before entering the active pool. |
| `adapted` | Classical computer science problems adapted to fit Capgemini time and memory limits. | Standard algorithms tailored for 20–45 minute rounds. |

---

## 3. Reliability Scoring Rubric

- **`high`**: Verified by 3+ independent placement reports or directly aligned with standard CoCubes/Wheebox question banks.
- **`medium`**: Reported by 1–2 candidates or sourced from placement preparation archives with high relevance to current syllabus topics.
- **`low`**: Emerging pattern with limited initial confirmation; included for comprehensive forward-looking coverage.

---

## 4. Question Validation Lifecycle

Every question in the database undergoes three-tier validation:
1. **Mathematical & Logical Soundness**: Exactly one valid answer exists. For MCQs, distractors are plausible and target common misconceptions.
2. **Code Compilation & Execution**: For coding and debugging problems, code is compiled and verified against complete test case suites (visible + hidden edge cases: empty input, boundary constraints, negative numbers).
3. **Solvability Guarantee**: For cognitive games (Geo-Sudo, Spacio, Motion), procedural generators execute a verification solver guaranteeing exactly one unique solution before serving to the student.
