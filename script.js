const form = document.querySelector('#task-form');
const input = document.querySelector('#task-input');
const list = document.querySelector('#task-list');
const count = document.querySelector('#task-count');
const empty = document.querySelector('#empty-state');
const clearCompleted = document.querySelector('#clear-completed');
const STORAGE_KEY = 'oibsip-todo-tasks';
let tasks = [];
try { tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); if (!Array.isArray(tasks)) tasks = []; }
catch { tasks = []; }

function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); }
  catch { /* App still works for this session if browser storage is unavailable. */ }
}
function render() {
  list.replaceChildren();
  tasks.forEach((task) => {
    const li = document.createElement('li');
    li.className = `task${task.completed ? ' completed' : ''}`;
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox'; checkbox.checked = task.completed;
    checkbox.setAttribute('aria-label', `Mark ${task.text} complete`);
    checkbox.addEventListener('change', () => {
      task.completed = checkbox.checked; save(); render();
    });
    const text = document.createElement('span');
    text.className = 'task-text'; text.textContent = task.text;
    const remove = document.createElement('button');
    remove.className = 'delete'; remove.type = 'button'; remove.textContent = 'Delete';
    remove.setAttribute('aria-label', `Delete ${task.text}`);
    remove.addEventListener('click', () => {
      tasks = tasks.filter(item => item.id !== task.id); save(); render();
    });
    li.append(checkbox, text, remove); list.append(li);
  });
  const remaining = tasks.filter(task => !task.completed).length;
  count.textContent = `${remaining} task${remaining === 1 ? '' : 's'} left`;
  empty.hidden = tasks.length > 0;
}
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  tasks.unshift({ id: `${Date.now()}-${Math.random()}`, text, completed: false });
  save(); render(); form.reset(); input.focus();
});
clearCompleted.addEventListener('click', () => {
  tasks = tasks.filter(task => !task.completed); save(); render();
});
render();
