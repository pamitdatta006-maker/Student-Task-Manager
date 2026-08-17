let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


// ==========================================
// ADD TASK
// ==========================================

function addTask() {

    let input = document.getElementById("taskInput");
    let priorityInput = document.getElementById("priorityInput");
    let dateInput = document.getElementById("dateInput");

    let taskText = input.value.trim();

    if (taskText === "") {
        alert("Please enter a task.");
        input.focus();
        return;
    }

    let task = {
        text: taskText,
        priority: priorityInput.value,
        date: dateInput.value,
        completed: false
    };

    tasks.push(task);

    saveTasks();

    input.value = "";
    dateInput.value = "";

    displayTasks();
}


// ==========================================
// DISPLAY TASKS
// ==========================================

function displayTasks() {

    let taskList = document.getElementById("taskList");

    let searchInput = document.getElementById("searchInput");
    let filterInput = document.getElementById("filterInput");

    let searchText = searchInput.value.toLowerCase();
    let filter = filterInput.value;

    taskList.innerHTML = "";

    let visibleTasks = tasks.filter(function(task) {

        let matchesSearch =
            task.text.toLowerCase().includes(searchText);

        let matchesFilter = true;

        if (filter === "completed") {
            matchesFilter = task.completed === true;
        }

        if (filter === "pending") {
            matchesFilter = task.completed === false;
        }

        return matchesSearch && matchesFilter;
    });


    visibleTasks.forEach(function(task) {

        let index = tasks.indexOf(task);

        let li = document.createElement("li");

        li.className = "task";

        if (task.completed) {
            li.classList.add("completed");
        }


        // Fix old tasks that don't have priority
        let priority = task.priority || "Medium";

        let priorityClass = priority.toLowerCase();

        let dateText = task.date
            ? "Due: " + task.date
            : "No due date";


        li.innerHTML = `

            <div class="task-info">

                <div class="task-title">
                    ${task.text}
                </div>

                <div class="task-date">
                    ${dateText}
                </div>

            </div>


            <span class="priority ${priorityClass}">
                ${priority}
            </span>


            <div class="task-actions">

                <button
                    class="complete-btn"
                    onclick="toggleTask(${index})">

                    ${task.completed ? "Undo" : "Complete"}

                </button>


                <button
                    class="delete-btn"
                    onclick="deleteTask(${index})">

                    Delete

                </button>

            </div>

        `;

        taskList.appendChild(li);
    });


    updateStats();

    updateEmptyMessage();
}


// ==========================================
// COMPLETE / UNCOMPLETE
// ==========================================

function toggleTask(index) {

    tasks[index].completed =
        !tasks[index].completed;

    saveTasks();

    displayTasks();
}


// ==========================================
// DELETE TASK
// ==========================================

function deleteTask(index) {

    tasks.splice(index, 1);

    saveTasks();

    displayTasks();
}


// ==========================================
// UPDATE STATISTICS
// ==========================================

function updateStats() {

    let total = tasks.length;

    let completed =
        tasks.filter(function(task) {
            return task.completed;
        }).length;

    let pending = total - completed;


    let high =
        tasks.filter(function(task) {

            return (task.priority || "Medium") === "High"
                && !task.completed;

        }).length;


    document.getElementById("totalTasks").textContent =
        total;

    document.getElementById("completedTasks").textContent =
        completed;

    document.getElementById("pendingTasks").textContent =
        pending;

    document.getElementById("highTasks").textContent =
        high;


    // Progress percentage

    let percentage = 0;

    if (total > 0) {

        percentage =
            Math.round((completed / total) * 100);

    }


    document.getElementById("progressText").textContent =
        percentage + "%";

    document.getElementById("progressFill").style.width =
        percentage + "%";
}


// ==========================================
// SEARCH
// ==========================================

function searchTasks() {

    displayTasks();
}


// ==========================================
// CLEAR COMPLETED
// ==========================================

function clearCompleted() {

    tasks = tasks.filter(function(task) {

        return !task.completed;

    });

    saveTasks();

    displayTasks();
}


// ==========================================
// EMPTY MESSAGE
// ==========================================

function updateEmptyMessage() {

    let message =
        document.getElementById("emptyMessage");

    let taskList =
        document.getElementById("taskList");


    if (taskList.children.length === 0) {

        message.style.display = "block";

    } else {

        message.style.display = "none";

    }
}


// ==========================================
// SAVE TO LOCAL STORAGE
// ==========================================

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}


// ==========================================
// DARK MODE
// ==========================================

function toggleTheme() {

    document.body.classList.toggle("dark");

    let button =
        document.getElementById("themeBtn");


    if (document.body.classList.contains("dark")) {

        button.textContent = "☀️";

    } else {

        button.textContent = "🌙";

    }
}


// ==========================================
// BUTTON EVENTS
// ==========================================

document
    .getElementById("addBtn")
    .addEventListener("click", addTask);


document
    .getElementById("searchInput")
    .addEventListener("input", searchTasks);


document
    .getElementById("filterInput")
    .addEventListener("change", displayTasks);


document
    .getElementById("clearBtn")
    .addEventListener("click", clearCompleted);


document
    .getElementById("themeBtn")
    .addEventListener("click", toggleTheme);


// ==========================================
// LOAD TASKS
// ==========================================

displayTasks();
