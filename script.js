const display = document.querySelector('#display');
const message = document.querySelector('#message');
let expression = '';
const operators = ['+', '-', '*', '/'];

function render() { display.value = expression || '0'; }
document.querySelector('.keys').addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  message.textContent = '';
  const action = button.dataset.action;
  const value = button.dataset.value;
  if (action === 'clear') { expression = ''; render(); return; }
  if (action === 'delete') { expression = expression.slice(0, -1); render(); return; }
  if (action === 'equals') {
    if (!expression || !/^[0-9+*/.() -]+$/.test(expression)) {
      message.textContent = 'Enter a valid calculation.'; return;
    }
    try {
      // Evaluate only the restricted arithmetic characters allowed by the check above.
      const result = Function('"use strict"; return (' + expression + ')')();
      if (!Number.isFinite(result)) throw new Error('Invalid result');
      expression = String(Number(result.toFixed(10)));
      render();
    } catch {
      message.textContent = 'Invalid calculation.';
    }
    return;
  }
  if (value !== undefined) {
    const last = expression.slice(-1);
    if (operators.includes(value) && (!expression && value !== '-')) return;
    if (operators.includes(value) && operators.includes(last)) expression = expression.slice(0, -1);
    if (value === '.' && expression.split(/[+*/-]/).pop().includes('.')) return;
    expression += value;
    render();
  }
});
document.addEventListener('keydown', (event) => {
  if (/^[0-9.+*/-]$/.test(event.key)) {
    if (operators.includes(event.key) && operators.includes(expression.slice(-1))) expression = expression.slice(0, -1);
    expression += event.key; render();
  } else if (event.key === 'Enter' || event.key === '=') {
    document.querySelector('[data-action="equals"]').click();
  } else if (event.key === 'Backspace') {
    expression = expression.slice(0, -1); render();
  } else if (event.key === 'Escape') {
    expression = ''; message.textContent = ''; render();
  }
});
