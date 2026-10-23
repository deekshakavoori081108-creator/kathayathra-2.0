// Client API client for communicating with Katha Yatra Backend

const API_BASE = (
  import.meta.env.VITE_API_URL ||
  'https://kathayathra-2-0.onrender.com'
).replace(/\/+$/, '') + '/api';

export async function createUser(userData) {
  const res = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to create user');
  }
  return res.json();
}

export async function getUserDashboard(userId) {
  const res = await fetch(`${API_BASE}/users/${userId}/dashboard`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch dashboard');
  }
  return res.json();
}

export async function getTracks() {
  const res = await fetch(`${API_BASE}/tracks`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch tracks');
  }
  return res.json();
}

export async function getTrackLevels(trackId, userId = null) {
  const url = userId ? `${API_BASE}/tracks/${trackId}/levels?userId=${userId}` : `${API_BASE}/tracks/${trackId}/levels`;
  const res = await fetch(url);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch track levels');
  }
  return res.json();
}

export async function getLevelById(levelId) {
  const res = await fetch(`${API_BASE}/levels/${levelId}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to load level');
  }
  return res.json();
}

export async function completeLevel({ userId, trackId, levelId, starsEarned }) {
  const res = await fetch(`${API_BASE}/progress/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, trackId, levelId, starsEarned })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to save progress');
  }
  return res.json();
}

export async function getStoryById(storyId) {
  const res = await fetch(`${API_BASE}/stories/${storyId}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch story');
  }
  return res.json();
}

export async function generateAiContent(payload) {
  const res = await fetch(`${API_BASE}/ai/generate-content`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'AI generation failed');
  }
  return res.json();
}

export async function getParentAnalytics(userId) {
  const res = await fetch(`${API_BASE}/parent/analytics/${userId}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to load parent analytics');
  }
  return res.json();
}
