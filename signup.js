// signup.js – GreenEnergy (all fields mandatory, Enter key navigation)

// particles
const pCont = document.getElementById('particles');
if (pCont) {
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const sz = 2 + Math.random() * 4;
    p.style.cssText = `width:${sz}px;height:${sz}px;left:${Math.random()*100}%;animation-duration:${8+Math.random()*12}s;animation-delay:${Math.random()*10}s;`;
    pCont.appendChild(p);
  }
}

// toggle password visibility
const togglePw = document.getElementById('togglePw');
const pwInput = document.getElementById('signupPassword');
const pwIcon = document.getElementById('pwIcon');
if (togglePw) {
  togglePw.addEventListener('click', () => {
    const vis = pwInput.type === 'text';
    pwInput.type = vis ? 'password' : 'text';
    pwIcon.className = vis ? 'ph ph-eye' : 'ph ph-eye-slash';
  });
}

// toggle confirm password
const toggleConfirm = document.getElementById('toggleConfirmPw');
const confirmInput = document.getElementById('confirmPassword');
const confirmIcon = document.getElementById('confirmPwIcon');
if (toggleConfirm) {
  toggleConfirm.addEventListener('click', () => {
    const vis = confirmInput.type === 'text';
    confirmInput.type = vis ? 'password' : 'text';
    confirmIcon.className = vis ? 'ph ph-eye' : 'ph ph-eye-slash';
  });
}

// password strength meter
const pwBar = document.getElementById('pwBar');
const pwLabel = document.getElementById('pwLabel');
pwInput.addEventListener('input', () => {
  const v = pwInput.value;
  let score = 0;
  if (v.length >= 8) score++;
  if (/[A-Z]/.test(v)) score++;
  if (/[0-9]/.test(v)) score++;
  if (/[^A-Za-z0-9]/.test(v)) score++;
  const pct = (score / 4) * 100;
  const colors = ['#ef4444', '#f59e0b', '#22c55e', '#16a34a'];
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];
  pwBar.style.width = pct + '%';
  pwBar.style.background = colors[score - 1] || 'transparent';
  pwLabel.textContent = score > 0 ? labels[score - 1] : '';
});

// confirm password validation
const confirmError = document.getElementById('confirmError');
function validateConfirm() {
  if (confirmInput.value !== pwInput.value) {
    confirmError.textContent = 'Passwords do not match';
    return false;
  } else {
    confirmError.textContent = '';
    return true;
  }
}
confirmInput.addEventListener('input', validateConfirm);
pwInput.addEventListener('input', validateConfirm);

// form submission
const createBtn = document.getElementById('createBtn');
const formError = document.getElementById('formError');

function showError(msg) {
  formError.textContent = msg;
  formError.classList.add('show');
  createBtn.innerHTML = '<span>Create Account</span><i class="ph ph-arrow-right"></i>';
}

function performSignUp() {
  formError.classList.remove('show');

  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = pwInput.value;
  const role = document.getElementById('roleSelect').value;

  // all mandatory validations
  if (!firstName) return showError('First name is required');
  if (!email) return showError('Email address is required');
  if (!email.includes('@') || !email.includes('.')) return showError('Enter a valid email address');
  if (!password) return showError('Password is required');
  if (password.length < 6) return showError('Password must be at least 6 characters');
  if (password !== confirmInput.value) return showError('Passwords do not match');
  if (!role) return showError('Please select an account role');

  const username = [firstName, lastName].filter(Boolean).join(' ');
  localStorage.setItem('ge_temp_user', JSON.stringify({ email, username, role }));

  createBtn.innerHTML = '<i class="ph ph-circle-notch" style="animation:spin .7s linear infinite"></i>';
  if (!document.querySelector('#spinKeyframes')) {
    const style = document.createElement('style');
    style.id = 'spinKeyframes';
    style.textContent = '@keyframes spin{to{transform:rotate(360deg)}}';
    document.head.appendChild(style);
  }

  setTimeout(() => {
    window.location.href = 'login.html';
  }, 900);
}

createBtn.addEventListener('click', performSignUp);

// Enter key navigation (focus next, submit on last)
const allFields = Array.from(document.querySelectorAll('.input-wrap input, .input-wrap select'));
allFields.forEach((field, idx) => {
  field.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const next = allFields[idx + 1];
      if (next) next.focus();
      else performSignUp();
    }
  });
});
createBtn.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') performSignUp();
});
