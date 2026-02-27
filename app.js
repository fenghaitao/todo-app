const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');

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
