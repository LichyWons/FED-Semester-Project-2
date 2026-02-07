import { loginUser, createApiKey } from '../js/api.js';

const form = document.querySelector('#login-form');
const errorEl = document.querySelector('#login-error');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (errorEl) errorEl.textContent = '';

  try {
    const email = form.email.value.trim();
    const password = form.password.value;

    const result = await loginUser({ email, password });

    localStorage.setItem('token', result.data.accessToken);
    localStorage.setItem(
      'user',
      JSON.stringify({
        name: result.data.name,
        email: result.data.email,
        avatar: result.data.avatar,
        banner: result.data.banner,
      }),
    );

    let apiKey = localStorage.getItem('apiKey');
    if (!apiKey) {
      const apiKeyRes = await createApiKey(
        result.data.accessToken,
        'Auction Website',
      );
      apiKey = apiKeyRes.data.key;
      localStorage.setItem('apiKey', apiKey);
    }

    window.location.assign('../index.html');
  } catch (err) {
    console.error(err);
    if (errorEl) errorEl.textContent = err.message || 'Login failed';
  }
});
