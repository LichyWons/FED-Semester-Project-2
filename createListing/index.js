import {
  toggleNavByAuth,
  initLogout,
  initMobileNav,
  updateUserInStorage,
} from '../js/authNav.js';
import { createListing } from '../js/api.js';

// DOM
const form = document.getElementById('create-listing-form');
const errorEl = document.getElementById('form-error');
const successEl = document.getElementById('form-success');

const titleInput = document.getElementById('title');
const descInput = document.getElementById('description');
const imageInput = document.getElementById('image');
const endsAtInput = document.getElementById('endsAt');

// Guards
function requireAuth() {
  const token = localStorage.getItem('token');
  const apiKey = localStorage.getItem('apiKey');
  if (!token || !apiKey) {
    window.location.assign('../login/');
    return false;
  }
  return true;
}

function isFutureDate(value) {
  const d = new Date(value);
  return !isNaN(d.getTime()) && d.getTime() > Date.now();
}

function clearMessages() {
  if (errorEl) errorEl.textContent = '';
  if (successEl) successEl.textContent = '';
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  toggleNavByAuth();
  initLogout();
  initMobileNav();
  if (!requireAuth()) return;
});

// Submit
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearMessages();

    const title = titleInput.value.trim();
    const description = descInput.value.trim();
    const imageUrl = imageInput.value.trim();
    const endsAtRaw = endsAtInput.value;

    // Validation
    if (!title) {
      errorEl.textContent = 'Title is required.';
      return;
    }
    if (!endsAtRaw || !isFutureDate(endsAtRaw)) {
      errorEl.textContent = 'End date must be in the future.';
      return;
    }

    const payload = {
      title,
      description: description || undefined,
      endsAt: new Date(endsAtRaw).toISOString(),
      media: imageUrl ? [{ url: imageUrl, alt: title }] : [],
    };

    try {
      successEl.textContent = 'Creating listing...';

      const result = await createListing(payload);

      // Optional sync (credits/avatars unchanged here, but keeps pattern consistent)
      const userRaw = localStorage.getItem('user');
      if (userRaw) updateUserInStorage(JSON.parse(userRaw));

      // Redirect to newly created listing
      window.location.assign(
        `../singleListing/index.html?id=${encodeURIComponent(result.data.id)}`,
      );
    } catch (err) {
      successEl.textContent = '';
      errorEl.textContent = err.message || 'Failed to create listing.';
    }
  });
}
