console.log('Index.js loaded');

import { toggleNavByAuth, initLogout } from './authNav.js';
import { getListings } from './api.js';

// DOM
const listEl = document.getElementById('auction-list');
const searchInput = document.getElementById('search-input');

// State
let allListings = [];

// Init
document.addEventListener('DOMContentLoaded', () => {
  toggleNavByAuth();
  initLogout();
  main();
});

// Main loader
async function main() {
  try {
    const result = await getListings();

    // zapamiętujemy oryginalne listingi (24)
    allListings = result.data || [];

    renderListings(allListings);
    renderAuctionsCount(allListings.length);
  } catch (err) {
    console.error('Error fetching listings:', err);
    listEl.innerHTML = err.message;
    renderAuctionsCount(0);
  }
}

// Render list
function renderListings(listings) {
  listEl.innerHTML = '';

  if (!listings || listings.length === 0) {
    listEl.textContent = 'No listings found.';
    return;
  }

  const fragment = document.createDocumentFragment();

  for (const listing of listings) {
    fragment.appendChild(createListingCard(listing));
  }

  listEl.appendChild(fragment);
}

// Auctions count
function renderAuctionsCount(count) {
  const el = document.querySelector('#number-of-auctions');
  if (!el) return;

  el.textContent = `Showing ${count} auctions`;
}

// Search (client-side)
function filterListings(query) {
  const q = query.toLowerCase().trim();

  const filtered = allListings.filter((listing) => {
    const title = listing.title?.toLowerCase() || '';
    const desc = listing.description?.toLowerCase() || '';
    return title.includes(q) || desc.includes(q);
  });

  renderListings(filtered);
  renderAuctionsCount(filtered.length);
}

if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    filterListings(e.target.value);
  });
}

// Utils
function formatEndsAt(iso) {
  const d = new Date(iso);
  return d.toLocaleString();
}

// Card factory
function createListingCard(listing) {
  const { id, title, description, media, endsAt, _count } = listing;

  const imgUrl = media?.[0]?.url || '';
  const imgAlt = media?.[0]?.alt || title || 'Listing image';
  const bidsCount = _count?.bids ?? 0;

  const article = document.createElement('article');
  article.className =
    'rounded-xl overflow-hidden border border-neutral-200 bg-white flex flex-col';

  const imgWrap = document.createElement('div');
  imgWrap.className = 'aspect-[4/3] bg-neutral-100 overflow-hidden';

  if (imgUrl) {
    const img = document.createElement('img');
    img.src = imgUrl;
    img.alt = imgAlt;
    img.className = 'w-full h-full object-cover';
    img.loading = 'lazy';
    imgWrap.appendChild(img);
  } else {
    const noImg = document.createElement('div');
    noImg.className =
      'w-full h-full flex items-center justify-center text-sm text-neutral-500';
    noImg.textContent = 'No image';
    imgWrap.appendChild(noImg);
  }

  const body = document.createElement('div');
  body.className = 'p-4 flex flex-col gap-2 flex-1';

  const h3 = document.createElement('h3');
  h3.className = 'text-lg text-black font-semibold';
  h3.textContent = title;

  const p = document.createElement('p');
  p.className = 'text-sm text-neutral-700';
  p.textContent = description ? description.slice(0, 120) : 'No description.';

  const meta = document.createElement('div');
  meta.className = 'mt-auto text-sm text-neutral-700 flex flex-col gap-1';

  const ends = document.createElement('div');
  ends.textContent = `Ends: ${formatEndsAt(endsAt)}`;

  const bids = document.createElement('div');
  bids.textContent = `Bids: ${bidsCount}`;

  const a = document.createElement('a');
  a.className =
    'bg-[var(--brand)] hover:bg-[var(--brand-hover)] transition mt-3 inline-flex items-center justify-center rounded-xl px-4 py-2 border border-neutral-900';
  a.textContent = 'View details';
  a.href = `./singleListing/index.html?id=${encodeURIComponent(id)}`;

  meta.appendChild(ends);
  meta.appendChild(bids);

  body.appendChild(h3);
  body.appendChild(p);
  body.appendChild(meta);
  body.appendChild(a);

  article.appendChild(imgWrap);
  article.appendChild(body);

  return article;
}
