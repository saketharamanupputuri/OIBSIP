const form = document.querySelector('#auth-form');
const message = document.querySelector('#message');
const confirmWrap = document.querySelector('#confirm-wrap');
const confirmPassword = document.querySelector('#confirm-password');
const submitButton = document.querySelector('#submit-button');
const tabs = [...document.querySelectorAll('.tab')];
const authPanel = document.querySelector('#auth-panel');
const welcomePanel = document.querySelector('#welcome-panel');
const welcomeText = document.querySelector('#welcome-text');
let mode = 'login';
const STORAGE_KEY = 'oibsip-demo-users';
const SESSION_KEY = 'oibsip-demo-session';

function getUsers() {
  try {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return users && typeof users === 'object' && !Array.isArray(users) ? users : {};
  } catch { return {}; }
}
function setMode(nextMode) {
  mode = nextMode;
  message.textContent = '';
  tabs.forEach(tab => {
    const active = tab.dataset.mode === mode;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
  });
  confirmWrap.hidden = mode !== 'register';
  confirmPassword.required = mode === 'register';
  document.querySelector('#password').autocomplete = mode === 'register' ? 'new-password' : 'current-password';
  submitButton.textContent = mode === 'register' ? 'Create account' : 'Log in';
}
tabs.forEach(tab => tab.addEventListener('click', () => setMode(tab.dataset.mode)));

function showLoggedIn(email) {
  authPanel.hidden = true;
  welcomePanel.hidden = false;
  welcomeText.textContent = `Signed in as ${email}`;
}
function showForm() {
  authPanel.hidden = false;
  welcomePanel.hidden = true;
}
form.addEventListener('submit', (event) => {
  event.preventDefault();
  message.textContent = '';
  const email = document.querySelector('#email').value.trim().toLowerCase();
  const password = document.querySelector('#password').value;
  if (password.length < 8) { message.textContent = 'Password must be at least 8 characters.'; return; }
  let users = getUsers();
  try {
    if (mode === 'register') {
      if (password !== confirmPassword.value) { message.textContent = 'Passwords do not match.'; return; }
      if (Object.hasOwn(users, email)) { message.textContent = 'An account with this email already exists.'; return; }
      // DEMO ONLY: never store plain-text passwords in a real application.
      users[email] = password;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
      message.style.color = '#15803d';
      message.textContent = 'Account created. You can now log in.';
      setMode('login');
      form.reset();
      document.querySelector('#email').value = email;
    } else {
      if (!Object.hasOwn(users, email) || users[email] !== password) {
        message.textContent = 'Email or password is incorrect.'; return;
      }
      sessionStorage.setItem(SESSION_KEY, email);
      showLoggedIn(email);
    }
  } catch {
    message.style.color = '#b91c1c';
    message.textContent = 'Browser storage is unavailable. Try another browser or enable site storage.';
  }
});
document.querySelector('#logout').addEventListener('click', () => {
  sessionStorage.removeItem(SESSION_KEY);
  showForm(); form.reset(); message.textContent = ''; setMode('login');
});
try {
  const sessionEmail = sessionStorage.getItem(SESSION_KEY);
  if (sessionEmail && Object.hasOwn(getUsers(), sessionEmail)) showLoggedIn(sessionEmail);
} catch { /* Continue in logged-out mode if storage is unavailable. */ }
