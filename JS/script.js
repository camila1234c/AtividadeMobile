const taskForm = document.querySelector("#taskForm");
const taskName = document.querySelector("#taskName");
const subject = document.querySelector("#subject");
const dueDate = document.querySelector("#dueDate");

const taskList = document.querySelector("#taskList");
const emptyState = document.querySelector("#emptyState");
const formMessage = document.querySelector("#formMessage");

const totalEl = document.querySelector("#total");
const completedEl = document.querySelector("#completed");
const pendingEl = document.querySelector("#pending");

const progressBar = document.querySelector("#progressBar");
const progressPercent = document.querySelector("#progressPercent");

const filterButtons = document.querySelectorAll(".filter");

let tasks = [];
let currentFilter = "all";
let nextId = 1;

// Adicionar atividade
taskForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const title = taskName.value.trim();
    const selectedSubject = subject.value;

    if (!title || !selectedSubject) {
        formMessage.textContent =
            "Preencha a tarefa e escolha uma disciplina.";
        return;
    }

    tasks.push({
        id: nextId++,
        title: title,
        subject: selectedSubject,
        dueDate: dueDate.value,
        completed: false
    });

    taskName.value = "";
    subject.value = "";
    dueDate.value = "";

    formMessage.textContent = "Atividade adicionada com sucesso!";

    renderTasks();
    taskName.focus();
});

// Filtros da lista
filterButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        currentFilter = button.dataset.filter;

        filterButtons.forEach(function(item) {
            item.classList.toggle("active", item === button);
        });

        renderTasks();
    });
});

// Formatar data
function formatDate(dateString) {
    if (!dateString) return "";

    const [year, month, day] = dateString.split("-");
    return `Prazo: ${day}/${month}/${year}`;
}

// Desenhar as atividades
function renderTasks() {
    taskList.innerHTML = "";

    const visibleTasks = tasks.filter(function(task) {
        if (currentFilter === "pending") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });

    visibleTasks.forEach(function(task) {
        const item = document.createElement("li");
        item.className = "task-item";

        if (task.completed) {
            item.classList.add("done");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "task-check";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", "Concluir atividade");

        checkbox.addEventListener("change", function() {
            task.completed = checkbox.checked;
            renderTasks();
        });

        const content = document.createElement("div");
        content.className = "task-content";

        const title = document.createElement("div");
        title.className = "task-title";
        title.textContent = task.title;

        const discipline = document.createElement("div");
        discipline.className = "task-subject";
        discipline.textContent = task.subject;

        content.append(title, discipline);

        if (task.dueDate) {
            const date = document.createElement("div");
            date.className = "task-date";
            date.textContent = formatDate(task.dueDate);
            content.appendChild(date);
        }

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Excluir";

        deleteButton.addEventListener("click", function() {
            tasks = tasks.filter(function(item) {
                return item.id !== task.id;
            });

            renderTasks();
        });

        item.append(checkbox, content, deleteButton);
        taskList.appendChild(item);
    });

    // Atualizar contadores
    const completedCount = tasks.filter(function(task) {
        return task.completed;
    }).length;

    const pendingCount = tasks.length - completedCount;

    totalEl.textContent = tasks.length;
    completedEl.textContent = completedCount;
    pendingEl.textContent = pendingCount;

    // Calcular o progresso geral
    const percentage = tasks.length === 0
        ? 0
        : Math.round((completedCount / tasks.length) * 100);

    progressBar.style.width = percentage + "%";
    progressPercent.textContent = percentage + "%";

    emptyState.hidden = visibleTasks.length > 0;
}

// Iniciar
renderTasks();
