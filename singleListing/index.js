// singleListing/index.js
import { getListingById } from '../js/api.js';
import { toggleNavByAuth, initLogout } from '../js/authNav.js';

document.addEventListener('DOMContentLoaded', () => {
  toggleNavByAuth();
  initLogout();
});

// --- DOM ---
const titleEl = document.getElementById('listing-title');
const descEl = document.getElementById('listing-description');
const imgEl = document.getElementById('listing-image');

const endsEl = document.getElementById('listing-endsAt');
const bidsCountEl = document.getElementById('listing-bidsCount');
const currentBidEl = document.getElementById('listing-currentBid');

const bidLockedEl = document.getElementById('bid-locked');
const bidFormEl = document.getElementById('bid-form');
const bidAmountEl = document.getElementById('bid-amount');
const bidErrorEl = document.getElementById('bid-error');
const bidSuccessEl = document.getElementById('bid-success');

const bidsStatusEl = document.getElementById('bids-status');
const bidsListEl = document.getElementById('bids-list');

// --- helpers ---
const token = localStorage.getItem('token');
const isLoggedIn = Boolean(token);

function formatDate(iso) {
  return new Date(iso).toLocaleString();
}

function getBidsArray(listing) {
  return Array.isArray(listing?.bids) ? listing.bids : [];
}

function getCurrentBidFromBids(bids) {
  return bids.length ? Math.max(...bids.map((b) => b.amount)) : 0;
}

function applyAuthUI() {
  if (isLoggedIn) {
    bidLockedEl?.classList.add('hidden');
    bidFormEl?.classList.remove('hidden');
    bidsListEl?.classList.remove('hidden');
  } else {
    bidLockedEl?.classList.remove('hidden');
    bidFormEl?.classList.add('hidden');
    bidsListEl?.classList.add('hidden');
  }
}

function setBidMessages({ error = '', success = '' } = {}) {
  if (bidErrorEl) bidErrorEl.textContent = error;
  if (bidSuccessEl) bidSuccessEl.textContent = success;
}

function renderBidsStatus(bids) {
  if (!bidsStatusEl) return;
  if (!isLoggedIn) {
    bidsStatusEl.textContent = 'Log in to view bids';

    return;
  }
  bidsStatusEl.textContent =
    bids.length === 0 ? 'No bids yet' : `${bids.length} bids`;
}

function renderBidsList(bids) {
  if (!bidsListEl) return;

  bidsListEl.innerHTML = '';

  if (!isLoggedIn) return;

  if (bids.length === 0) {
    const li = document.createElement('li');
    li.className = 'text-sm text-neutral-400';
    li.textContent = 'No bids yet.';
    bidsListEl.appendChild(li);

    return;
  }

  bids
    .slice()
    .sort((a, b) => new Date(b.created) - new Date(a.created))
    .forEach((bid) => {
      const li = document.createElement('li');
      li.className = 'flex items-center justify-between text-sm';

      const name = document.createElement('span');
      name.className = 'text-neutral-400';
      name.textContent = bid.bidder?.name || 'Bidder';

      const amount = document.createElement('span');
      amount.className = 'font-medium text-neutral-400';
      amount.textContent = `${bid.amount} credits`;

      li.appendChild(name);
      li.appendChild(amount);
      bidsListEl.appendChild(li);
    });
}

function renderListing(listing) {
  const bids = getBidsArray(listing);
  const currentBid = getCurrentBidFromBids(bids);

  if (titleEl) titleEl.textContent = listing.title || 'Untitled';
  if (descEl) descEl.textContent = listing.description || 'No description.';

  const imgUrl = listing.media?.[0]?.url || '';
  const imgAlt = listing.media?.[0]?.alt || listing.title || 'Listing image';
  if (imgEl) {
    if (imgUrl) {
      imgEl.src = imgUrl;
      imgEl.alt = imgAlt;
    } else {
      imgEl.removeAttribute('src');
      imgEl.alt = 'No image';
    }
  }

  if (endsEl)
    endsEl.textContent = listing.endsAt ? formatDate(listing.endsAt) : '—';

  // bids number: use actual list length (as you requested)
  if (bidsCountEl) bidsCountEl.textContent = String(bids.length);

  if (currentBidEl) {
    currentBidEl.textContent = bids.length
      ? `${currentBid} credits`
      : 'No bids yet';
  }

  renderBidsStatus(bids);
  renderBidsList(bids);

  // store for bid validation
  return { bids, currentBid };
}

// --- API call for placing bid ---
// If your api.js already has a placeBid function, replace this with an import.
async function placeBid(listingId, amount) {
  if (!token) throw new Error('You must be logged in to bid.');

  const response = await fetch(
    `https://v2.api.noroff.dev/auction/listings/${encodeURIComponent(listingId)}/bids`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'X-Noroff-API-Key': localStorage.getItem('apiKey'),
      },
      body: JSON.stringify({ amount }),
    },
  );

  const json = await response.json();

  if (!response.ok) {
    const message =
      json?.errors?.[0]?.message || json?.message || 'Could not place bid';
    throw new Error(message);
  }

  return json;
}

// --- main ---
async function main() {
  applyAuthUI();

  const id = new URLSearchParams(window.location.search).get('id');
  if (!id) {
    if (titleEl) titleEl.textContent = 'Missing listing id';
    return;
  }

  try {
    const { data: listing } = await getListingById(id);
    let { currentBid } = renderListing(listing);

    // Place bid (only if logged in + form exists)
    if (isLoggedIn && bidFormEl) {
      bidFormEl.addEventListener('submit', async (e) => {
        e.preventDefault();
        setBidMessages();

        const amount = Number(bidAmountEl?.value);

        if (!Number.isFinite(amount) || amount <= 0) {
          setBidMessages({ error: 'Enter a valid bid amount.' });
          return;
        }

        // Optional: enforce higher than current bid
        if (amount <= currentBid) {
          setBidMessages({ error: `Bid must be higher than ${currentBid}.` });
          return;
        }

        // Optional: prevent bidding after end
        const endsAt = new Date(listing.endsAt).getTime();
        if (Date.now() > endsAt) {
          setBidMessages({ error: 'Auction has ended.' });
          return;
        }

        try {
          await placeBid(id, amount);
          setBidMessages({ success: 'Bid placed!' });
          if (bidAmountEl) bidAmountEl.value = '';

          // Re-fetch listing to refresh bids/current bid
          const refreshed = await getListingById(id);
          const state = renderListing(refreshed.data);
          currentBid = state.currentBid;
        } catch (err) {
          setBidMessages({ error: err.message });
        }
      });
    }
  } catch (err) {
    if (titleEl) titleEl.textContent = err.message;
    console.error(err);
  }
}

main();
