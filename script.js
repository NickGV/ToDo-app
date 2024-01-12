const closeBtn = document.getElementById("close-btn");
addTaskBtn = document.getElementById("add-task-btn");
showFormBtn = document.getElementById("show-form-btn");

formContainer = document.getElementById("form-container");
form = document.getElementById("form");

class Task {
  constructor(title, description, date) {
    this.title = form.title.value;
    this.description = form.description.value;
    this.date = form.date.value;
    this.done = false;
  }
}

let todos = [];
let task;
let editingTask = null;

const addTask = (event) => {
  event.preventDefault();

  if (editingTask) {
    editingTask.title = form.title.value;
    editingTask.description = form.description.value;
    editingTask.date = form.date.value;

    form.removeEventListener("submit", editTask);
    form.addEventListener("submit", addTask);

    editingTask = null;
  } else {
    task = new Task();
    todos.push(task);
  }

  saveData();
  update();
};

const update = () => {
  const display = document.getElementById("task-container");
  const tasks = document.querySelectorAll(".task");
  tasks.forEach((task) => display.removeChild(task));
  todos.map((task) => {
    createTask(task);
  });
};

const createTask = (task) => {
  const taskContainer = document.getElementById("task-container");

  let taskDiv = document.createElement("div");
  taskDiv.classList.add("task");

  let taskTextDiv = document.createElement("div");
  taskTextDiv.classList.add("task-text");

  let taskTitle = document.createElement("h1");
  taskTitle.classList.add("task-title");
  taskTitle.textContent = task.title;

  let taskDescription = document.createElement("p");
  taskDescription.classList.add("task-description");
  const limitedDescription = limitWords(task.description);

  taskDescription.innerHTML = `${limitedDescription} <span class="more-btn" >Ver más</span>`;

  taskTextDiv.appendChild(taskTitle);
  taskTextDiv.appendChild(taskDescription);

  let dateTime = document.createElement("p");
  dateTime.classList.add("date-time");
  dateTime.textContent = task.date;

  taskDiv.appendChild(taskTextDiv);
  taskDiv.appendChild(dateTime);

  let taskOptionsDiv = document.createElement("div");
  taskOptionsDiv.classList.add("task-options");

  let markBtnContainer = document.createElement("div");
  markBtnContainer.classList.add("task-mark-container");
  let markBtn = document.createElement("button");
  markBtn.className = task.done ? "task-mark-btn done" : "task-mark-btn";
  markBtn.innerHTML = ` <span class="material-symbols-outlined">
  done
  </span>`;
  markBtn.type = "button";
  markBtnContainer.appendChild(markBtn);
  taskOptionsDiv.appendChild(markBtnContainer);

  let editButtonContainer = document.createElement("div");
  editButtonContainer.classList.add("button-container");

  let editButton = document.createElement("button");
  editButton.classList.add("edit-btn");
  editButton.innerHTML =
    '<span class="material-symbols-outlined"> edit </span>';

  let editTooltip = document.createElement("div");
  editTooltip.classList.add("tooltip");
  editTooltip.textContent = "Editar";

  editButtonContainer.appendChild(editButton);
  editButtonContainer.appendChild(editTooltip);

  taskOptionsDiv.appendChild(editButtonContainer);

  delete button;
  let deleteButtonContainer = document.createElement("div");
  deleteButtonContainer.classList.add("button-container");

  let deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-btn");
  deleteButton.id = "delete-btn";
  deleteButton.innerHTML =
    '<span class="material-symbols-outlined"> delete </span>';

  let deleteTooltip = document.createElement("div");
  deleteTooltip.classList.add("tooltip");
  deleteTooltip.textContent = "Delete";

  deleteButton.addEventListener("click", () => {
    todos.splice(todos.indexOf(task), 1);
    saveData();
    update();
  });

  markBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    task.done = !task.done;
    console.log("done");
    markBtnContainer.classList.toggle("done");
    saveData();
  });

  editButton.addEventListener("click", () => {
    showEditModal(task);
  });

  taskDescription.addEventListener("click", () => {
    showEditModal(task);
  })

  deleteButtonContainer.appendChild(deleteButton);
  deleteButtonContainer.appendChild(deleteTooltip);

  taskOptionsDiv.appendChild(deleteButtonContainer);

  taskDiv.appendChild(taskOptionsDiv);

  taskContainer.appendChild(taskDiv);
};

const showEditModal = (task) => {
  formContainer.style.display = "block";

  form.title.value = task.title;
  form.description.value = task.description;
  form.date.value = task.date;

  editingTask = task;
  addTaskBtn.textContent = "Edit";

  form.removeEventListener("submit", addTask);
  form.addEventListener("submit", editTask);
};

const editTask = (event) => {
  event.preventDefault();
  if (editingTask) {
    editingTask.title = form.title.value;
    editingTask.description = form.description.value;
    editingTask.date = form.date.value;

    form.removeEventListener("submit", editTask);
    form.addEventListener("submit", addTask);

    editingTask = null;

    saveData();
    update();

    form.reset();
    formContainer.style.display = "none";

    addTaskBtn.textContent = "Add";
  }
};

const limitWords = (text) => {
  const limit = 10;
  const words = text.split(" ");
  if (words.length > limit) {
    return words.slice(0, limit).join(" ") + "...";
  }
  return text;
};

const saveData = () => {
  localStorage.setItem("library", JSON.stringify(todos));
};

const restoreData = () => {
  if (!localStorage.library) {
    update();
  } else {
    let data = localStorage.getItem("library");
    data = JSON.parse(data);
    todos = data;
    update();
  }
};

form.addEventListener("submit", (event) => {
  addTask(event);
  formContainer.style.display = "none";
  form.reset();
});

showFormBtn.addEventListener("click", () => {
  formContainer.style.display = "block";
});

closeBtn.addEventListener("click", () => {
  formContainer.style.display = "none";
  form.reset();
});

restoreData();
