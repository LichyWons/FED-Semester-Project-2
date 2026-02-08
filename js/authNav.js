const navToggle = document.querySelector('#nav-toggle');

export function toggleNavByAuth() {
  const token = localStorage.getItem('token');
  const userRaw = localStorage.getItem('user');

  const navGuest = document.querySelector('#nav-guest');
  const navUser = document.querySelector('#nav-user');
  const navToggle = document.querySelector('#nav-toggle');

  const isLoggedIn = Boolean(token && userRaw);

  if (isLoggedIn) {
    navGuest?.classList.add('hidden');

    // user nav: ukryty na mobile, widoczny od md
    navUser?.classList.add('hidden');
    navUser?.classList.remove('md:hidden');
    navUser?.classList.add('md:flex');

    // hamburger: widoczny tylko dla usera (na mobile)
    navToggle?.classList.remove('hidden');

    try {
      const user = JSON.parse(userRaw);

      const avatarEl = document.querySelector('#nav-avatar');
      const creditsEl = document.querySelector('#nav-credits');
      const avatarMobileEl = document.querySelector('#nav-avatar-mobile');
      const creditsMobileEl = document.querySelector('#nav-credits-mobile');

      if (avatarEl && user.avatar) {
        avatarEl.src = user.avatar.url || user.avatar;
        avatarEl.alt = user.name || 'User avatar';
        avatarEl.className =
          'w-10 h-10 rounded-full object-cover border border-[var(--brand)]';
      }
      if (avatarMobileEl && user.avatar) {
        avatarMobileEl.src = user.avatar.url || user.avatar;
        avatarMobileEl.alt = user.name || 'User avatar';
      }

      const credits = Number(user.credits);

      if (creditsEl) {
        creditsEl.textContent = Number.isFinite(credits)
          ? `${credits} credits`
          : '';
      }

      if (creditsMobileEl) {
        creditsMobileEl.textContent = Number.isFinite(credits)
          ? `${credits} credits`
          : '';
      }
    } catch {
      console.warn('Invalid user data in localStorage');
    }
  } else {
    navGuest?.classList.remove('hidden');

    // ważne: usuń md:flex, dodaj md:hidden
    navUser?.classList.add('hidden');
    navUser?.classList.remove('md:flex');
    navUser?.classList.add('md:hidden');

    // gość: hamburger ukryty
    navToggle?.classList.add('hidden');
  }
}

export function renderNavUser(profile) {
  const creditsEl = document.querySelector('#nav-credits');
  const avatarEl = document.querySelector('#nav-avatar');

  if (creditsEl) {
    creditsEl.textContent = `${profile.credits} credits`;
  }

  if (avatarEl) {
    avatarEl.src = profile.avatar?.url || profile.avatar || '';
    avatarEl.alt = profile.name || 'User avatar';
    avatarEl.className =
      'w-10 h-10 rounded-full object-cover border border-[var(--brand)]';
  }
}

export function initLogout() {
  const logoutBtns = document.querySelectorAll(
    '#logout-btn, #logout-btn-mobile',
  );

  if (!logoutBtns.length) return;

  logoutBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      localStorage.removeItem('user');
      localStorage.removeItem('token');

      toggleNavByAuth();
      window.location.href = './index.html';
    });
  });
}

export function updateUserInStorage(profile) {
  if (!profile || !profile.name) return;

  const raw = localStorage.getItem('user');
  const current = raw ? JSON.parse(raw) : {};

  const updatedUser = {
    ...current,
    name: profile.name,
    email: profile.email ?? current.email,
    avatar: profile.avatar ?? current.avatar,
    banner: profile.banner ?? current.banner,
    credits: profile.credits ?? current.credits,
  };

  localStorage.setItem('user', JSON.stringify(updatedUser));
}
export function initMobileNav() {
  console.trace('Initializing mobile nav fired');
  const navToggle = document.getElementById('nav-toggle');
  const navMobile = document.getElementById('nav-mobile');
  if (!navToggle || !navMobile) return;

  // tylko zalogowany ma mieć to menu
  const isLoggedIn = Boolean(
    localStorage.getItem('token') && localStorage.getItem('user'),
  );
  if (!isLoggedIn) return;

  const open = () => {
    navMobile.classList.remove('max-h-0', 'opacity-0', '-translate-y-2');
    navMobile.classList.add('max-h-96', 'opacity-100', 'translate-y-0');
    navToggle.setAttribute('aria-expanded', 'true');
    navMobile.setAttribute('aria-hidden', 'false');
  };

  const close = () => {
    navMobile.classList.add('max-h-0', 'opacity-0', '-translate-y-2');
    navMobile.classList.remove('max-h-96', 'opacity-100', 'translate-y-0');
    navToggle.setAttribute('aria-expanded', 'false');
    navMobile.setAttribute('aria-hidden', 'true');
  };

  const isOpen = () => navToggle.getAttribute('aria-expanded') === 'true';

  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    isOpen() ? close() : open();
  });

  // klik poza menu
  document.addEventListener('click', (e) => {
    if (!isOpen()) return;
    const clickedInside =
      navMobile.contains(e.target) || navToggle.contains(e.target);
    if (!clickedInside) close();
  });

  // klik w link w menu
  navMobile.addEventListener('click', (e) => {
    const link = e.target.closest('a.mobile-link');
    if (link) close();
  });

  // ESC zamyka
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) close();
  });

  // jeśli zmienisz rozmiar na md+, zamknij mobile menu
  window.addEventListener('resize', () => {
    if (window.matchMedia('(min-width: 768px)').matches) close();
  });
}
