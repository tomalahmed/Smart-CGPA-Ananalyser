# 🎓 Smart CGPA Analyser

A sleek, real-time **CGPA Calculator & Academic Performance Dashboard** built for university students. Track your courses, calculate your cumulative GPA, and plan ahead with smart semester-based projections — all in one place.

![Made with HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![Styled with CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)

## ✨ Features

### 📊 Live Dashboard
- **Total Credits** earned with a visual progress bar
- **Quality Points** (Σ Grade × Credits) displayed in real time
- **Overall CGPA Ring** — an animated circular progress indicator updating instantly as you add courses

### 📋 Course Records Table
- Add unlimited courses with **course name / semester**, **credit hours**, and **grade point**
- Quality points are auto-calculated per row
- Remove any course with one click
- Footer totals for credits and quality points

### 🎯 Next-Semester Target Planner
- Enter your **Goal CGPA** and **Next Semester Credits**
- Instantly see the **Required GPA** you need to achieve in your next semester
- Formula used:
  > `Required GPA = (Goal × (Current Credits + Next Credits) − Current QP) ÷ Next Credits`

### 📅 Semester-Based CGPA Planner
- Input **Total Semesters**, **Completed Semesters**, and **Credits per Semester**
- **GPA Projection** — See your projected final CGPA if you maintain an assumed GPA for remaining semesters
- **Target Cracker** — Find out the average GPA per semester needed to hit your target CGPA
- Transparent formula breakdown included

### 📖 Grade Reference Card
Quick reference table for standard grade points (A/A+, B/B+, C/C+, D/F).

---

## 🗂️ Project Structure

```
Smart-CGPA-Analyser/
├── index.html      # Main UI — layout, sections, and markup
├── styles.css      # Custom styles (glassmorphism, animations, theme)
└── app.js          # All JavaScript logic (CGPA calculation, DOM updates)
```

---

## 🚀 Getting Started

No build tools or installation required — it's a pure client-side app.

1. **Clone the repository**
   ```bash
   git clone https://github.com/tomalahmed/Smart-CGPA-Ananalyser.git
   ```
2. **Open `index.html`** in any modern browser.

That's it! No server needed.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Structure & semantics |
| CSS3 + Custom Styles | Glassmorphism UI, animations |
| Tailwind CSS v4 (CDN) | Utility-first styling |
| Vanilla JavaScript | All logic and live calculations |
| Google Fonts (Work Sans) | Typography |

---

## 🎨 Design Highlights

- **Dark glassmorphism** aesthetic with an emerald/green accent palette
- Animated **pulse dot** live indicator in the navbar
- Smooth **SVG ring** animation for CGPA display
- Fully **responsive** — works on mobile, tablet, and desktop

---

## 👤 Author

Developed by [Tomal Ahmed](https://github.com/tomalahmed)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
