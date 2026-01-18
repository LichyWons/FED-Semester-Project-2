export function toggleNavByAuth() {
  const navGuest = document.querySelector('#nav-guest');
  const navUser = document.querySelector('#nav-user');
  if (!navGuest || !navUser) return;

  const userRaw = localStorage.getItem('user');
  const user = userRaw ? JSON.parse(userRaw) : null;

  const isLoggedIn = Boolean(user?.accessToken);

  if (isLoggedIn) {
    navGuest.classList.add('hidden');
    navGuest.classList.remove('flex');

    navUser.classList.remove('hidden');
    navUser.classList.add('flex');
  } else {
    navUser.classList.add('hidden');
    navUser.classList.remove('flex');

    navGuest.classList.remove('hidden');
    navGuest.classList.add('flex');
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
