
// =====================================
// STUDYRESCUE - MAIN JAVASCRIPT
// =====================================

let subjects = JSON.parse(localStorage.getItem("sr_subjects")) || [];
let tasks = JSON.parse(localStorage.getItem("sr_tasks")) || [];
let exams = JSON.parse(localStorage.getItem("sr_exams")) || [];

const $ = id => document.getElementById(id);

// =====================================
// HELPER FUNCTIONS
// =====================================

function today() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function formatDate(date) {
    return new Date(date + "T00:00:00").toLocaleDateString(
        "en-IN",
        { day: "numeric", month: "short", year: "numeric" }
    );
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

function saveData() {
    localStorage.setItem("sr_subjects", JSON.stringify(subjects));
    localStorage.setItem("sr_tasks", JSON.stringify(tasks));
    localStorage.setItem("sr_exams", JSON.stringify(exams));
}

function getSubjectName(id) {
    const subject = subjects.find(s => s.id === id);
    return subject ? subject.name : "Unknown subject";
}

// =====================================
// DEFAULT SUBJECTS AND TOPICS
// =====================================

const defaultSubjects = [
    {
        name: "C Programming",
        description: "Learn the fundamentals of programming.",
        topics: [
            "Introduction to C and its features",
            "Variables, constants and data types",
            "Operators and expressions",
            "Input and output functions",
            "Decision making (if, if-else, switch)",
            "Loops (for, while, do-while)",
            "Arrays and strings",
            "Functions and recursion",
            "Pointers",
            "Structures and unions",
            "File handling"
        ]
    },
    {
        name: "Python Programming",
        description: "Understand Python from the basics.",
        topics: [
            "Introduction to Python",
            "Variables and data types",
            "Operators and expressions",
            "Conditional statements",
            "Loops",
            "Strings and string operations",
            "Lists, tuples and sets",
            "Dictionaries",
            "Functions and modules",
            "File handling",
            "Exception handling",
            "Object-oriented programming"
        ]
    },
    {
        name: "Java Programming",
        description: "Build a foundation in Java programming.",
        topics: [
            "Introduction to Java and JVM",
            "Variables and data types",
            "Operators",
            "Conditional statements and loops",
            "Classes and objects",
            "Constructors and methods",
            "Inheritance",
            "Polymorphism",
            "Abstraction and encapsulation",
            "Interfaces",
            "Exception handling",
            "Collections framework"
        ]
    },
    {
        name: "Data Structures",
        description: "Learn how data is organised and managed.",
        topics: [
            "Introduction to data structures",
            "Arrays",
            "Linked lists",
            "Stacks",
            "Queues",
            "Searching techniques",
            "Sorting techniques",
            "Trees and binary trees",
            "Binary search trees",
            "Graphs",
            "Hashing"
        ]
    },
    {
        name: "Database Management Systems",
        description: "Understand databases and SQL.",
        topics: [
            "Introduction to DBMS",
            "Database models",
            "ER diagrams",
            "Relational model",
            "Keys and constraints",
            "SQL basics",
            "DDL, DML and DCL commands",
            "Joins and subqueries",
            "Normalization",
            "Transactions and ACID properties",
            "Concurrency control"
        ]
    },
    {
        name: "Operating Systems",
        description: "Understand how computer systems work.",
        topics: [
            "Introduction to operating systems",
            "Types of operating systems",
            "Process management",
            "Process scheduling",
            "Threads",
            "CPU scheduling algorithms",
            "Process synchronization",
            "Deadlocks",
            "Memory management",
            "Virtual memory",
            "File systems"
        ]
    },
    {
        name: "Computer Networks",
        description: "Learn the basics of computer communication.",
        topics: [
            "Introduction to computer networks",
            "Network types (LAN, MAN, WAN)",
            "Network topologies",
            "OSI model",
            "TCP/IP model",
            "Transmission media",
            "IP addressing",
            "Subnetting basics",
            "TCP and UDP",
            "Routing and switching",
            "DNS, HTTP and HTTPS",
            "Network security basics"
        ]
    },
    {
        name: "Software Engineering",
        description: "Learn how software is planned and developed.",
        topics: [
            "Introduction to software engineering",
            "Software development life cycle",
            "Waterfall model",
            "Agile methodology",
            "Requirement analysis",
            "Software design",
            "UML diagrams",
            "Software testing",
            "Software maintenance",
            "Project management"
        ]
    },
    {
        name: "Web Development",
        description: "Build websites using essential web technologies.",
        topics: [
            "Introduction to the web",
            "HTML document structure",
            "HTML elements and forms",
            "CSS selectors and properties",
            "CSS box model",
            "Flexbox and Grid",
            "Responsive web design",
            "JavaScript basics",
            "DOM manipulation",
            "Events and event handling",
            "Local Storage",
            "Introduction to APIs"
        ]
    },
    {
        name: "Mathematics for Computing",
        description: "Practise important mathematical concepts.",
        topics: [
            "Number systems",
            "Sets and set operations",
            "Relations and functions",
            "Logic and propositions",
            "Truth tables",
            "Matrices",
            "Permutations and combinations",
            "Probability basics",
            "Graph theory basics",
            "Boolean algebra"
        ]
    }
];

// Add built-in subjects and topics without duplicates
function loadDefaultSubjects() {
    defaultSubjects.forEach((defaultSubject, index) => {

        let subject = subjects.find(
            s => s.name.toLowerCase() === defaultSubject.name.toLowerCase()
        );

        if (!subject) {
            subject = {
                id: Date.now() + index,
                name: defaultSubject.name,
                description: defaultSubject.description,
                isDefault: true
            };

            subjects.push(subject);
        }

        defaultSubject.topics.forEach(topicName => {

            const alreadyExists = tasks.some(task =>
                task.subjectId === subject.id &&
                task.name.toLowerCase() === topicName.toLowerCase()
            );

            if (!alreadyExists) {
                tasks.push({
                    id: Date.now() + Math.floor(Math.random() * 1000000),
                    subjectId: subject.id,
                    name: topicName,
                    date: today(),
                    priority: "Normal",
                    completed: false,
                    isDefault: true
                });
            }
        });
    });

    saveData();
}

// =====================================
// CURRENT DATE
// =====================================

$("todayDate").textContent = new Date().toLocaleDateString(
    "en-IN",
    { weekday: "long", day: "numeric", month: "long", year: "numeric" }
);

// =====================================
// SUBJECT MANAGEMENT
// =====================================

$("addSubjectBtn").addEventListener("click", () => {
    $("subjectForm").classList.remove("hidden");
    $("subjectName").focus();
});

$("cancelSubject").addEventListener("click", () => {
    $("subjectForm").classList.add("hidden");
    $("subjectForm").reset();
});

$("subjectForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const name = $("subjectName").value.trim();
    const description = $("subjectDescription").value.trim();

    if (!name) return;

    const duplicate = subjects.some(
        s => s.name.toLowerCase() === name.toLowerCase()
    );

    if (duplicate) {
        alert("This subject already exists.");
        return;
    }

    subjects.push({
        id: Date.now(),
        name,
        description,
        isDefault: false
    });

    saveData();
    this.reset();
    this.classList.add("hidden");

    renderAll();
});

function renderSubjects() {
    const container = $("subjectList");
    const icons = ["📘", "💻", "📗", "📝", "📙", "📚"];

    if (subjects.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span>📖</span>
                <h3>No subjects yet</h3>
                <p>Add a subject to get started.</p>
            </div>
        `;
    } else {
        container.innerHTML = subjects.map((subject, index) => {

            const subjectTasks = tasks.filter(
                t => t.subjectId === subject.id
            );

            const completed = subjectTasks.filter(t => t.completed).length;
            const total = subjectTasks.length;

            const percent = total
                ? Math.round((completed / total) * 100)
                : 0;

            return `
                <div class="subject-card">

                    <div class="subject-top">

                        <div class="subject-symbol">
                            ${icons[index % icons.length]}
                        </div>

                        <div class="subject-actions">
                            <button onclick="editSubject(${subject.id})">Edit</button>
                            <button onclick="deleteSubject(${subject.id})">Delete</button>
                        </div>

                    </div>

                    <h3>${escapeHTML(subject.name)}</h3>

                    <p>${escapeHTML(
                        subject.description || "Your learning journey starts here."
                    )}</p>

                    <div class="subject-progress">
                        <span>${completed} of ${total} topics completed</span>
                        <strong>${percent}%</strong>
                    </div>

                    <div class="progress-track">
                        <div class="progress-fill" style="width:${percent}%"></div>
                    </div>

                    <div class="subject-topics">

                        <div class="topic-list-heading">Your topics</div>

                        ${subjectTasks.map(task => `
                            <label class="subject-topic ${task.completed ? "completed" : ""}">
                                <input
                                    type="checkbox"
                                    ${task.completed ? "checked" : ""}
                                    onchange="toggleTask(${task.id})"
                                >
                                <span>${escapeHTML(task.name)}</span>
                            </label>
                        `).join("")}

                        <div class="subject-topic-count">
                            ${total - completed} topics remaining
                        </div>

                        <button
                            class="subject-add-topic"
                            onclick="goToAddTopic(${subject.id})">
                            + Add your own topic
                        </button>

                    </div>

                </div>
            `;
        }).join("");
    }

    // Update subject dropdown
    $("taskSubject").innerHTML = `
        <option value="">Select subject</option>
        ${subjects.map(s => `
            <option value="${s.id}">${escapeHTML(s.name)}</option>
        `).join("")}
    `;
}

function goToAddTopic(id) {
    $("taskSubject").value = id;

    document.getElementById("planner").scrollIntoView({
        behavior: "smooth"
    });

    $("taskName").focus();
}

function editSubject(id) {
    const subject = subjects.find(s => s.id === id);
    if (!subject) return;

    const newName = prompt("Enter the new subject name:", subject.name);

    if (newName === null) return;

    if (!newName.trim()) {
        alert("Subject name cannot be empty.");
        return;
    }

    const duplicate = subjects.some(
        s => s.id !== id &&
        s.name.toLowerCase() === newName.trim().toLowerCase()
    );

    if (duplicate) {
        alert("Another subject already has this name.");
        return;
    }

    const newDescription = prompt(
        "Enter subject description:",
        subject.description || ""
    );

    subject.name = newName.trim();

    if (newDescription !== null) {
        subject.description = newDescription.trim();
    }

    saveData();
    renderAll();
}

function deleteSubject(id) {
    const subject = subjects.find(s => s.id === id);
    if (!subject) return;

    if (!confirm(`Delete "${subject.name}" and all its study topics?`)) {
        return;
    }

    subjects = subjects.filter(s => s.id !== id);
    tasks = tasks.filter(t => t.subjectId !== id);

    saveData();
    renderAll();
}

// =====================================
// ADD CUSTOM TOPICS
// =====================================

$("taskForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const subjectId = Number($("taskSubject").value);
    const name = $("taskName").value.trim();
    const date = $("taskDate").value;
    const priority = $("taskPriority").value;

    if (!subjectId || !name || !date) {
        alert("Please fill in all required fields.");
        return;
    }

    const duplicate = tasks.some(task =>
        task.subjectId === subjectId &&
        task.name.toLowerCase() === name.toLowerCase()
    );

    if (duplicate) {
        alert("This topic already exists in the selected subject.");
        return;
    }

    tasks.push({
        id: Date.now(),
        subjectId,
        name,
        date,
        priority,
        completed: false,
        isDefault: false
    });

    saveData();

    this.reset();
    $("taskDate").value = today();

    renderAll();
});

// =====================================
// TASK MANAGEMENT
// =====================================

function renderTasks() {
    const container = $("taskList");
    const filter = $("taskFilter").value;
    const currentDate = today();

    let filteredTasks = [...tasks];

    if (filter === "pending") {
        filteredTasks = tasks.filter(t => !t.completed);
    }

    if (filter === "completed") {
        filteredTasks = tasks.filter(t => t.completed);
    }

    if (filter === "missed") {
        filteredTasks = tasks.filter(
            t => !t.completed && t.date < currentDate
        );
    }

    filteredTasks.sort((a, b) => a.date.localeCompare(b.date));

    if (filteredTasks.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span>🌷</span>
                <h3>Nothing to show here</h3>
                <p>Add a study topic or choose another filter.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredTasks.map(task => {

        const missed = !task.completed && task.date < currentDate;

        return `
            <div class="task-card">

                <input
                    class="task-check"
                    type="checkbox"
                    ${task.completed ? "checked" : ""}
                    onchange="toggleTask(${task.id})"
                    aria-label="Mark topic as completed"
                >

                <div class="task-info ${task.completed ? "completed" : ""}">
                    <h4>${escapeHTML(task.name)}</h4>
                    <p>${escapeHTML(getSubjectName(task.subjectId))}</p>
                </div>

                <div class="task-meta">

                    <span class="priority ${escapeHTML(task.priority)}">
                        ${escapeHTML(task.priority)}
                    </span>

                    <span class="task-date">
                        ${formatDate(task.date)}
                    </span>

                    ${missed ? '<span class="priority High">Missed</span>' : ""}

                </div>

                <div class="task-actions">

                    ${!task.completed ? `
                        <button onclick="rescheduleTask(${task.id})">
                            Reschedule
                        </button>
                    ` : ""}

                    <button onclick="deleteTask(${task.id})">
                        Delete
                    </button>

                </div>

            </div>
        `;
    }).join("");
}

// Mark topic completed or incomplete
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    task.completed = !task.completed;

    saveData();
    renderAll();
}

// Delete topic
function deleteTask(id) {
    if (!confirm("Are you sure you want to delete this topic?")) {
        return;
    }

    tasks = tasks.filter(t => t.id !== id);

    saveData();
    renderAll();
}

// Reschedule topic
function rescheduleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newDate = prompt(
        "Enter your new study date (YYYY-MM-DD):",
        today()
    );

    if (newDate === null) return;

    if (!/^\d{4}-\d{2}-\d{2}$/.test(newDate)) {
        alert("Please enter a date in YYYY-MM-DD format.");
        return;
    }

    const [year, month, day] = newDate.split("-").map(Number);
    const parsed = new Date(year, month - 1, day);

    if (
        parsed.getFullYear() !== year ||
        parsed.getMonth() !== month - 1 ||
        parsed.getDate() !== day
    ) {
        alert("Please enter a valid calendar date.");
        return;
    }

    task.date = newDate;

    saveData();
    renderAll();
}

$("taskFilter").addEventListener("change", renderTasks);

// =====================================
// EXAM MANAGEMENT
// =====================================

$("examForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const name = $("examName").value.trim();
    const date = $("examDate").value;

    if (!name || !date) return;

    if (date < today()) {
        alert("Please select today or a future date for your exam.");
        return;
    }

    exams.push({
        id: Date.now(),
        name,
        date
    });

    saveData();
    this.reset();

    renderExams();
});

function renderExams() {
    const container = $("examList");

    const sortedExams = [...exams].sort(
        (a, b) => a.date.localeCompare(b.date)
    );

    if (sortedExams.length === 0) {
        container.innerHTML = `
            <p style="font-size:11px;color:#aaa6b8;margin-top:14px;">
                No upcoming exams. Add your exam dates above.
            </p>
        `;
        return;
    }

    container.innerHTML = sortedExams.map(exam => {

        const days = Math.ceil(
            (
                new Date(exam.date + "T00:00:00") -
                new Date(today() + "T00:00:00")
            ) / 86400000
        );

        const countdown = days === 0
            ? "Today!"
            : days === 1
                ? "Tomorrow"
                : `${days} days left`;

        return `
            <div class="exam-item">

                <div>
                    <strong>${escapeHTML(exam.name)}</strong>
                    <small>${formatDate(exam.date)}</small>
                </div>

                <div style="display:flex;align-items:center;gap:8px;">
                    <span class="exam-count">${countdown}</span>

                    <button class="exam-delete"
                        onclick="deleteExam(${exam.id})">✕</button>
                </div>

            </div>
        `;
    }).join("");
}

function deleteExam(id) {
    exams = exams.filter(e => e.id !== id);
    saveData();
    renderExams();
}

// =====================================
// DASHBOARD STATISTICS
// =====================================

function updateDashboard() {
    const completed = tasks.filter(t => t.completed).length;
    const pending = tasks.length - completed;

    const percentage = tasks.length
        ? Math.round((completed / tasks.length) * 100)
        : 0;

    $("subjectCount").textContent = subjects.length;
    $("pendingCount").textContent = pending;
    $("completedCount").textContent = completed;
    $("overallProgress").textContent = percentage + "%";

    $("progressText").textContent = percentage + "%";
    $("progressBar").style.width = percentage + "%";

    if (tasks.length === 0) {
        $("progressMessage").textContent =
            "Start completing topics to see your progress.";
    } else if (percentage === 100) {
        $("progressMessage").textContent =
            "Amazing! You've completed all your study topics. ✨";
    } else if (percentage >= 50) {
        $("progressMessage").textContent =
            "You're doing great! Keep up the momentum. 🌷";
    } else {
        $("progressMessage").textContent =
            "Every small step counts. Keep going! 💜";
    }
}

// =====================================
// RENDER EVERYTHING
// =====================================

function renderAll() {
    renderSubjects();
    renderTasks();
    renderExams();
    updateDashboard();
}

// =====================================
// NAVIGATION
// =====================================

document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {

        document.querySelectorAll(".nav-link").forEach(item => {
            item.classList.remove("active");
        });

        link.classList.add("active");
    });
});

// =====================================
// INITIAL WEBSITE LOAD
// =====================================

$("taskDate").value = today();

loadDefaultSubjects();

renderAll();
