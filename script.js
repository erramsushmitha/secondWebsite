
const modules = [
    {
        title: "Master Essential Concepts and Skills",
        description: "Develop a strong foundation in the essential skills required for your professional role.",
        category: "Fundamentals"
    },
    {
        title: "Build Deep Expertise in Core Concepts",
        description: "Explore important concepts and develop a deeper understanding of your subject.",
        category: "Core Learning"
    },
    {
        title: "Understand Theoretical Foundations",
        description: "Learn the theories and principles behind practical implementation.",
        category: "Theory"
    },
    {
        title: "Apply Knowledge Through Hands-on Exercises",
        description: "Practice concepts through interactive exercises and real-world examples.",
        category: "Practice"
    },
    {
        title: "Follow Industry Expert Tutorials",
        description: "Learn professional techniques through structured guided tutorials.",
        category: "Tutorials"
    },
    {
        title: "Build Small Practical Projects",
        description: "Create mini projects to demonstrate your understanding of individual concepts.",
        category: "Projects"
    },
    {
        title: "Learn Best Practices and Industry Standards",
        description: "Understand professional standards and improve the quality of your work.",
        category: "Best Practices"
    },
    {
        title: "Identify and Avoid Common Pitfalls",
        description: "Recognize common mistakes and learn effective ways to prevent them.",
        category: "Problem Solving"
    },
    {
        title: "Take Quizzes and Self-Assessments",
        description: "Evaluate your knowledge through quizzes and practical assessments.",
        category: "Assessment"
    },
    {
        title: "Identify Knowledge Gaps",
        description: "Discover areas that need improvement and focus on continuous development.",
        category: "Assessment"
    },
    {
        title: "Attend Regular Mentor Feedback Sessions",
        description: "Receive guidance and discuss your progress with your mentor.",
        category: "Mentorship"
    },
    {
        title: "Receive Personalized Guidance and Career Advice",
        description: "Gain professional insights and direction for your career development.",
        category: "Career Growth"
    },
    {
        title: "Gain Practical Experience with Core Tools",
        description: "Build confidence using tools and technologies relevant to your role.",
        category: "Tools"
    },
    {
        title: "Develop Confidence in Advanced Challenges",
        description: "Apply your knowledge to solve complex tasks independently.",
        category: "Advanced Skills"
    }
];

const descriptions = {
    Fundamentals: "Learn the basics and build a strong foundation.",
    "Core Learning": "Understand the concepts in greater depth.",
    Theory: "Explore the principles behind practical work.",
    Practice: "Apply your knowledge through exercises.",
    Tutorials: "Follow structured expert learning materials.",
    Projects: "Create small practical projects.",
    "Best Practices": "Follow professional quality standards.",
    "Problem Solving": "Recognize and avoid common mistakes.",
    Assessment: "Evaluate your understanding and progress.",
    Mentorship: "Learn from regular mentor feedback.",
    "Career Growth": "Develop your professional direction.",
    Tools: "Gain experience with important tools.",
    "Advanced Skills": "Prepare for more complex challenges."
};

let completedModules = JSON.parse(
    localStorage.getItem("skillupCompleted") || "[]"
);

const moduleGrid = document.getElementById("moduleGrid");
const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filterSelect");

function saveProgress() {
    localStorage.setItem(
        "skillupCompleted",
        JSON.stringify(completedModules)
    );
}

function renderModules() {
    const search = searchInput.value.toLowerCase().trim();
    const filter = filterSelect.value;

    moduleGrid.innerHTML = "";

    const filteredModules = modules
        .map((module, index) => ({ ...module, index }))
        .filter(module => {
            const matchesSearch =
                module.title.toLowerCase().includes(search) ||
                module.description.toLowerCase().includes(search) ||
                module.category.toLowerCase().includes(search);

            const isDone = completedModules.includes(module.index);

            const matchesFilter =
                filter === "all" ||
                (filter === "completed" && isDone) ||
                (filter === "pending" && !isDone);

            return matchesSearch && matchesFilter;
        });

    document.getElementById("emptyMessage").hidden =
        filteredModules.length !== 0;

    filteredModules.forEach(module => {
        const done = completedModules.includes(module.index);

        const card = document.createElement("article");
        card.className = "module-card";

        card.innerHTML = `
            <div class="module-top">
                <span class="module-number">
                    MODULE ${String(module.index + 1).padStart(2, "0")}
                </span>
                <span class="status ${done ? "done" : ""}">
                    ${done ? "✓ Completed" : "● In Progress"}
                </span>
            </div>
            <h3>${module.title}</h3>
            <p>${module.description}</p>
            <div class="module-bottom">
                <small>${module.category}</small>
                <button class="complete-btn"
                    data-index="${module.index}"
                    ${done ? "disabled" : ""}>
                    ${done ? "✓ Finished" : "Mark Complete"}
                </button>
            </div>
        `;

        moduleGrid.appendChild(card);
    });
}

function updateDashboard() {
    const completed = completedModules.length;
    const total = modules.length;
    const remaining = total - completed;
    const percentage = Math.round((completed / total) * 100);

    document.getElementById("completedCount").textContent = completed;
    document.getElementById("remainingCount").textContent = remaining;
    document.getElementById("progressNumber").textContent = percentage + "%";
    document.getElementById("progressBar").style.width = percentage + "%";
    document.getElementById("progressLabel").textContent =
        percentage + "% completed";
    document.getElementById("moduleCounter").textContent =
        `${completed} / ${total} Done`;

    updateChart();
}

moduleGrid.addEventListener("click", event => {
    const button = event.target.closest(".complete-btn");

    if (!button || button.disabled) return;

    const index = Number(button.dataset.index);

    if (!completedModules.includes(index)) {
        completedModules.push(index);
        saveProgress();
        renderModules();
        updateDashboard();
    }
});

searchInput.addEventListener("input", renderModules);
filterSelect.addEventListener("change", renderModules);

// Dark / Light Mode

document.getElementById("themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");

    localStorage.setItem("skillupTheme", isDark ? "dark" : "light");

    document.getElementById("themeToggle").textContent =
        isDark ? "☀ Change Theme" : "☾ Change Theme";

    updateChart();
});

if (localStorage.getItem("skillupTheme") === "dark") {
    document.body.classList.add("dark");
    document.getElementById("themeToggle").textContent = "☀ Change Theme";
}

// Mobile Sidebar

document.getElementById("menuToggle").addEventListener("click", () => {
    document.getElementById("sidebar").classList.toggle("show");
});

document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
        document.querySelectorAll(".nav-link").forEach(item => {
            item.classList.remove("active");
        });

        link.classList.add("active");
        document.getElementById("sidebar").classList.remove("show");
    });
});

// Analytics Chart

let progressChart;

function updateChart() {
    const canvas = document.getElementById("progressChart");
    if (!canvas || typeof Chart === "undefined") return;

    const completed = completedModules.length;
    const pending = modules.length - completed;
    const dark = document.body.classList.contains("dark");

    if (progressChart) {
        progressChart.destroy();
    }

    progressChart = new Chart(canvas, {
        type: "doughnut",
        data: {
            labels: ["Completed", "Remaining"],
            datasets: [{
                data: [completed, pending],
                backgroundColor: ["#795be9", "#dfe0ec"],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "72%",
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        color: dark ? "#f1f2ff" : "#555",
                        padding: 25,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    enabled: true
                }
            }
        }
    });
}

// Interactive Quiz

const questions = [
    {
        question: "What is the main purpose of learning core concepts?",
        options: [
            "To memorize random information",
            "To build a strong foundation",
            "To avoid practical work",
            "To skip project development"
        ],
        answer: 1
    },
    {
        question: "Why are hands-on exercises important?",
        options: [
            "They replace all theory",
            "They increase confusion",
            "They help apply theoretical knowledge",
            "They reduce learning"
        ],
        answer: 2
    },
    {
        question: "What is the purpose of best practices?",
        options: [
            "To improve quality and consistency",
            "To make work slower",
            "To avoid documentation",
            "To ignore standards"
        ],
        answer: 0
    },
    {
        question: "Why should learners take self-assessments?",
        options: [
            "To avoid feedback",
            "To identify knowledge gaps",
            "To stop practicing",
            "To skip tutorials"
        ],
        answer: 1
    },
    {
        question: "What is the benefit of mentor feedback?",
        options: [
            "It prevents independent learning",
            "It replaces all projects",
            "It provides guidance and improvement suggestions",
            "It removes learning objectives"
        ],
        answer: 2
    }
];

let currentQuestion = 0;
let score = 0;
let answered = false;

const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("optionsContainer");
const nextButton = document.getElementById("nextButton");
const feedback = document.getElementById("feedback");

function loadQuestion() {
    answered = false;

    const question = questions[currentQuestion];

    document.getElementById("questionNumber").textContent =
        `QUESTION ${currentQuestion + 1} OF ${questions.length}`;

    document.getElementById("quizScore").textContent =
        `Score: ${score}`;

    document.getElementById("quizProgress").style.width =
        ((currentQuestion + 1) / questions.length * 100) + "%";

    questionText.textContent = question.question;
    optionsContainer.innerHTML = "";
    feedback.textContent = "";

    nextButton.disabled = true;
    nextButton.textContent =
        currentQuestion === questions.length - 1
            ? "Finish Quiz"
            : "Next Question →";

    question.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.className = "option-btn";
        button.textContent =
            String.fromCharCode(65 + index) + ". " + option;

        button.addEventListener("click", () => selectAnswer(index));

        optionsContainer.appendChild(button);
    });
}

function selectAnswer(selected) {
    if (answered) return;

    answered = true;

    const question = questions[currentQuestion];
    const buttons = optionsContainer.querySelectorAll(".option-btn");

    buttons.forEach((button, index) => {
        button.disabled = true;

        if (index === question.answer) {
            button.classList.add("correct");
        } else if (index === selected) {
            button.classList.add("wrong");
        }
    });

    if (selected === question.answer) {
        score++;
        feedback.textContent = "✓ Excellent! Your answer is correct.";
        feedback.style.color = "#26a567";
    } else {
        feedback.textContent =
            "✗ Not quite. Review the highlighted correct answer.";
        feedback.style.color = "#df5555";
    }

    document.getElementById("quizScore").textContent =
        `Score: ${score}`;

    nextButton.disabled = false;
}

nextButton.addEventListener("click", () => {
    if (!answered) return;

    currentQuestion++;

    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        showResult();
    }
});

function showResult() {
    document.getElementById("questionNumber").textContent = "QUIZ COMPLETED";
    document.getElementById("quizProgress").style.width = "100%";

    questionText.textContent =
        `Your final score is ${score} out of ${questions.length}!`;

    optionsContainer.innerHTML = "";

    feedback.textContent =
        score >= 4
            ? "Excellent performance! Keep learning and growing."
            : "Good effort! Review your modules and try again.";

    feedback.style.color = "#795be9";

    nextButton.hidden = true;
    document.getElementById("restartButton").hidden = false;
}

document.getElementById("restartButton").addEventListener("click", () => {
    currentQuestion = 0;
    score = 0;
    nextButton.hidden = false;
    document.getElementById("restartButton").hidden = true;
    loadQuestion();
});


// Initialize Dashboard

renderModules();
updateDashboard();
loadQuestion();
