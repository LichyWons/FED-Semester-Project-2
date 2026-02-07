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
  const response = await fetch(`${BASE_URL}/auction/listings?_active=true`);
  const json = await response.json();

  if (!response.ok) {
    const message =
      json?.errors?.[0]?.message || json?.message || 'Could not fetch listings';
    throw new Error(message);
  }

  const listings = (json.data || []).sort(
    (a, b) => new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime(),
  );

  return { ...json, data: listings };
}

export async function getListingById(id) {
  const response = await fetch(
    `${BASE_URL}/auction/listings/${encodeURIComponent(id)}?_bids=true&_seller=true`,
  );

  const json = await response.json();

  if (!response.ok) {
    const message =
      json?.errors?.[0]?.message || json?.message || 'Could not fetch listing';
    throw new Error(message);
  }

  return json;
}
export async function createApiKey(accessToken, name = 'Auction Website') {
  const response = await fetch(`${BASE_URL}/auth/create-api-key`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ name }),
  });

  const json = await response.json();
  if (!response.ok) {
    const message =
      json?.errors?.[0]?.message || json?.message || 'Could not create API key';
    throw new Error(message);
  }

  return json; // json.data.key
}

export async function createListing(data) {
  const token = localStorage.getItem('token');
  const apiKey = localStorage.getItem('apiKey');

  const response = await fetch('https://v2.api.noroff.dev/auction/listings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'X-Noroff-API-Key': apiKey,
    },
    body: JSON.stringify(data),
  });

  const json = await response.json();

  if (!response.ok) {
    const message =
      json?.errors?.[0]?.message || json?.message || 'Create listing failed';
    throw new Error(message);
  }

  return json;
}
