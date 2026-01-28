const BASE_URL = 'https://v2.api.noroff.dev';

export async function registerUser({ name, email, password }) {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });

  const json = await response.json();

  if (!response.ok) {
    const message =
      json?.errors?.[0]?.message || json?.message || 'Registration failed';
    throw new Error(message);
  }

  return json;
}

export async function loginUser({ email, password }) {
  const response = await fetch(BASE_URL + '/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const json = await response.json();

  if (!response.ok) {
    const message =
      json?.errors?.[0]?.message || json?.message || 'Login failed';
    throw new Error(message);
  }

  return json;
}

export async function getListings() {
  const response = await fetch(`${BASE_URL}/auction/listings?_bids=true`);
  const json = await response.json();

  if (!response.ok) {
    const message =
      json?.errors?.[0]?.message || json?.message || 'Could not fetch listings';
    throw new Error(message);
  }

  return json;
}
