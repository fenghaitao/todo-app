const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const themeToggle = document.getElementById('theme-toggle');
const listHeader = document.getElementById('list-header');
const taskCount = document.getElementById('task-count');

// Theme toggle with localStorage persistence
function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('theme', theme);
}

const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);

themeToggle.addEventListener('click', function() {
    const current = document.body.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
});

function updateCount() {
    const total = todoList.querySelectorAll('li').length;
    const done = todoList.querySelectorAll('li.completed').length;
    if (total === 0) {
        listHeader.style.display = 'none';
    } else {
        listHeader.style.display = 'block';
        taskCount.textContent = `${done} of ${total} completed`;
    }
}

addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTodo();
    }
});

function addTodo() {
    const value = todoInput.value.trim();
    if (value === '') return;

    const li = document.createElement('li');

    const textSpan = document.createElement('span');
    textSpan.className = 'todo-text';
    textSpan.textContent = value;

    // Mark as completed on click
    li.addEventListener('click', function(e) {
        // Prevent toggling when clicking delete button
        if (e.target.classList.contains('delete-btn')) return;
        li.classList.toggle('completed');
        updateCount();
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';
    deleteBtn.onclick = function() {
        li.classList.add('removing');
        li.addEventListener('animationend', function() {
            todoList.removeChild(li);
            updateCount();
        }, { once: true });
    };

    li.appendChild(textSpan);
    li.appendChild(deleteBtn);
    todoList.appendChild(li);
    todoInput.value = '';
    todoInput.focus();
    updateCount();
}

