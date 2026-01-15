import { registerUser } from '../js/api.js';

const form = document.getElementById('register-form');
const errorMessage = document.getElementById('form-error-mail');
const passwordErrorMessage = document.getElementById('form-error-password');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  errorMessage.textContent = '';
  passwordErrorMessage.textContent = '';
  const username = form.elements['username'].value;
  const email = form.elements['email'].value;
  const password = form.elements['password'].value;
  const confirmPassword = form.elements['confirm-password'].value;

  if (!email.endsWith('@stud.noroff.no')) {
    errorMessage.textContent =
      ' Achtung!!! Email must be a stud.noroff.no address.';

    return;
  }

  if (password !== confirmPassword) {
    passwordErrorMessage.textContent = 'Passwords do not match.';

    return;
  }

  try {
    const result = await registerUser({ name: username, email, password });
    console.log(result);
  } catch (err) {
    passwordErrorMessage.textContent = err.message;
  }
});
