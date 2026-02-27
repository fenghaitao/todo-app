const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const themeToggle = document.getElementById('theme-toggle');
const taskCount = document.getElementById('task-count');
const listFooter = document.getElementById('list-footer');
const clearCompleted = document.getElementById('clear-completed');
const filterBtns = document.querySelectorAll('.filter-btn');

let currentFilter = 'all';

// ── Theme ──────────────────────────────────────────────────
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

// ── Filter ─────────────────────────────────────────────────
filterBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
        filterBtns.forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        applyFilter();
    });
});

function applyFilter() {
    const items = todoList.querySelectorAll('li:not(.empty-state)');
    items.forEach(function(li) {
        const isCompleted = li.classList.contains('completed');
        let visible = true;
        if (currentFilter === 'active')    visible = !isCompleted;
        if (currentFilter === 'completed') visible = isCompleted;
        li.dataset.hidden = visible ? '' : '1';
        li.style.display = visible ? '' : 'none';
    });
    updateEmptyState();
}

// ── Counter & Footer ───────────────────────────────────────
function updateCounter() {
    const all = todoList.querySelectorAll('li:not(.empty-state)').length;
    const done = todoList.querySelectorAll('li:not(.empty-state).completed').length;
    const active = all - done;
    taskCount.textContent = active === 1 ? '1 task remaining' : active + ' tasks remaining';
    listFooter.hidden = done === 0;
}

function updateEmptyState() {
    const existing = todoList.querySelector('.empty-state');
    const visibleItems = Array.from(todoList.querySelectorAll('li:not(.empty-state)')).filter(function(li) {
        return li.dataset.hidden !== '1';
    });
    if (visibleItems.length === 0 && !existing) {
        const emptyStateItem = document.createElement('li');
        emptyStateItem.className = 'empty-state';
        emptyStateItem.innerHTML = '<span class="empty-icon">✅</span>Nothing here!';
        todoList.appendChild(emptyStateItem);
    } else if (visibleItems.length > 0 && existing) {
        existing.remove();
    }
}

// ── Add Todo ───────────────────────────────────────────────
addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') addTodo();
});

function addTodo() {
    const value = todoInput.value.trim();
    if (value === '') return;

    const li = document.createElement('li');

    const check = document.createElement('span');
    check.className = 'todo-check';
    check.setAttribute('aria-hidden', 'true');

    const span = document.createElement('span');
    span.className = 'todo-text';
    span.textContent = value;

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '✕';
    deleteBtn.className = 'delete-btn';
    deleteBtn.setAttribute('aria-label', 'Delete task');
    deleteBtn.onclick = function(e) {
        e.stopPropagation();
        li.classList.add('removing');
        setTimeout(function() {
            todoList.removeChild(li);
            updateCounter();
            applyFilter();
        }, 200);
    };

    li.appendChild(check);
    li.appendChild(span);
    li.appendChild(deleteBtn);

    li.addEventListener('click', function(e) {
        if (e.target === deleteBtn) return;
        li.classList.toggle('completed');
        check.textContent = li.classList.contains('completed') ? '✓' : '';
        updateCounter();
        applyFilter();
    });

    // Respect active filter on add
    if (currentFilter === 'completed') li.style.display = 'none';

    todoList.appendChild(li);
    todoInput.value = '';
    todoInput.focus();
    updateCounter();
    updateEmptyState();
}

// ── Clear Completed ────────────────────────────────────────
clearCompleted.addEventListener('click', function() {
    todoList.querySelectorAll('li.completed').forEach(function(li) {
        todoList.removeChild(li);
    });
    updateCounter();
    applyFilter();
});

// ── Init ───────────────────────────────────────────────────
updateCounter();
updateEmptyState();

