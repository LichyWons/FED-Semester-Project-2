import {
  toggleNavByAuth,
  initLogout,
  renderNavUser,
  updateUserInStorage,
} from '../js/authNav.js';

const API_BASE = 'https://v2.api.noroff.dev';

// ---- Auth / user (always read fresh from storage) ----
function getStoredUser() {
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
}

function getProfileName() {
  return getStoredUser()?.name || null;
}

function requireAuth() {
  const token = localStorage.getItem('token');
  const apiKey = localStorage.getItem('apiKey');
  const name = getProfileName();

  if (!token || !apiKey || !name) {
    window.location.href = '../login/';
    return false;
  }
  return true;
}

function authHeaders() {
  const token = localStorage.getItem('token');
  const apiKey = localStorage.getItem('apiKey');

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  // Auction endpoints require this
  if (apiKey) headers['X-Noroff-API-Key'] = apiKey;

  return headers;
}

// ---- DOM ----
const nameEl = document.querySelector('#profileName');
const creditsEl = document.querySelector('#profileCredits');
const emailEl = document.querySelector('#profileEmail');

const avatarWrapEl = document.querySelector('#profileAvatarWrap');
const avatarInputEl = document.querySelector('#avatarInput');
const avatarFormEl = document.querySelector('#avatar-form');

const avatarErrorEl = document.querySelector('#avatar-error');
const avatarSuccessEl = document.querySelector('#avatar-success');

const myListingsEl = document.querySelector('#myListings');
const myListingsStatusEl = document.querySelector('#myListingsStatus');

// ---- API ----
async function fetchProfile() {
  const profileName = getProfileName();
  const url = `${API_BASE}/auction/profiles/${encodeURIComponent(
    profileName,
  )}?_listings=true`;

  const res = await fetch(url, { headers: authHeaders() });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Profile fetch failed ${res.status}: ${txt}`);
  }

  const json = await res.json();
  return json.data;
}

async function updateAvatar(avatarUrl) {
  const profileName = getProfileName();
  const url = `${API_BASE}/auction/profiles/${encodeURIComponent(profileName)}`;

  const body = {
    avatar: { url: avatarUrl, alt: 'User avatar' },
  };

  const res = await fetch(url, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Avatar update failed ${res.status}: ${txt}`);
  }

  const json = await res.json();
  return json.data;
}

// ---- Render ----
function renderProfile(profile) {
  if (nameEl) nameEl.textContent = profile?.name ?? '—';
  if (creditsEl) creditsEl.textContent = profile?.credits ?? 0;
  if (emailEl) emailEl.textContent = profile?.email ?? '—';

  if (avatarWrapEl) {
    avatarWrapEl.innerHTML = '';
    const img = document.createElement('img');
    img.id = 'profileAvatar';
    img.alt = `${profile?.name ?? 'User'} avatar`;
    img.className = 'w-full h-full object-cover';
    img.src =
      profile?.avatar?.url || profile?.avatar || '../img/default-avatar.png';
    avatarWrapEl.appendChild(img);
  }

  if (avatarInputEl) {
    const current = profile?.avatar?.url || profile?.avatar || '';
    avatarInputEl.value = current;
  }
}

function listingCurrentBid(listing) {
  const bids = listing?.bids || [];
  if (!bids.length) return listing?.startingBid ?? 0;
  return Math.max(...bids.map((b) => b.amount));
}

function renderMyListings(listings) {
  if (!myListingsEl) return;

  myListingsEl.innerHTML = '';

  if (!Array.isArray(listings) || listings.length === 0) {
    if (myListingsStatusEl) myListingsStatusEl.textContent = 'No listings yet';
    myListingsEl.innerHTML = `
      <p class="text-sm text-neutral-400 col-span-full">
        You haven’t created any listings yet.
      </p>
    `;
    return;
  }

  if (myListingsStatusEl)
    myListingsStatusEl.textContent = `${listings.length} total`;

  const now = Date.now();

  listings.forEach((listing) => {
    const endsAt = listing?.endsAt ? new Date(listing.endsAt) : null;
    const ended = endsAt ? endsAt.getTime() <= now : false;
    const bid = listingCurrentBid(listing);

    const imgUrl =
      listing?.media?.[0]?.url ||
      listing?.media?.[0] ||
      '../img/placeholder.png';

    const card = document.createElement('a');
    card.href = `/singleListing/?id=${encodeURIComponent(listing.id)}`;
    card.className =
      'block rounded-2xl border border-neutral-200 overflow-hidden hover:border-[var(--brand)] transition-colors duration-300';

    card.innerHTML = `
      <div class="bg-neutral-100">
        <img src="${imgUrl}" alt="" class="w-full aspect-[4/3] object-cover" />
      </div>
      <div class="p-4 space-y-2">
        <h3 class="font-semibold text-neutral-200 truncate">${listing.title || 'Untitled'}</h3>
        <div class="flex items-center justify-between text-sm text-neutral-400">
          <span>${ended ? 'Ended' : 'Active'}</span>
          <span class="text-neutral-200 font-medium">${bid} credits</span>
        </div>
      </div>
    `;

    myListingsEl.appendChild(card);
  });
}

// ---- Utils ----
function clearAvatarMessages() {
  if (avatarErrorEl) avatarErrorEl.textContent = '';
  if (avatarSuccessEl) avatarSuccessEl.textContent = '';
}

function isValidUrl(value) {
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

// ---- Init ----
async function init() {
  // 1) nav fast render from storage + logout
  toggleNavByAuth();
  initLogout();

  // 2) block view if not authenticated (token + apiKey + name)
  if (!requireAuth()) return;

  // 3) load profile and render page + nav (fresh data)
  try {
    if (myListingsStatusEl) myListingsStatusEl.textContent = 'Loading...';

    const profile = await fetchProfile();

    renderProfile(profile);
    renderMyListings(profile.listings || []);

    // keep nav in sync
    updateUserInStorage(profile);
    toggleNavByAuth(); // re-render nav from updated storage
    renderNavUser(profile); // optional: if you want nav to reflect immediately even if toggleNav doesn't render credits
  } catch (err) {
    console.error(err);

    if (nameEl) nameEl.textContent = 'Failed to load profile';
    if (creditsEl) creditsEl.textContent = '—';
    if (emailEl) emailEl.textContent = '—';

    if (myListingsStatusEl) myListingsStatusEl.textContent = 'Failed to load';
    if (myListingsEl) myListingsEl.innerHTML = '';
  }
}

document.addEventListener('DOMContentLoaded', init);

// ---- Avatar form handler ----
if (avatarFormEl) {
  avatarFormEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAvatarMessages();

    const value = avatarInputEl?.value?.trim() || '';
    if (!isValidUrl(value)) {
      if (avatarErrorEl)
        avatarErrorEl.textContent = 'Please provide a valid http(s) URL.';
      return;
    }

    try {
      if (avatarSuccessEl) avatarSuccessEl.textContent = 'Updating...';

      await updateAvatar(value);

      // refresh profile (source of truth)
      const profile = await fetchProfile();

      renderProfile(profile);

      // sync nav
      updateUserInStorage(profile);
      toggleNavByAuth();
      renderNavUser(profile);

      if (avatarSuccessEl) avatarSuccessEl.textContent = 'Avatar updated.';
    } catch (err) {
      console.error(err);
      if (avatarSuccessEl) avatarSuccessEl.textContent = '';
      if (avatarErrorEl) avatarErrorEl.textContent = 'Avatar update failed.';
    }
  });
}
