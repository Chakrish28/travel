// Chat Page Logic
const API = '';
const token = localStorage.getItem('token');
const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
if (!token) window.location.href = '/login.html';

let activeConversation = null;
const urlParams = new URLSearchParams(window.location.search);
const directUser = urlParams.get('user');
let pollErrors = 0;

async function loadConversations() {
  try {
    const res = await fetch(`${API}/api/chat/conversations`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();

    const container = document.getElementById('conversationList');
    if (!data.conversations || !data.conversations.length) {
      container.innerHTML = '<div style="padding:2rem;text-align:center;color:var(--text-muted)"><p>No conversations yet</p><p style="font-size:0.8rem">Find companions in Explore!</p></div>';
      return;
    }

    container.innerHTML = data.conversations.map(c => {
      const name = c.user?.name || 'Unknown';
      const pic = c.user?.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=fa9e1b&color=fff`;
      const uid = c._id;
      return `
      <div class="chat-item ${activeConversation == uid ? 'active' : ''}" onclick="openChat(${uid}, '${name.replace(/'/g, "\\'")}', '${pic}')">
        <img src="${pic}" alt="">
        <div class="chat-item-info">
          <h4>${name}</h4>
          <p>${c.lastMessage || 'Start chatting...'}</p>
        </div>
        ${c.unread ? `<div class="chat-unread">${c.unread}</div>` : ''}
      </div>`;
    }).join('');
    pollErrors = 0;
  } catch (err) {
    console.error('Load conversations error:', err);
    const container = document.getElementById('conversationList');
    container.innerHTML = '<div style="padding:2rem;text-align:center;color:var(--text-muted)"><p>Unable to load conversations</p><p style="font-size:0.8rem">Check your connection</p></div>';
  }
}

async function openChat(userId, name, picture) {
  activeConversation = userId;

  // Update header
  document.getElementById('chatHeader').innerHTML = `
    <img src="${picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=fa9e1b&color=fff`}" alt="" style="width:40px;height:40px;border-radius:50%;object-fit:cover">
    <div><h3 style="font-family:var(--font-heading);font-size:1rem;font-weight:700">${name}</h3></div>
  `;

  document.getElementById('chatInputArea').style.display = 'flex';

  // Highlight active
  document.querySelectorAll('.chat-item').forEach(i => i.classList.remove('active'));

  await loadMessages(userId);
}

async function loadMessages(userId) {
  try {
    const res = await fetch(`${API}/api/chat/private/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    const container = document.getElementById('chatMessages');

    if (!data.messages || !data.messages.length) {
      container.innerHTML = '<div class="empty-state" style="margin:auto"><div class="icon"><i class="fa-solid fa-paper-plane"></i></div><h3>No messages yet</h3><p>Say hello!</p></div>';
      return;
    }

    container.innerHTML = data.messages.map(m => `
      <div class="message ${m.sender === currentUser.id ? 'sent' : 'received'}">
        ${m.message}
        <div class="message-time">${new Date(m.createdAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</div>
      </div>
    `).join('');

    container.scrollTop = container.scrollHeight;
    pollErrors = 0;
  } catch (err) {
    pollErrors++;
    console.error('Load messages error:', err);
  }
}

async function sendMessage() {
  const input = document.getElementById('messageInput');
  const message = input.value.trim();
  if (!message || !activeConversation) return;

  try {
    await fetch(`${API}/api/chat/private`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ receiverId: activeConversation, message })
    });
    input.value = '';
    await loadMessages(activeConversation);
  } catch (err) { console.error('Send error:', err); }
}

// Poll messages with backoff on errors
setInterval(() => {
  if (activeConversation && pollErrors < 5) loadMessages(activeConversation);
}, 3000);

// Init
loadConversations();

// Direct chat link
if (directUser) {
  fetch(`${API}/api/users/profile/${directUser}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.json()).then(data => {
    if (data.user) openChat(parseInt(directUser), data.user.name, data.user.profile_picture);
  }).catch(err => console.error(err));
}
