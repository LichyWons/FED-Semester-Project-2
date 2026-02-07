export function toggleNavByAuth() {
  const token = localStorage.getItem('token');
  const userRaw = localStorage.getItem('user');

  const navGuest = document.querySelector('#nav-guest');
  const navUser = document.querySelector('#nav-user');

  if (token && userRaw) {
    navGuest?.classList.add('hidden');
    navUser?.classList.remove('hidden');

    // 🔽 RENDER NAV USER (LOCAL)
    try {
      const user = JSON.parse(userRaw);

      const avatarEl = document.querySelector('#nav-avatar');
      const creditsEl = document.querySelector('#nav-credits');

      if (avatarEl && user.avatar) {
        avatarEl.src = user.avatar.url || user.avatar;
        avatarEl.alt = user.name || 'User avatar';
        avatarEl.className =
          'w-10 h-10 rounded-full object-cover border border-[var(--brand)]';
      }

      if (creditsEl && typeof user.credits === 'number') {
        creditsEl.textContent = `${user.credits} credits`;
      }
    } catch (err) {
      console.warn('Invalid user data in localStorage');
    }
  } else {
    navUser?.classList.add('hidden');
    navGuest?.classList.remove('hidden');
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
  const logoutBtn = document.querySelector('#logout-btn');
  if (!logoutBtn) return;

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token'); // opcjonalnie

    toggleNavByAuth();
    window.location.href = './index.html';
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
