const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

const editModal = document.getElementById("editModal");
const editTaskInput = document.getElementById("editTaskInput");
const saveEditBtn = document.getElementById("saveEditBtn");
const closeBtn = document.querySelector(".closeBtn");

const confettiCanvas = document.getElementById("confettiCanvas");
const ctx = confettiCanvas.getContext("2d");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let editIndex = null;

// Resize confetti canvas
confettiCanvas.width = window.innerWidth;
confettiCanvas.height = window.innerHeight;

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = `task ${task.completed ? "completed" : ""}`;
    li.innerHTML = `
      <span>${task.text}</span>
      <div>
        <button class="completeBtn">✔</button>
        <button class="editBtn">✏</button>
        <button class="deleteBtn">🗑</button>
      </div>
    `;

    li.querySelector(".completeBtn").onclick = () => {
      tasks[index].completed = !tasks[index].completed;
      saveTasks();
      renderTasks();
    };

    li.querySelector(".editBtn").onclick = () => {
      editIndex = index;
      editTaskInput.value = task.text;
      editModal.style.display = "block";
    };

    li.querySelector(".deleteBtn").onclick = () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    };

    taskList.appendChild(li);
  });

  updateProgress();
}

function updateProgress() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  progressBar.style.width = percent + "%";
  progressText.textContent = `${percent}% Completed`;

  if (percent === 100 && total > 0) {
    launchConfetti();
  }
}

// Add Task
addTaskBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  if (text) {
    tasks.push({ text, completed: false });
    taskInput.value = "";
    saveTasks();
    renderTasks();
  }
});

// Modal Save
saveEditBtn.addEventListener("click", () => {
  if (editTaskInput.value.trim()) {
    tasks[editIndex].text = editTaskInput.value.trim();
    saveTasks();
    renderTasks();
    editModal.style.display = "none";
  }
});

// Close Modal
closeBtn.onclick = () => editModal.style.display = "none";
window.onclick = e => {
  if (e.target === editModal) editModal.style.display = "none";
};

// Confetti Animation
function launchConfetti() {
  let particles = [];
  for (let i = 0; i < 150; i++) {
    particles.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * confettiCanvas.height - confettiCanvas.height,
      color: `hsl(${Math.random() * 360},100%,50%)`,
      size: Math.random() * 6 + 2,
      speed: Math.random() * 3 + 2
    });
  }

  function animate() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    particles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
      p.y += p.speed;
      if (p.y > confettiCanvas.height) p.y = -10;
    });
    requestAnimationFrame(animate);
  }
  animate();

  // Stop confetti after 5s
  setTimeout(() => ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height), 5000);
}

renderTasks();
