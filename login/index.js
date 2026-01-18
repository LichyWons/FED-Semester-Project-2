import { loginUser } from '../js/api.js';
const form = document.getElementById('login-form');
const loginErrorMessage = document.getElementById('form-error-login');

form.addEventListener('submit', async (event) => {
  loginErrorMessage.textContent = '';
  event.preventDefault();
  loginErrorMessage.textContent = '';
  const email = form.elements['email'].value;
  const password = form.elements['password'].value;

  try {
    const result = await loginUser({ email, password });
    const token = result.accessToken;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(result.data));
    window.location.href = '../index.html';
    console.log(result);
    console.log(result.data.accessToken);
    console.log('token?', result.data.accessToken);
    console.log('user?', requestIdleCallback.data);
  } catch (err) {
    loginErrorMessage.textContent = err.message;
  }
});
