document.addEventListener("DOMContentLoaded", () => {
    const courseList = document.getElementById("course-list");
    const addCourseBtn = document.getElementById("add-course-btn");
    const resetBtn = document.getElementById("reset-btn");
    const calculateBtn = document.getElementById("calculate-btn");
    const resultCard = document.getElementById("result-card");

    const totalUnitsEl = document.getElementById("total-units");
    const totalPointsEl = document.getElementById("total-points");
    const gpaValueEl = document.getElementById("gpa-value");
    const standingTextEl = document.getElementById("standing-text");

    // Function to create a new course row
    function addCourseRow(courseCode = "", units = "", grade = "5") {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>
                <input type="text" class="course-name" placeholder="e.g. CSC 101" value="${courseCode}">
            </td>
            <td>
                <input type="number" class="course-units" min="1" max="10" placeholder="Units" value="${units}" required>
            </td>
            <td>
                <select class="course-grade">
                    <option value="5" ${grade === "5" ? "selected" : ""}>A (5.0)</option>
                    <option value="4" ${grade === "4" ? "selected" : ""}>B (4.0)</option>
                    <option value="3" ${grade === "3" ? "selected" : ""}>C (3.0)</option>
                    <option value="2" ${grade === "2" ? "selected" : ""}>D (2.0)</option>
                    <option value="1" ${grade === "1" ? "selected" : ""}>E (1.0)</option>
                    <option value="0" ${grade === "0" ? "selected" : ""}>F (0.0)</option>
                </select>
            </td>
            <td>
                <button type="button" class="remove-btn" title="Remove Course">X</button>
            </td>
        `;

        // Event listener to remove the row
        row.querySelector(".remove-btn").addEventListener("click", () => {
            if (courseList.children.length > 1) {
                row.remove();
            } else {
                alert("You must have at least one course row.");
            }
        });

        courseList.appendChild(row);
    }

    // Initialize with 4 empty course rows
    function initDefaultRows() {
        courseList.innerHTML = "";
        for (let i = 0; i < 4; i++) {
            addCourseRow();
        }
        resultCard.classList.add("hidden");
    }

    // Calculate GPA logic
    function calculateGPA() {
        const rows = courseList.querySelectorAll("tr");
        let totalUnits = 0;
        let totalQualityPoints = 0;
        let isValid = true;

        rows.forEach((row) => {
            const unitsInput = row.querySelector(".course-units");
            const gradeSelect = row.querySelector(".course-grade");

            const units = parseFloat(unitsInput.value);
            const gradePoint = parseFloat(gradeSelect.value);

            if (isNaN(units) || units <= 0) {
                isValid = false;
                unitsInput.style.borderColor = "#d9534f";
            } else {
                unitsInput.style.borderColor = "#ccc";
                totalUnits += units;
                totalQualityPoints += units * gradePoint;
            }
        });

        if (!isValid) {
            alert("Please enter valid credit units (greater than 0) for all listed courses.");
            return;
        }

        const gpa = totalUnits > 0 ? (totalQualityPoints / totalUnits).toFixed(2) : "0.00";

        // Update UI
        totalUnitsEl.textContent = totalUnits;
        totalPointsEl.textContent = totalQualityPoints;
        gpaValueEl.textContent = gpa;
        standingTextEl.textContent = `Academic Standing: ${getClassOfDegree(parseFloat(gpa))}`;

        resultCard.classList.remove("hidden");
    }

    // Determine Nigerian University Class of Degree standing
    function getClassOfDegree(gpa) {
        if (gpa >= 4.50) return "First Class Honours";
        if (gpa >= 3.50) return "Second Class Honours (Upper Division)";
        if (gpa >= 2.40) return "Second Class Honours (Lower Division)";
        if (gpa >= 1.50) return "Third Class Honours";
        if (gpa >= 1.00) return "Pass";
        return "Fail / Probation";
    }

    // Button Event Listeners
    addCourseBtn.addEventListener("click", () => addCourseRow());
    resetBtn.addEventListener("click", initDefaultRows);
    calculateBtn.addEventListener("click", calculateGPA);

    // Load initial state
    initDefaultRows();
});
