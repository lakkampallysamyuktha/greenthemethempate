// login.js – GreenEnergy (all fields mandatory, Enter key navigation)

// particles
const pContainer = document.getElementById('particles');
if (pContainer) {
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = 2 + Math.random() * 5;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      animation-duration: ${8 + Math.random() * 12}s;
      animation-delay: ${Math.random() * 10}s;
      opacity: ${0.2 + Math.random() * 0.5};
    `;
    pContainer.appendChild(p);
  }
}

// toggle password visibility
const togglePw = document.getElementById('togglePw');
const pwInput = document.getElementById('password');
const pwIcon = document.getElementById('pwIcon');
if (togglePw) {
  togglePw.addEventListener('click', () => {
    const isText = pwInput.type === 'text';
    pwInput.type = isText ? 'password' : 'text';
    pwIcon.className = isText ? 'ph ph-eye' : 'ph ph-eye-slash';
  });
}

// auto-fill from signup temp data
const tempUser = JSON.parse(localStorage.getItem('ge_temp_user') || '{}');
const emailInput = document.getElementById('email');
const usernameInput = document.getElementById('username');
const roleSelect = document.getElementById('roleSelect');
if (tempUser.email && emailInput) {
  emailInput.value = tempUser.email;
  if (usernameInput) usernameInput.value = tempUser.username || tempUser.email.split('@')[0];
  if (roleSelect && tempUser.role) roleSelect.value = tempUser.role;
  localStorage.removeItem('ge_temp_user');
}

// sign in logic
const signinBtn = document.getElementById('signinBtn');
const formError = document.getElementById('formError');

function showError(msg) {
  formError.textContent = msg;
  formError.classList.add('show');
  signinBtn.innerHTML = '<span>Sign In</span><i class="ph ph-arrow-right"></i>';
}

function clearError() {
  formError.classList.remove('show');
  formError.textContent = '';
}

function performSignIn() {
  clearError();

  const username = usernameInput.value.trim();
  const email = emailInput.value.trim();
  const password = pwInput.value;
  const role = roleSelect.value;
  const remember = document.getElementById('remember').checked;

  // all fields mandatory
  if (!username) return showError('Username is required');
  if (!email) return showError('Email address is required');
  if (!email.includes('@') || !email.includes('.')) return showError('Enter a valid email address');
  if (!password) return showError('Password is required');

  localStorage.setItem('ge_user', JSON.stringify({
    email: email,
    username: username,
    role: role,
    remember: remember
  }));

  signinBtn.innerHTML = '<i class="ph ph-circle-notch" style="animation:spin .7s linear infinite"></i>';
  if (!document.querySelector('#spinKeyframes')) {
    const style = document.createElement('style');
    style.id = 'spinKeyframes';
    style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
    document.head.appendChild(style);
  }

  setTimeout(() => {
    window.location.href = role === 'admin' ? 'dashboardadmin.html' : 'dashboardviewer.html';
  }, 900);
}

signinBtn.addEventListener('click', performSignIn);

// Enter key navigation (focus next, submit on last)
const allFields = Array.from(document.querySelectorAll('.input-wrap input, .input-wrap select'));
allFields.forEach((field, idx) => {
  field.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const next = allFields[idx + 1];
      if (next) next.focus();
      else performSignIn();
    }
  });
});
signinBtn.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') performSignIn();
});
