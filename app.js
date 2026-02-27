const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const themeToggle = document.getElementById('theme-toggle');

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
    li.textContent = value;

    // Mark as completed on click
    li.addEventListener('click', function(e) {
        // Prevent toggling when clicking delete button
        if (e.target.className === 'delete-btn') return;
        li.classList.toggle('completed');
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';
    deleteBtn.onclick = function() {
        todoList.removeChild(li);
    };

    li.appendChild(deleteBtn);
    todoList.appendChild(li);
    todoInput.value = '';
    todoInput.focus();
}
