// Trips page logic
const API = '';
const token = localStorage.getItem('token');
const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
if (!token) window.location.href = '/login.html';

let allTrips = [];

const CURRENCY_SYMBOLS = { USD: '$', INR: '₹', EUR: '€', GBP: '£', JPY: '¥', AUD: 'A$', CAD: 'C$', SGD: 'S$', AED: 'د.إ' };
function getCurrencySymbol(code) { return CURRENCY_SYMBOLS[code] || code || '$'; }

function showToast(msg, type = 'info') {
  const c = document.getElementById('toastContainer');
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

async function loadMyTrips() {
  try {
    const res = await fetch(`${API}/api/trips/my`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    allTrips = data.trips || [];
    renderTrips(allTrips);
  } catch (err) { console.error(err); }
}

function renderTrips(trips) {
  const container = document.getElementById('tripsList');
  if (!trips.length) {
    container.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><div class="icon"><i class="fa-solid fa-plane"></i></div><h3>No trips found</h3><p>Create your first adventure!</p></div>';
    return;
  }

  container.innerHTML = trips.map(t => {
    const statusClass = t.status === 'active' ? 'badge-active' :
      t.status === 'completed' ? 'badge-completed' :
      t.status === 'cancelled' ? 'badge-cancelled' : 'badge-upcoming';
    const cs = getCurrencySymbol(t.currency);
    const fromTo = t.from_location ? `${t.from_location} → ${t.destination}` : t.destination;
    const heroStyle = t.cover_image
      ? `background-image:url('${t.cover_image}');background-size:cover;background-position:center;`
      : '';
    return `
    <a href="/trip-details.html?id=${t.id}" class="trip-card" style="text-decoration:none;color:inherit">
      <div class="trip-card-image" style="${heroStyle}">
        ${!t.cover_image ? '<i class="fa-solid fa-earth-americas"></i>' : ''}
        <span class="trip-card-badge ${t.trip_type === 'duo' ? 'badge-duo' : 'badge-group'}">${t.trip_type}</span>
      </div>
      <div class="trip-card-body">
        <h3>${fromTo}</h3>
        <div class="trip-card-meta">
          <span><i class="fa-solid fa-calendar"></i> ${new Date(t.start_date).toLocaleDateString()}</span>
          <span><i class="fa-solid fa-users"></i> ${t.member_count || 1}/${t.max_participants}</span>
          <span class="trip-card-badge ${statusClass}" style="font-size:0.65rem">${t.status}</span>
        </div>
      </div>
      <div class="trip-card-footer">
        <div class="trip-host"><span style="font-size:0.8rem"><i class="fa-solid fa-house"></i> ${t.host_name}</span></div>
        <span style="font-size:0.8rem;color:var(--text-muted)">${t.budget ? cs + t.budget : ''} ${t.travel_style || ''}</span>
      </div>
    </a>`;  
  }).join('');
}

function filterTrips(status, el) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');

  document.getElementById('tripsList').style.display = status === 'requests' ? 'none' : 'grid';
  document.getElementById('requestsSection').style.display = status === 'requests' ? 'block' : 'none';

  if (status === 'requests') {
    loadRequests();
    return;
  }

  const filtered = status === 'all' ? allTrips.filter(t => t.status !== 'cancelled') : allTrips.filter(t => t.status === status);
  renderTrips(filtered);
}

async function loadRequests() {
  try {
    const res = await fetch(`${API}/api/trips/requests`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();

    if (!data.requests || !data.requests.length) {
      document.getElementById('requestsList').innerHTML = '<div class="empty-state"><div class="icon"><i class="fa-solid fa-inbox"></i></div><h3>No requests</h3><p>Trip requests and invitations will appear here</p></div>';
      return;
    }

    document.getElementById('requestsList').innerHTML = data.requests.map(r => `
      <div class="card" style="padding:1.25rem; margin-bottom:0.75rem; display:flex; align-items:center; gap:1rem;">
        <div style="flex:1">
          <strong>${r.destination}</strong>
          <p style="font-size:0.8rem; color:var(--text-muted);">
            ${r.type === 'invitation' ? 'Invited by' : 'Request to join'} ${r.host_name} ·
            <i class="fa-solid fa-calendar"></i> ${new Date(r.start_date).toLocaleDateString()} → ${new Date(r.end_date).toLocaleDateString()}
          </p>
        </div>
        <span class="trip-card-badge ${r.status === 'accepted' ? 'badge-active' : r.status === 'rejected' ? '' : 'badge-upcoming'}">${r.status}</span>
        ${r.status === 'pending' && r.type === 'invitation' ? `
          <button class="btn btn-success btn-sm" onclick="handleReq(${r.id}, 'accept')"><i class="fa-solid fa-check"></i> Accept</button>
          <button class="btn btn-danger btn-sm" onclick="handleReq(${r.id}, 'reject')"><i class="fa-solid fa-xmark"></i> Decline</button>
        ` : ''}
      </div>
    `).join('');
  } catch (err) { console.error(err); }
}

async function handleReq(requestId, action) {
  try {
    const res = await fetch(`${API}/api/trips/requests/${requestId}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ action })
    });
    const data = await res.json();
    showToast(data.message || data.error, res.ok ? 'success' : 'error');
    loadRequests();
    loadMyTrips();
  } catch (err) { showToast('Failed', 'error'); }
}

// Create Trip Modal
function openCreateModal() { 
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('tripStart').min = today;
  document.getElementById('tripEnd').min = today;
  document.getElementById('createModal').classList.add('open'); 
}
function onStartDateChange() {
  const start = document.getElementById('tripStart').value;
  if (start) document.getElementById('tripEnd').min = start;
}
function closeCreateModal() { document.getElementById('createModal').classList.remove('open'); }
function updateMaxP() {
  const type = document.getElementById('tripType').value;
  document.getElementById('tripMaxP').value = type === 'duo' ? 2 : 6;
  document.getElementById('tripMaxP').readOnly = type === 'duo';
}

// Cover photo preview
document.getElementById('tripCoverPhoto')?.addEventListener('change', function() {
  const file = this.files[0];
  const preview = document.getElementById('coverPreview');
  const img = document.getElementById('coverPreviewImg');
  if (file) {
    const reader = new FileReader();
    reader.onload = e => { img.src = e.target.result; preview.style.display = 'block'; };
    reader.readAsDataURL(file);
  } else {
    preview.style.display = 'none';
  }
});

async function createTrip() {
  const destination = document.getElementById('tripDest').value;
  const from_location = document.getElementById('tripFrom').value;
  const start_date = document.getElementById('tripStart').value;
  const end_date = document.getElementById('tripEnd').value;
  const trip_type = document.getElementById('tripType').value;
  const max_participants = parseInt(document.getElementById('tripMaxP').value);
  const budget = parseFloat(document.getElementById('tripBudget').value) || 0;
  const currency = document.getElementById('tripCurrency').value;
  const travel_style = document.getElementById('tripStyle').value;
  const description = document.getElementById('tripDesc').value;
  const coverFile = document.getElementById('tripCoverPhoto').files[0];

  if (!destination || !from_location || !start_date || !end_date || !budget) {
    showToast('Please fill all required fields (From, To, Dates, Budget)', 'error');
    return;
  }
  if (end_date < start_date) {
    showToast('End date cannot be before start date', 'error');
    return;
  }

  try {
    const formData = new FormData();
    formData.append('destination', destination);
    formData.append('from_location', from_location);
    formData.append('start_date', start_date);
    formData.append('end_date', end_date);
    formData.append('trip_type', trip_type);
    formData.append('max_participants', max_participants);
    formData.append('budget', budget);
    formData.append('currency', currency);
    formData.append('travel_style', travel_style);
    formData.append('description', description);
    if (coverFile) formData.append('cover_image', coverFile);

    const res = await fetch(`${API}/api/trips`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    const data = await res.json();
    if (res.ok) {
      showToast('Trip created! 🎉', 'success');
      closeCreateModal();
      // Reset form
      document.getElementById('coverPreview').style.display = 'none';
      document.getElementById('tripCoverPhoto').value = '';
      loadMyTrips();
    } else {
      showToast(data.error, 'error');
    }
  } catch (err) { showToast('Creation failed', 'error'); }
}

loadMyTrips();
