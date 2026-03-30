/**
 * API Client
 * Centralized fetch wrapper for all backend endpoints.
 * Uses relative paths so the Vite proxy handles the backend origin.
 */

async function request(path, options = {}) {
  const res = await fetch(path, options);
  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const body = await res.json();
      if (body.message) message = body.message;
    } catch (_) {
      // ignore parse errors
    }
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }
  // 204 No Content has no body
  if (res.status === 204) return null;
  return res.json();
}

function authHeaders(token) {
  return { Authorization: `Bearer ${token}` };
}

// Auth

export function authLogin({ email, password }) {
  return request('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
}

export function authRegister({ firstName, lastName, email, password, country }) {
  return request('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firstName, lastName, email, password, country }),
  });
}

// Bookings

export function getBookings(token) {
  return request('/api/bookings', {
    headers: authHeaders(token),
  });
}

export function createBooking(token, data) {
  return request('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(data),
  });
}

export function deleteBooking(token, id) {
  return request(`/api/bookings/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
}

// Users

export function getMe(token) {
  return request('/api/users/me', {
    headers: authHeaders(token),
  });
}

export function updateMe(token, data) {
  return request('/api/users/me', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(data),
  });
}

// Weather

export function getWeather(token, city) {
  return request(`/api/weather?city=${encodeURIComponent(city)}`, {
    headers: authHeaders(token),
  });
}
