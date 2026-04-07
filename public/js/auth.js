// Auth utilities
const API_BASE = '';

function getToken() { return localStorage.getItem('token'); }
function getUser() { return JSON.parse(localStorage.getItem('user') || '{}'); }

function requireAuth() {
  if (!getToken()) { window.location.href = '/login.html'; return false; }
  return true;
}

async function handleLogin() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const btn = document.getElementById('loginBtn');
  const errorMsg = document.getElementById('errorMsg');

  // Client-side validation
  if (!email) { showAuthError('Please enter your email address.'); return; }
  if (!password) { showAuthError('Please enter your password.'); return; }

  btn.disabled = true;
  btn.textContent = 'Logging in...';
  if (errorMsg) errorMsg.style.display = 'none';

  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      showAuthError(data.error || 'Login failed.');
      btn.disabled = false;
      btn.textContent = 'Login';
      return;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    window.location.href = '/dashboard.html';
  } catch (err) {
    showAuthError('Connection error. Please check if the server is running.');
    btn.disabled = false;
    btn.textContent = 'Login';
  }
}

async function handleRegister() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const locationEl = document.getElementById('location');
  const interestsEl = document.getElementById('interests');
  const location = locationEl ? locationEl.value.trim() : '';
  const interests = interestsEl ? interestsEl.value.split(',').map(s => s.trim()).filter(Boolean) : [];

  const btn = document.getElementById('registerBtn');
  const errorMsg = document.getElementById('errorMsg');

  // Client-side validation
  if (!name) { showAuthError('Please enter your full name.'); return; }
  if (!email) { showAuthError('Please enter your email address.'); return; }
  if (!password || password.length < 6) { showAuthError('Password must be at least 6 characters.'); return; }

  btn.disabled = true;
  btn.textContent = 'Creating account...';
  if (errorMsg) errorMsg.style.display = 'none';

  try {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, location, travelInterests: interests })
    });

    const data = await res.json();

    if (!res.ok) {
      showAuthError(data.error || 'Registration failed.');
      btn.disabled = false;
      btn.textContent = 'Register';
      return;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    window.location.href = '/dashboard.html';
  } catch (err) {
    showAuthError('Connection error. Please check if the server is running.');
    btn.disabled = false;
    btn.textContent = 'Register';
  }
}

function showAuthError(msg) {
  const el = document.getElementById('errorMsg');
  if (el) {
    el.textContent = msg;
    el.style.display = 'block';
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login.html';
}

// Update nav avatar on authenticated pages
(function updateNavAvatar() {
  const user = getUser();
  const avatars = document.querySelectorAll('.nav-avatar, #navAvatar');
  avatars.forEach(a => {
    if (user.profile_picture) a.src = user.profile_picture;
    else if (user.name) a.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=fa9e1b&color=fff`;
  });
})();
