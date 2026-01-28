console.log('Index.js loaded');
import { toggleNavByAuth, initLogout } from './authNav.js';

document.addEventListener('DOMContentLoaded', () => {
  toggleNavByAuth();
  initLogout();
});

import { getListings } from './api.js';

const listEl = document.getElementById('auction-list');

async function main() {
  try {
    const result = await getListings();
    console.log('APIresult§', result);

    const first = result.data[0];
    console.log('First listing:', first);
    console.log('has bids?', first.bids);
    console.log('media field?', first.media);
    console.log(Object.keys(first));
    console.log('media:', first.media);
    console.log('endsAt:', first.endsAt);

    const listings = result.data;

    listEl.innerHTML = '';

    for (const listing of listings) {
      listEl.appendChild(createListingCard(listing));
    }
  } catch (err) {
    console.error('Error fetching listings:', err);
    listEl.textContent = err.message;
  }
}

main();

function formatEndsAt(iso) {
  const d = new Date(iso);
  return d.toLocaleString();
}

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
    'bg-[var(--brand)] hover:bg-[var(--brand-hover)] transition mt-3 inline-flex items-center justify-center rounded-xl px-4 py-2 border border-neutral-900 ';
  a.textContent = 'View details';
  a.href = `./listing/index.html?id=${encodeURIComponent(id)}`;

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
